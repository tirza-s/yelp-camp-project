// Secure from user send empty datas from postman

const Joi = require("Joi");

module.exports.campGroundSchema = Joi.object({
    campground: Joi.object({
        description: Joi.string().required(),
        image: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        title: Joi.string().required()
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required()
    }).required()
})