const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
const reviewSchema = require('../schema.js').reviewSchema;
const CustomError= require("../utils/customError.js");
const { isLoggedIn,isReviewAuthor } = require("../middelware.js");
const controllers = require("../controllers/reviews.js");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new CustomError(msg, 400);
  } else {
    next();
  }
};

router.post('/',validateReview,isLoggedIn,wrapAsync(controllers.createReview));

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(controllers.deleteReview));

module.exports = router;