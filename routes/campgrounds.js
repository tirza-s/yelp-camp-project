const express = require("express"); 
const router = express.Router();
const catchAsync = require("../exceptions/catchAsync");
const { campgroundSchema, reviewSchema } = require ("../schemas.js");
const ExpressError = require("../exceptions/ExpressError");
const CampGround = require("../models/campground");

// Review Middleware 
const validateCampGround = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(er => er.message).join(",")
        throw new ExpressError(msg, 404)
    } else {
        next();
    }
}

router.get("/", catchAsync (async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render("campgrounds/index", { campgrounds });
}));

// ADDING NEW campground
router.get("/new", catchAsync (async(req, res) => {
    res.render("campgrounds/new");
}));

// CREATE new campground
router.post("/", validateCampGround, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError("Invalid Data", 400);
    const campground = new CampGround(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

// FIND BY ID
router.get("/:id", catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id).populate("reviews");
    res.render("campgrounds/show", { campground });
}))

// EDIT -> first find the campground by id then update
router.get("/:id/edit", catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
}))

// UPDATE
router.put("/:id", validateCampGround, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
}))

// DELETE 
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    res.redirect("/campgrounds");
})

module.exports = router;