const listing = require("./models/listing");
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
