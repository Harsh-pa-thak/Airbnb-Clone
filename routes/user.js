const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");

router.get("/signup", (req, res) => {
    res.render("users/signup");
});

router.post("/signup",async (req, res) => {
    let { username, email, password } = req.body;
    const user = new User({ username, email });
    await User.register(user, password);
    req.flash("success", "Welcome to AirBnb");
    res.redirect("/listings");
});

module.exports = router;