const express = require("express"),
      exphbs = require("express-handlebars"),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      app = express(),
      PORT = process.env.PORT || 3000

// turn on debugging so you can see what's being sent to mongodb
mongoose.set("debug", true);

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/yelp_camp";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set("view engine", "handlebars")
app.use(bodyParser.urlencoded({extended: true}))

// Schema Setup
let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
})

let Campground = mongoose.model("Campground", campgroundSchema)

/*
Campground.create(
    {
        name: "Granite Hill",
        image: "https://farm5.staticflickr.com/4044/4175370953_5488caf554.jpg",
        description: "This is a huge granite hill, no bathrooms, no water.  Beautiful granite!"
    }, function(err, campground) {
        if (err) {
            console.log(err)
        } else {
            console.log("NEWLY CREATED CAMPGROUND: ")
            console.log(campground)
        }
    }
)
*/
/*
 // Campground data
let campgrounds = [
    {name: "Salmon Creek", image: "https://farm2.staticflickr.com/1274/4670974422_ec49d65ab2.jpg"},
    {name: "Granite Hill", image: "https://farm5.staticflickr.com/4044/4175370953_5488caf554.jpg"},
    {name: "Mountain Goat's Rest", image: "https://farm1.staticflickr.com/82/225912054_690e32830d.jpg"},
    {name: "Daisy Mountain", image: "https://farm9.staticflickr.com/8283/7642409496_c042aa25f1.jpg"},
    {name: "Ogeechee River", image: "https://farm4.staticflickr.com/3304/3202553450_128f1baf6b.jpg"},
    {name: "Salmon Creek", image: "https://farm2.staticflickr.com/1274/4670974422_ec49d65ab2.jpg"},
    {name: "Granite Hill", image: "https://farm5.staticflickr.com/4044/4175370953_5488caf554.jpg"},
    {name: "Mountain Goat's Rest", image: "https://farm1.staticflickr.com/82/225912054_690e32830d.jpg"},
    {name: "Daisy Mountain", image: "https://farm9.staticflickr.com/8283/7642409496_c042aa25f1.jpg"},
    {name: "Ogeechee River", image: "https://farm4.staticflickr.com/3304/3202553450_128f1baf6b.jpg"}
] */

// Routes
app.get("/", (req, res) => res.render("landing"))

//INDEX - show all campgrounds
app.get("/campgrounds", (req, res) => {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err)
        } else {
            res.render("index", {campgrounds:allCampgrounds})
        }
    })
    //res.render("campgrounds", {campgrounds: campgrounds})
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
    res.render("newCG")
})


// SHOW - shows more info about one campground
app.get("/campgrounds/:id", (req, res) => {
    // Find the campground with the provided ID
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log(err)
        } else {
            // render show template with that campground
            res.render("show", {campground: foundCampground})
        }
    })
})

app.listen(PORT, () => console.log("The YelpCamp Server Has Started!"))