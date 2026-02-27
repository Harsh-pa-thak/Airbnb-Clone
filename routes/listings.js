const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
const { isLoggedIn, isOwner , validate } = require("../middelware.js");
const controllers = require("../controllers/listings.js");

router.route("/")
.get( wrapAsync(controllers.index))
.post(isLoggedIn, validate, wrapAsync(controllers.createListing));

router.get("/newListings", isLoggedIn, controllers.renderNewForm);

router.route("/:id")
.get(wrapAsync(controllers.showListing))
.put(isLoggedIn,isOwner,validate, wrapAsync(controllers.updateListing))
.delete(isLoggedIn, wrapAsync(controllers.deleteListing));

router.get("/:id/edit",isLoggedIn, wrapAsync(controllers.editform));

module.exports = router;