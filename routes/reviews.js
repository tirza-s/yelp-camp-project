// ADD A REVIEW 
router.post("/:id/reviews", validateCampGround, catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

// DELETE REVIEW 
router.delete("/:id/reviews/:reviewId", catchAsync(async(req,res) => {
    const { id, reviewId } = req.params;
    // remove the reference to this review from the reviews array and then delete the entire review.
    await CampGround.findByIdAndUpdate(id, {$pull: {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))