const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const CampgroundSchema = new Schema({
    description : String, 
    image: String,
    location : String,
    price : Number,
    title : String,
    reviews: [
        {
            ty
        }
    ]
});

module.exports = mongoose.model("CampGround", CampgroundSchema);