const express = require("express"),
      router = express.Router(),
      passport = require("passport"),
      middleware = require("../middleware"),
      User = require("../models/user"),
      Campground = require("../models/campground");

require('dotenv').config();

// User Profiles
router.get("/:id", (req, res) => {
    User.findById(req.params.id, function(err, foundUser) {
        if (err) {
            req.flash("error", "Something went wrong...")
            res.redirect("/")
        }
        console.log("req.params.id = " + req.params.id)
        console.log("foundUser = " + foundUser)
        Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds) {
            if (err) {
                req.flash("error", "Something went wrong...")
                res.redirect("/")
            }
            console.log("campgrounds = " + campgrounds)
            res.render("users/show", {
                user: foundUser, 
                campgrounds: campgrounds,
                CG: '',
                newCG: '',
                admin: '',
                profile: 'active',
                logout: '',
                login: '',
                register: '',
                helpers: {
                    ifCond: function(v1, options) {
                        if (req.isAuthenticated()) {
                            console.log("req.user.id = " + req.user.id)
                            console.log("req.user.isAdmin = " + req.user.isAdmin)
                            console.log("foundUser._id = " + foundUser._id)
                            if (req.user.id == foundUser._id) {
                                return options.fn(this);
                            }
                            return options.inverse(this);
                        }
                    },
                }
            })
        })
    })
})

// EDIT: Edit User Information
router.get("/:id/edit", (req, res) => {
    User.findById(req.user.id, function (err, currentUser) {
        console.log("currentUser.id = " + currentUser.id)
        console.log("req.params.id = " + req.params.id)
        res.render("users/edit", {
            user: currentUser,
            CG: '',
            newCG: '',
            admin: '',
            profile: 'active',
            logout: '',
            login: '',
            register: ''
        })
    })
})


// UPDATE: Update User Information
router.put("/:id", (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser) {
        if (err) {
            req.flash("error", "Could not update user")
            res.redirect("back")
        } else {
            req.flash("success", "User information updated!")
            return res.redirect("/users/" + req.params.id)
        }
    })
})

module.exports = router;