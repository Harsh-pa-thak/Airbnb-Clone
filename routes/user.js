const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapasync.js");

router.get("/signup", (req, res) => {
    res.render("users/signup");
});

router.post("/signup",wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const user = new User({ username, email });
        await User.register(user, password);
        req.flash("success", "Welcome to AirBnb");
        res.redirect("/listings");
    }catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
}));

module.exports = router;