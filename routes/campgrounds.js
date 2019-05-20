const express = require("express"),
      router = express.Router(),
      Campground = require("../models/campground");

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
router.post("/", isLoggedIn, (req, res) => {
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
router.get("/new", isLoggedIn, (req, res) => {
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
            // render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground})
        }
    })
})

// Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
