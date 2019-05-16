const express = require("express"),
      exphbs = require("express-handlebars"),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      app = express(),
      PORT = process.env.PORT || 3000;

// Require models
const Campground = require("./models/campground"),
      Comment = require("./models/comment"),
      User = require("./models/user"),
      seedDB = require("./seeds"); 

// turn on debugging so you can see what's being sent to mongodb
mongoose.set("debug", true);

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/yelp_camp";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set("view engine", "handlebars")
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))

// Seed the databases
seedDB();

// Configure Passport
app.use(require("express-session")({
    secret: "I love Mar-Mar forever!",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
})

// Routes
app.get("/", (req, res) => res.render("landing"))

//INDEX - show all campgrounds
app.get("/campgrounds", (req, res) => {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err)
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds})
        }
    })
})

app.post("/campgrounds", (req, res) => {
    // get data from form and add to campgrounds array
    let newName = req.body.CGname
    let newImg = req.body.CGimage
    let newDesc = req.body.CGdescription
    let newCampground = {name: newName, image: newImg, description: newDesc}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err)
        } else {
            // redirect back to campgrounds page
            res.redirect("/campgrounds")
        }
    })
})

// Images are from photosforclass.com (search camping)
// Daisy Mountain,  https://farm9.staticflickr.com/8283/7642409496_c042aa25f1.jpg
// Ogeechee River,  https://farm4.staticflickr.com/3304/3202553450_128f1baf6b.jpg

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/newCG")
})


// SHOW - shows more info about one campground
app.get("/campgrounds/:id", (req, res) => {
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

// ===============
// COMMENTS ROUTES
// ===============

app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err)
        } else {
            res.render("comments/new", {campground: campground})
        }
    })
})

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err)
                } else {
                    campground.comments.push(comment)
                    campground.save()
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
    // create new comment
    // connect new comment to campground
    // redirect campground show page
})

//==============
// AUTH ROUTES
//==============

// Show Register Form
app.get("/register", (req, res) => {
    res.render("register");
})

// Process Register Form
app.post("/register", (req, res) => {
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
app.get("/login", (req, res) => {
    res.render("login")
})

// Handle Login Route
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res) => {
})

// Logout Route
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campgrounds")
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(PORT, () => console.log("The YelpCamp Server Has Started!"))