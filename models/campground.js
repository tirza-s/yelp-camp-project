const mongoose = require("mongoose");
const { reviewSchema } = require("../schemas");
const Review = require("./review");
const Schema = mongoose.Schema; 

const CampgroundSchema = new Schema({
    description : String, 
    image: String,
    location : String,
    price : Number,
    title : String,
    reviews: [
        {
            type : Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

//This is a query middleware and it's it's going to pass in the document.
//If it found a document and deleted it to the function versus
//some of the other middleware, you'll see
//they actually can access the keyword.
//this to refer to the specific document that's been removed or 
//that's about to be removed.

// MIDDLEWARE FOR REVIEW
CampgroundSchema.post("findOne;AndDelete", async function(doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in : doc.reviews
            }
        })
    }
})

module.exports = mongoose.model("CampGround", CampgroundSchema);