const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middelware.js");
const controllers = require("../controllers/users.js");

router.get("/signup", controllers.signupGet);

router.post("/signup",wrapAsync(controllers.signupPost));

router.get("/login", controllers.loginGet);

router.post("/login",saveRedirectUrl,passport.authenticate('local',{failureFlash:true , failureRedirect:"/login"}),wrapAsync(controllers.loginPost));

router.get("/logout", (req, res,next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "You have been logged out");
        res.redirect("/listings");
    });
});


module.exports = router;