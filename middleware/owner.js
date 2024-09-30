module.exports = (req, res, next) => {
	// Ensure the user is logged in
	if (!req.user) {
		req.flash("error", "You must be logged in to view this account.");
		return res.redirect("/login");
	}

	const userId = String(req.user.id); // Convert to string for safety
	const requestedId = String(req.params.id); // Get the requested account ID

	// Allow access if the user is accessing their own account
	if (userId === requestedId) {
		return next();
	}

	// If not, flash an error and redirect
	req.flash("error", "You can only access your own account.");
	return res.redirect("/");
};
