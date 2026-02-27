const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
const { isLoggedIn, isOwner , validate } = require("../middelware.js");
const controllers = require("../controllers/listings.js");

router.route("/")
get("/", wrapAsync(controllers.index));


router.post("/", isLoggedIn, validate, wrapAsync(controllers.createListing));


router.get("/newListings", isLoggedIn, controllers.renderNewForm);

router.get("/:id", wrapAsync(controllers.showListing));



router.get("/:id/edit",isLoggedIn, wrapAsync(controllers.editform));

router.put("/:id",isLoggedIn,isOwner,validate, wrapAsync(controllers.updateListing));
  
router.delete("/:id",isLoggedIn, wrapAsync(controllers.deleteListing));

module.exports = router;