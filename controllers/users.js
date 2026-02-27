module.exports.signupGet = (req, res) => {
    res.render("users/signup");
};

module.exports.signupPost=async (req, res) => {
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
};

module.exports.loginGet = (req, res) => {
    res.render("users/login");
}

module.exports.loginPost =async (req, res) => {
    req.flash("success", "Logged in successfully");
    res.redirect(res.locals.redirectUrl || "/listings");
};