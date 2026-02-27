const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middelware.js");
const controllers = require("../controllers/users.js");

router.get("/signup", controllers.signupGet);

router.post("/signup",wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const user = new User({ username, email });
        await User.register(user, password);
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
        req.flash("success", "Welcome to AirBnb");
        res.redirect("/listings");
        });
        
    }catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login",saveRedirectUrl,passport.authenticate('local',{failureFlash:true , failureRedirect:"/login"}),wrapAsync(async (req, res) => {
    req.flash("success", "Logged in successfully");
    res.redirect(res.locals.redirectUrl || "/listings");
}));

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