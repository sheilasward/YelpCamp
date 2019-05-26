const Campground = require("../models/campground"),
      Comment = require("../models/comment");

// All the middleware goes here
let middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err || !foundCampground) {
                req.flash("error", "Campground not found")
                res.redirect("back")
            } else {
                // Does User own the campground?
                // (use the "equals" method to compare object to string)
                if (foundCampground.author.id.equals(req.user._id)) {
                    next()
                } else {
                    // User does not own campground
                    req.flash("error", "You don't have permission to do that")
                    res.redirect ("back")
                }
            }
        })
    } else {
        // User is not logged in - redirect with message
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back")  // to previous page
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err || !foundComment) {
                req.flash("error", "Comment not found")
                res.redirect("back")
            } else {
                // Does User own the comment?
                // (use the "equals" method to compare object to string)
                if (foundComment.author.id.equals(req.user._id)) {
                    next()
                } else {
                    // User does not own comment
                    req.flash("error", "You don't have permission to do that")
                    res.redirect ("back")
                }
            }
        })
    } else {
        // User is not logged in - redirect
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back")  // to previous page
    }   
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that")
    res.redirect("/login")
}

module.exports = middlewareObj;