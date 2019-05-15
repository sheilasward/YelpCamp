const express = require("express"),
      exphbs = require("express-handlebars"),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
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

seedDB();

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

app.get("/campgrounds/:id/comments/new", (req, res) => {
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err)
        } else {
            res.render("comments/new", {campground: campground})
        }
    })
})

app.post("/campgrounds/:id/comments", (req, res) => {
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

app.listen(PORT, () => console.log("The YelpCamp Server Has Started!"))