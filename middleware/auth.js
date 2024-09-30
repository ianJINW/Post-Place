module.exports = (req, res, next) => {
	if (req.isAuthenticated()) {
		res.locals.IsLoggedIn = true;
		return next();
	}
	res.redirect("/login");
};
