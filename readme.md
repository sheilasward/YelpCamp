#YelpCamp

* Add Landing Page
* Add Campgrounds Page that lists all campgrounds

Each Campground has:
* Name
* ImageS

[
    {name: "Salmon Creek", image: "http://www.image.com"}
]

#Layout and Basic Styling
* Create header and footer partials
* Add in Bootstrap

#Creating New Campgrounds
* Setup new campground POST route
* Add in body-parser
* Setup route to show form
* Add basic unstyled form

#Style the campgrounds page
* Add a better header/title
* Make campgrounds display in a grid

#Add Mongoose
* Install and configure mongoose
* Setup campground model
* Use campground model inside of our routes

#Show Page
* Review the RESTful routes we've seen so far
* Add description to our campground model
* Show db.collection.drop()
* Add a show route/template

#Refactor Mongoose Code
* Create a models directory
* Use module.exports
* Require everything correctly!

#Add Seeds File
* Add a seeds.js file
* Run the seeds file every time the server starts

#Add the Comment model!
* Make our errors go away
* Display comments on campground show page

#Comment New/Create
* Discuss nested routes
* Add the comment new and create routes
* Add the new comment form

##Style Show Page
* Add sidebar to show page
* Display comments nicely

##Finish Styling Show Page
* Add public directory
* Add custom stylesheet

##Auth Pt. 1 - Add User Model
* Install all packages needed for auth
* Define User model

##Auth Pt. 2 - Register
* Configure Passport
* Add register routes
* Add register template

##Auth Pt. 3 - Login
* Add login routes
* Add login template

##Auth Pt. 4 - Logout/Navbar
* Add logout route
* Prevent user from adding a comment if not signed in
* Add links to navbar
* Show/hide auth links correctly

##Auth Pt. 5 - Show/Hide Links
* Show/hide auth links in navbar correctly

##Refactor The Routes
* Use Express router to reorganize all routes


RESTFUL ROUTES

name     url                            verb      desc
===========================================================================
INDEX   /campgrounds                    GET     Display a list of all campgrounds
NEW     /campgrounds/new                GET     Displays form to make a new campground
CREATE  /campgrounds                    POST    Add new campground to campground collection
SHOW    /campgrounds/:id                GET     Shows info about one campground

(nested routes)
NEW     /campgrounds/:id/comments/new   GET     Displays a form to make a new comment about one campground
CREATE  /campgrounds/:id/comments       POST    Add new comment to campground and comment collections
