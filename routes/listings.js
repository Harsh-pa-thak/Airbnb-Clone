const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
const { isLoggedIn, isOwner , validate } = require("../middelware.js");
const controllers = require("../controllers/listings.js");
const {cloudinary, storage} = require("../cloudConfig.js");
const multer  = require('multer')
const upload = multer({ storage })

router.route("/")
.get( wrapAsync(controllers.index))
//.post(isLoggedIn, validate, wrapAsync(controllers.createListing));
.post(upload.single('image'), (req, res) => {
    res.send(req.file);
});

router.get("/newListings", isLoggedIn, controllers.renderNewForm);

router.route("/:id")
.get(wrapAsync(controllers.showListing))
.put(isLoggedIn,isOwner,validate, wrapAsync(controllers.updateListing))
.delete(isLoggedIn, wrapAsync(controllers.deleteListing));

router.get("/:id/edit",isLoggedIn, wrapAsync(controllers.editform));

module.exports = router;