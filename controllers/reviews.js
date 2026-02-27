const Review = require("../models/review.js");
const Listing = require("../models/listing.js");



module.exports.createReview=async (req,res)=>{
  let listing = await Listing.findById(req.params.id);
  let review = new Review(req.body.review);
  review.author = req.user._id;
  listing.reviews.push(review);
  await review.save();
  await listing.save();
  req.flash("success", "Successfully added a new review");
  res.redirect(`/listings/${req.params.id}`);
 
};
