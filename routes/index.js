const express = require("express"),
      router = express.Router(),
      passport = require("passport"),
      User = require("../models/user");

// Landing Page
router.get("/", (req, res) => res.render("landing"))

// Show Register Form
router.get("/register", (req, res) => {
    console.log("rendering the /register page changing class")
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
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message)
            return res.redirect("/register")
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to YelpCamp, " + user.username + "!")
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