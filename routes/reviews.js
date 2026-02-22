const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
const Review = require("../models/review.js");
const reviewSchema = require('../schema.js').reviewSchema;
const CustomError= require("../utils/customError.js");
const Listing = require("../models/listing.js");


const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new CustomError(msg, 400);
  } else {
    next();
  }
};

router.post('/',validateReview,wrapAsync(async (req,res)=>{
  let listing = await Listing.findById(req.params.id);
  let review = new Review(req.body.review);
  listing.reviews.push(review);
  await review.save();
  await listing.save();
  req.flash("success", "Successfully added a new review");
  res.redirect(`/listings/${req.params.id}`);
 
}))

router.delete('/:reviewId',wrapAsync(async (req,res)=>{
  let {id , reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted the review");
  res.redirect(`/listings/${id}`);
}));

module.exports = router;