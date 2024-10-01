module.exports = (req, res, next) => {
	// Ensure the user is logged in and is an admin
	if (req.user && req.user.role === "admin") {
		return next();
	}

	// If not an admin, flash error and redirect
	req.flash("error", "Only administrators can access this route.");
	return res.redirect("/");
};
