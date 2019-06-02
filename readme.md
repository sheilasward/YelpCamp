# YelpCamp

* Add Landing Page
* Add Campgrounds Page that lists all campgrounds

Each Campground has:
* Name
* Images

Sample Campgrounds:
  (Images are from photosforclass.com - search 'camping')
[  
    {
        name: "Daisy Mountain", 
        image: "https://farm9.staticflickr.com/8283/7642409496_c042aa25f1.jpg",
        description: "This place has lots of trees and also lots of other stuff"
    },
    {
        name: "Ogeechee River", 
        image: "https://farm4.staticflickr.com/3304/3202553450_128f1baf6b.jpg",
        description: "Campground near Savannah, Georgia"
    },
    {
        name: "Deserty Desert", 
        image: "https://farm9.staticflickr.com/8236/8510529942_cdddc7175d.jpg",
        description: "Hot, dry, and deserty"
    },
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa", 
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
    {
        name: "Salmon Creek", 
        image: "https://farm9.staticflickr.com/8750/16695761124_b6c1c9b95d.jpg",
        description: "Beautiful campground at Aravaipa Creek"
    }
]

# Layout and Basic Styling
* Create header and footer partials
* Add in Bootstrap

# Creating New Campgrounds
* Setup new campground POST route
* Add in body-parser
* Setup route to show form
* Add basic unstyled form

# Style the campgrounds page
* Add a better header/title
* Make campgrounds display in a grid

# Add Mongoose
* Install and configure mongoose
* Setup campground model
* Use campground model inside of our routes

# Show Page
* Review the RESTful routes we've seen so far
* Add description to our campground model
* Show db.collection.drop()
* Add a show route/template

# Refactor Mongoose Code
* Create a models directory
* Use module.exports
* Require everything correctly!

# Add Seeds File
* Add a seeds.js file
* Run the seeds file every time the server starts

# Add the Comment model!
* Make our errors go away
* Display comments on campground show page

# Comment New/Create
* Discuss nested routes
* Add the comment new and create routes
* Add the new comment form

## Style Show Page
* Add sidebar to show page
* Display comments nicely

## Finish Styling Show Page
* Add public directory
* Add custom stylesheet

## Auth Pt. 1 - Add User Model
* Install all packages needed for auth
* Define User model

## Auth Pt. 2 - Register
* Configure Passport
* Add register routes
* Add register template

## Auth Pt. 3 - Login
* Add login routes
* Add login template

## Auth Pt. 4 - Logout/Navbar
* Add logout route
* Prevent user from adding a comment if not signed in
* Add links to navbar
* Show/hide auth links correctly

## Auth Pt. 5 - Show/Hide Links
* Show/hide auth links in navbar correctly

## Refactor The Routes
* Use Express router to reorganize all routes

## Users + Comments
* Associate users and comments
* Save author's name to a comment automatically

# Editing Campgrounds
* Add Method-Override
* Add Edit Route for Campgrounds
* Add Link to Edit Page
* Add Update Route

# Deleting Campgrounds
* Add Destroy Route
* Add Delete Button

# Authorization Part 1:  Campgrounds
* User can only edit his/her campgrounds
* User can only delete his/her campgrounds
* Hide/Show edit and delete buttons

# Editing Comments
* Add Edit route for comments
* Add Edit button
* Add Update route

Campground Edit Route:  /campgrounds/:id/edit
Comment Edit Route:  /campgrounds/:id/comments/:id/edit  (note: the two /:id/ are not the same)
The first /:id/ is the campground id, where the second /:id/ is the comment id, so...
Comment Edit Route:  /campgrounds/:id/comments/:comment_id/edit
But the route has been shortened by setting in app.js: app.use("/campgrounds/:id/comments", commentRoutes);
So... 
Comment Edit Route:  /:comment_id/edit

# Deleting Comments
* Add Destroy route
* Add Delete Button

Campground Destroy Route:  /campgrounds/:id
Comment Destroy Route: /campgrounds/:id/comments/:comment_id =>  /:comment_id

# Authorization Part 2:  Comments
* User can only edit his/her comments
* User can only delete his/her comments
* Hide/Show edit and delete buttons
* Refactor Middleware

# Adding in Flash!
* Demo working version
* Install and configure connect-flash
* Add bootstrap alerts to header

# Added in 15th commit:
* UI Improvements (login and signup, navbar)
* Pricing Feature
* Google Maps
* Time since (campground created, comment added), created with Moment
 

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
