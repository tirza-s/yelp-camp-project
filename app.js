const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { campGroundSchema } = require("./schemas.js"); // using Joi JS validator tool (look at schemas.js)
const catchAsync = require("./exceptions/catchAsync");
const ExpressError = require("./exceptions/ExpressError");
const methodOverride = require("method-override")

const CampGround = require("./models/campground");
const { read } = require("fs");
const { request } = require("http");

// Make a connection with mangoose 
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("DATABASE CONNECTED !");
})

const app = express();
const port = 8080;

// templating set up for EJS
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// request body is empty so we need to pass the request through the express
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));

// Middleware -> Using Joi in separate file (schemas.js)
const validateCampGround = (req, res, next) => {
        const { error } = campGroundSchema.validate(req.body)
        if(error){
            const msg = error.details.map(el => el.message).join(",")
            throw new ExpressError(msg, 400)
        } else {
            next();
        }
}

// Home
app.get("/", (req, res) => {
    res.render("home");
})

app.get("/campgrounds", async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render("campgrounds/index", { campgrounds });
})

// Adding new campground
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
})

// Create new campground
app.post("/campgrounds", validateCampGround, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError("Invalid Data", 400);
        const campground = new CampGround(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
}))

// FIND BY ID
app.get("/campgrounds/:id", async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    res.render("campgrounds/show", { campground });
})

// EDIT -> first find the campground by id then update
app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
}))

// UPDATE
app.put("/campgrounds/:id", validateCampGround, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
}))

// DELETE 
app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    res.redirect("/campgrounds");
})

// ****** ORDER MATTER  ******//

app.all("*",(req,res,next) => {
    next(new ExpressError("404 ! Not Found ", 404))
})

// Handling error message pass to next
app.use((err,req,res,next) => {
    //destructure
    const { statusCode = 500 } = err;  
    if(!err.message) err.message = "Something went wrong!" 
    res.status(statusCode).render("error", { err });
})

// LISTEN TO THE PORT 8080 
app.listen(port, () => {
    console.log(`LISTENING ON PORT 8080, ${port}`);
})

