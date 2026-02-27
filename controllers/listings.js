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
