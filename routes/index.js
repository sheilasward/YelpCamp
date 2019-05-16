const express = require("express"),
      router = express.Router(),
      passport = require("passport"),
      User = require("../models/user");

// Landing Page
router.get("/", (req, res) => res.render("landing"))

// Show Register Form
router.get("/register", (req, res) => {
    res.render("register");
})

// Process Register Form
router.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/campgrounds")
        })
    })
})

// Show Login Form
router.get("/login", (req, res) => {
    res.render("login")
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
    res.redirect("/campgrounds")
})

// Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;