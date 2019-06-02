const express = require("express"),
      app = express(),
      router = express.Router(),
      Handlebars = require("express-handlebars"),
      User = require("../models/user"),
      middleware = require("../middleware")
      Campground = require("../models/campground");

moment = require('moment');
// Set up NodeGeocoder
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

// Set Handlebars
app.engine('handlebars', Handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Show all campgrounds
router.get("/", (req, res) => {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err)
        } else {
            res.render("campgrounds/index", {
                campgrounds: allCampgrounds,
                CG: 'active',
                newCG: '',
                logout: '',
                login: '',
                register: ''
            })
        }
    })
})

// NEW: new campground form
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/newCG", {
        CG: '',
        newCG: 'active',
        logout: '',
        login: '',
        register: ''
    })
})


// CREATE: Post new campground information into campground db
router.post("/", middleware.isLoggedIn, (req, res) => {
    // get data from form and add to campgrounds array
    let newName = req.body.CGname
    let newPrice = req.body.CGprice
    let newImg = req.body.CGimage
    let newDesc = req.body.CGdescription
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let ts = Date.now()
    let createdAt = moment(ts)
    geocoder.geocode(req.body.location, function(err, data) {
        if (err || !data.length) {
            console.log(err)
            req.flash("error", "Invalid address")
            return res.redirect("back")
        }
        let lat = data[0].latitude
        let lng = data[0].longitude
        let location = data[0].formattedAddress
        let newCampground = {name: newName, price: newPrice, image: newImg, description: newDesc, author:author, location: location, lat: lat, lng: lng, createdAt: createdAt}
        // Create a new campground and save to DB
        Campground.create(newCampground, function(err, newlyCreated) {
            if (err) {
                req.flash("error", "Not able to create new campground")
                console.log(err);
            } else {
                console.log(newlyCreated);
                // redirect back to campgrounds page
                req.flash("success", "New Campground created successfully!")
                res.redirect("/campgrounds")
            }
        })
    })
})

// Images are from photosforclass.com (search camping)
// Daisy Mountain,  https://farm9.staticflickr.com/8283/7642409496_c042aa25f1.jpg
// Ogeechee River,  https://farm4.staticflickr.com/3304/3202553450_128f1baf6b.jpg
// Deserty Desert,  https://farm9.staticflickr.com/8236/8510529942_cdddc7175d.jpg
// Mountain Goat's Rest, https://farm3.staticflickr.com/2519/4100687793_544a1ddea4.jpg

// SHOW: Shows more info about one particular campground
router.get("/:id", (req, res) => {
    // Find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err || !foundCampground) {
            req.flash("error", "Campground not found")
            console.log(err)
            res.redirect("back")
        } else {
            console.log(foundCampground)
            res.render("campgrounds/show", {
                campground: foundCampground,
                CG: '',
                newCG: '',
                logout: '',
                login: '',
                register: '',
                helpers: {
                    ifCond: function(v1, options) {
                        console.log(v1)
                        if (req.isAuthenticated()) {
                            if (foundCampground.author.id.equals(req.user._id)) {
                                return options.fn(this);
                            }
                            return options.inverse(this);
                        }
                    },
                    ifComm: function(v1, options) {
                        console.log("v1 = " + v1)
                        if (req.isAuthenticated()) {
                            console.log("req.user._id = " + req.user._id)
                            if (v1.equals(req.user._id)) {
                                return options.fn(this);
                            }
                            return options.inverse(this);
                        }
                    },
                    cgID: function(passedID) {
                        let newID = req.params.id
                        return newID;
                    },
                    fmt: function(passedDate) {
                        console.log("passedDate = " + passedDate)
                        let newDate = moment(passedDate).format('MM-DD-YYYY')
                        console.log("newDate = " + newDate)
                        return newDate;
                    },
                    since: function(passedTime) {
                        console.log("passedTime = " + passedTime)
                        let diffTime = moment().diff(moment(passedTime), "days");
                        console.log("diffTime = " + diffTime)

                        let newTime = moment(passedTime).fromNow()
                        console.log("newTime = " + newTime)
                        return newTime;
                    }
                } 
            })  
        }
    })
})

// EDIT: Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", {
            campground: foundCampground,
            CG: '',
            newCG: '',
            logout: '',
            login: '',
            register: ''
        })
    })
})

// UPDATE: Update campground route
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            console.log(err)
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
    
        // find and update the correct campground
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
            if (err) {
                console.log(err)
                req.flash("error", "Not able to update campground")
                res.redirect("/campgrounds")
            } else {
                // redirect somewhere (show page)
                req.flash("success", "Campground updated successfully!")
                res.redirect("/campgrounds/" + req.params.id)
            }
        })
    })
})

// DESTROY: Destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err)
            res.render("/campgrounds", {
                CG: 'active',
                newCG: '',
                logout: '',
                login: '',
                register: ''
            })
        } else {
            console.log(campground.comments)
            var i = campground.comments.length
            while (i--) {
                console.log("comment id: " + campground.comments[i])
                Comment.findByIdAndRemove(campground.comments[i], function(err) {
                    if (err) {
                        req.flash("error", "Could not delete comment")
                        return res.redirect("back")
                    } else {
                        console.log("comment successfully removed!")
                    }
                })
            }
            Campground.findByIdAndRemove(req.params.id, function (err) {
                if (err) {
                    req.flash("error", "Could not delete campground")
                    res.redirect("/campgrounds")
                } else {
                    req.flash("success", "Campground deleted!")
                    res.redirect("/campgrounds")
                }
            })
        }
    })
})

module.exports = router;
