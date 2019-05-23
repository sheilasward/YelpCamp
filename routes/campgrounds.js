const express = require("express"),
      app = express(),
      router = express.Router(),
      Handlebars = require("express-handlebars"),
      User = require("../models/user"),
      middleware = require("../middleware")
      Campground = require("../models/campground");

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
            res.render("campgrounds/index", {campgrounds:allCampgrounds})
        }
    })
})

// CREATE: Post new campground information into campground db
router.post("/", middleware.isLoggedIn, (req, res) => {
    // get data from form and add to campgrounds array
    let newName = req.body.CGname
    let newImg = req.body.CGimage
    let newDesc = req.body.CGdescription
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = {name: newName, image: newImg, description: newDesc, author:author}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            console.log(newlyCreated);
            // redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    })
})

// Images are from photosforclass.com (search camping)
// Daisy Mountain,  https://farm9.staticflickr.com/8283/7642409496_c042aa25f1.jpg
// Ogeechee River,  https://farm4.staticflickr.com/3304/3202553450_128f1baf6b.jpg
// Deserty Desert,  https://farm9.staticflickr.com/8236/8510529942_cdddc7175d.jpg

// NEW: new campground form
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/newCG")
})

// SHOW: Shows more info about one particular campground
router.get("/:id", (req, res) => {
    // Find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log(err)
        } else {
            console.log(foundCampground)
            res.render("campgrounds/show", {
                campground: foundCampground,
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
                            console.log("comment id = " + v1)
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
                    }
                } 
            })  
        }
    })
})

// EDIT: Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground})
    })
})

// UPDATE: Update campground route
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds")
        } else {
            // redirect somewhere (show page)
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// DESTROY: Destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds")
        }
    })
})

module.exports = router;
