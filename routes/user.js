const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middelware.js");
const controllers = require("../controllers/users.js");

router.route("/signup")
.get(controllers.signupGet)
.post(wrapAsync(controllers.signupPost));


router.get("/login", controllers.loginGet);
router.post("/login",saveRedirectUrl,passport.authenticate('local',{failureFlash:true , failureRedirect:"/login"}),wrapAsync(controllers.loginPost));

router.get("/logout", controllers.logout);


module.exports = router;