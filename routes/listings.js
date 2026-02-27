const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner , validate } = require("../middelware.js");
const listingController = require("../controllers/listings.js");

router.get("/", wrapAsync(
  listingController.index
));

router.get("/newListings", isLoggedIn ,listingController.renderNewForm);

router.get("/:id", wrapAsync(listingController.createListing));

router.post("/", isLoggedIn, validate, wrapAsync(
  listingController.newlisting
));

router.get("/:id/edit",isLoggedIn, wrapAsync(listingController.editform));

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