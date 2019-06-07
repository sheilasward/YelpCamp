const express = require("express"),
      router = express.Router(),
      passport = require("passport"),
      middleware = require("../middleware"),
      User = require("../models/user"),
      Campground = require("../models/campground");

require('dotenv').config();


// SHOW - Show Admin Page
router.get("/menu", middleware.isAdministrator, (req, res) => {
    res.render("admins/menu", {
        CG: '',
        newCG: '',
        admin: 'active',
        profile: '',
        logout: '',
        login: '',
        register: ''
    })
})

module.exports = router;