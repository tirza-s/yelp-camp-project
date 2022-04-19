const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { campGroundSchema, reviewSchema } = require("./schemas.js"); // using Joi JS validator tool (look at schemas.js)

const methodOverride = require("method-override");
const ExpressError = require("./exceptions/ExpressError");
const campgrounds = require("./routes/campgrounds");
const Review = require("./models/review");
const review = require("./models/review");
const catchAsync = require("./exceptions/catchAsync.js");

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

// use campgrounds router
app.use("/campgrounds", campgrounds);

// request body is empty so we need to pass the request through the express
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));

// Campground Middleware -> Using Joi in separate file (schemas.js)
const validateCampGround = (req, res, next) => {
    const { error } = campGroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// ****** ORDER MATTER  ******//

app.all("*", (req, res, next) => {
    next(new ExpressError("404 ! Not Found ", 404));
})

// Handling error message pass to next
app.use((err, req, res, next) => {
    //destructure
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong!"
    res.status(statusCode).render("error", { err });
})

// LISTEN TO THE PORT 8080 
app.listen(port, () => {
    console.log(`LISTENING ON PORT 8080, ${port}`);
})

