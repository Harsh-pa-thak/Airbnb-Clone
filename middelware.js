const Listing = require("./models/listing.js");
const listingSchema = require('./schema.js').listingSchema;
const CustomError= require("./utils/customError.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
    req.session.redirectUrl= req.originalUrl;
    req.flash("error", "You must be signed in to create a new listing");
    return res.redirect("/login");
  }
  next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}
module.exports.isOwner = async (req, res, next) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error", "Cannot find the listing");
    return res.redirect(`/listings/${id}`);
  }
  if(!listing.owner._id.equals(req.user._id)){
    req.flash("error", "You don't have permission to do that");
    return res.redirect(`/listings/${id}`);
  }
   next();
};
module.exports.validate =(req,res,next)=>{
  let {error}= listingSchema.validate(req.body);
  if(error){
    let em = error.details.map(el=>el.message).join(",");
    throw new CustomError(em,400);
  }else{
    next();
  }
}

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review || !review.author || !review.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that");
    return res.redirect(`/listings/${id}`);
  }

  next();
};