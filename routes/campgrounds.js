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

// NEW: new campground form
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/newCG")
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
    let newCampground = {name: newName, price: newPrice, image: newImg, description: newDesc, author:author}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            req.flash("error", "Not able to create new campground")
            console.log(err);
        } else {
            console.log(newlyCreated);
            // redirect back to campgrounds page
            req.flash("success", "New Campground created successfully!")
            res.redirect("/campgrounds");
        }
    })
})

// Images are from photosforclass.com (search camping)
// Daisy Mountain,  https://farm9.staticflickr.com/8283/7642409496_c042aa25f1.jpg
// Ogeechee River,  https://farm4.staticflickr.com/3304/3202553450_128f1baf6b.jpg
// Deserty Desert,  https://farm9.staticflickr.com/8236/8510529942_cdddc7175d.jpg

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
            req.flash("error", "Not able to update campground")
            res.redirect("/campgrounds")
        } else {
            // redirect somewhere (show page)
            req.flash("success", "Campground updated successfully!")
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// DESTROY: Destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            req.flash("error", "Not able to delete campground")
            res.redirect("/campgrounds")
        } else {
            req.flash("success", "Campground deleted!")
            res.redirect("/campgrounds")
        }
    })
})

module.exports = router;
