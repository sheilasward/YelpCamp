const express = require("express"),
      router = express.Router({mergeParams: true}),  // need mergeParams, because using comment route in app.js with ":id"
      Campground = require("../models/campground"),
      middleware = require("../middleware")
      Comment = require("../models/comment");

// Show new comment form (if logged in)
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err)
        } else {
            res.render("comments/new", {campground: campground})
        }
    })
})

// Post the new comment information into comments and campground dbs
router.post("/", middleware.isLoggedIn, (req, res) => {
    // Lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err)
            res.redirect("/campgrounds")
        } else {
            // Create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash("error", "Something went wrong")
                    console.log(err);
                } else {
                    // Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Save comment
                    comment.save();
                    // Connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    // Redirect campground show page
                    req.flash("success", "Comment added!")
                    return res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err || !foundCampground) {
            req.flash("error", "Campground not found")
            return res.redirect("back")
        }
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect("back")
            } else {
                res.render("comments/edit", {
                    campground_id: req.params.id,
                    comment: foundComment
                })
            }
        })    
    })
})

// COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            req.flash("error", "Could not update comment")
            res.redirect("back")
        } else {
            req.flash("success", "Comment updated!")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            req.flash("error", "Could not delete comment")
            res.redirect("back")
        } else {
            req.flash("success", "Comment deleted!")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

module.exports = router;