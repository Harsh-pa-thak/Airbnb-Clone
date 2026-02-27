const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner , validate } = require("../middelware.js");

router.get("/", wrapAsync(async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/listings", { listings});
}));
router.get("/newListings", isLoggedIn, (req, res) => {
  res.render("listings/newListing");
});

router.get("/:id", wrapAsync(async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if(!listing){
    req.flash("error", "Cannot find the listing");
    return res.redirect("/listings");
  }
  res.render("listings/listing-detail", { listing });
}));

router.post("/", isLoggedIn, validate, wrapAsync(async (req, res,next) => {
  const newListing = new Listing(req.body);
  newListing.owner = req.user._id; 
  await newListing.save();
  req.flash("success", "Successfully made a new listing");
  res.redirect("/listings");
}));

router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error", "Cannot find the listing");
    return res.redirect("/listings");
  }
  res.render("listings/editListing", { listing });
}));

router.put("/:id",isLoggedIn,isOwner,validate, wrapAsync(async (req, res) => {
  const id = req.params.id;
  await Listing.findByIdAndUpdate(id, {...req.body}); 
  req.flash("success", "Successfully updated the listing");
  res.redirect(`/listings/${id}`);
}));
  
router.delete("/:id",isLoggedIn, wrapAsync(async (req, res) => {
  const id = req.params.id;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the listing");
  res.redirect("/listings");
}));

module.exports = router;