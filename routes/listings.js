const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner , validate } = require("../middelware.js");
const controllers = require("../controllers/listings.js");

router.get("/", wrapAsync(controllers.index));

router.get("/newListings", isLoggedIn, controllers.renderNewForm);

router.get("/:id", wrapAsync(controllers.showListing));

router.post("/", isLoggedIn, validate, wrapAsync(controllers.createListing));

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