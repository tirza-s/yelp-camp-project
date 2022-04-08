const mongoose = require ("mongoose"); 
const schemas = mongoose.schemas;

const reviewSchema = new Schema({
    body : String, 
    rating: Number,
});

module.exports = mongoose.model("Review", reviewSchema);