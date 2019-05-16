const express = require("express"),
      router = express.Router({mergeParams: true}),  // need mergeParams, because using comment route in app.js with ":id"
      Campground = require("../models/campground"),
      Comment = require("../models/comment");

// Show new comment form (if logged in)
router.get("/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err)
        } else {
            res.render("comments/new", {campground: campground})
        }
    })
})

// Post the new comment information into comments and campground dbs
router.post("/", isLoggedIn, (req, res) => {
    // Lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            // Create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err)
                } else {
                    // Connect new comment to campground
                    campground.comments.push(comment)
                    campground.save()
                    // Redirect campground show page
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
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