const express = require("express")
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser")
const app = express()
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set("view engine", "handlebars")
app.use(bodyParser.urlencoded({extended: true}))

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
]

// Routes
app.get("/", (req, res) => res.render("landing"))

app.get("/campgrounds", (req, res) => {
    res.render("campgrounds", {campgrounds: campgrounds})
})

app.post("/campgrounds", (req, res) => {
    // get data from form and add to campgrounds array
    let newName = req.body.CGname
    let newImg = req.body.CGimage
    let newCampground = {name: newName, image: newImg}
    campgrounds.push(newCampground)
    console.log(newName)
    // redirect back to campgrounds page
    res.redirect("/campgrounds")
})

// Daisy Mountain,  https://farm9.staticflickr.com/8283/7642409496_c042aa25f1.jpg
// Ogeechee River,  https://farm4.staticflickr.com/3304/3202553450_128f1baf6b.jpg

app.get("/campgrounds/new", (req, res) => {
    res.render("newCG")
})

app.listen(port, () => console.log("The YelpCamp Server Has Started!"))