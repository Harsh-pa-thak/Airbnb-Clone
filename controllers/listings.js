const Listing = require("../models/listing.js");

module.exports.index =async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/listings", { listings});
};    

module.exports.renderNewForm =  (req, res) => {
  res.render("listings/newListing");
};
module.exports.showListing =async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if(!listing){
    req.flash("error", "Cannot find the listing");
    return res.redirect("/listings");
  }
  res.render("listings/listing-detail", { listing });
};

module.exports.createListing = async (req, res) => {
  let url = req.file.secure_url;
  let filename = req.file.public_id;
  const listing = new Listing({ ...req.body });
  listing.image.url = url;
  listing.image.filename = filename;
  listing.owner = req.user._id;
  await .save();
  req.flash("success", "Successfully created a new listing");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.editform=async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error", "Cannot find the listing");
    return res.redirect("/listings");
  }
  res.render("listings/editListing", { listing });
};

module.exports.updateListing = async (req, res) => {
  const id = req.params.id;
  await Listing.findByIdAndUpdate(id, {...req.body}); 
  req.flash("success", "Successfully updated the listing");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const id = req.params.id;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the listing");
  res.redirect("/listings");
};