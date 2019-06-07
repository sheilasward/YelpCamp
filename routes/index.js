const express = require("express"),
      router = express.Router(),
      passport = require("passport"),
      User = require("../models/user");
/*      Campground = require("../models/campground");   */

require('dotenv').config();

// Landing Page
router.get("/", (req, res) => res.render("landing"))

// Show Register Form
router.get("/register", (req, res) => {
    res.render("register", {
        CG: '',
        newCG: '',
        logout: '',
        login: '',
        register: 'active'
    })
})

// Process Register Form
router.post("/register", (req, res) => {
    let newUser = new User(
        {
            username: req.body.username,
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            avatar: req.body.avatar,
            email: req.body.email
        }
    );
    if (req.body.adminCode == process.env.ADMIN_CODE) {
        newUser.isAdmin = true
    }
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message)
            return res.redirect("/register")
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Successfully Signed Up! Nice to meet you " + user.username + "!")
            res.redirect("/campgrounds")
        })
    })
})

// Show Login Form
router.get("/login", (req, res) => {
    console.log("rendering the /login page changing class")
    res.render("login", {
        CG: '',
        newCG: '',
        logout: '',
        login: 'active',
        register: ''
    })
})

// Handle Login Form
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res) => {
})

// Logout Route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out!")
    res.redirect("/campgrounds")       
})

module.exports = router;