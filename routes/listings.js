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

router.get("/:id/edit",isLoggedIn, wrapAsync(controllers.editform));

router.put("/:id",isLoggedIn,isOwner,validate, wrapAsync(controllers.updateListing));
  
router.delete("/:id",isLoggedIn, wrapAsync(controllers.deleteListing));

module.exports = router;