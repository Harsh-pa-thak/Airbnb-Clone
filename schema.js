const joi = require('joi');
const listingSchema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().required().min(0),
    location: joi.string().required(),
    country: joi.string().required(),
    image: joi.string().allow("", null)
});

const reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number()
            .required()
            .min(1)
            .max(5),

        comment: joi.string()
            .trim()
            .min(3)
            .max(500)
            .required()
    }).required()
});
module.exports = {
    listingSchema,
    reviewSchema
}   