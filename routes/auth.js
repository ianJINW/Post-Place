const express = require("express");
const rateLimit = require("express-rate-limit");

const authController = require("../controllers/authController");
const upload = require("../config/multer");
const authMiddleware = require("../middleware/auth");
const ownerMiddleware = require("../middleware/owner");
const adminMiddleware = require("../middleware/admin");

// Middleware for file upload
const uploadMiddleware = (req, res, next) => {
	upload.single("profile")(req, res, err => {
		if (err) {
			return res.status(400).send("Error uploading file: " + err.message);
		}
		next();
	});
};

const router = express.Router();

// Rate limiting for login
const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // limit each IP to 10 requests per windowMs
	handler: (req, res) => {
		req.flash(
			"error",
			"Too many login attempts from this IP, please try again after 15 minutes."
		);
		res.redirect("/login");
	}
});

// Login routes
router
	.route("/login")
	.get((req, res) => {
		if (req.isAuthenticated()) {
			return res.redirect("/home");
		}
		res.render("auth");
	})
	.post(loginLimiter, authController.login);

// Registration routes
router
	.route("/register")
	.get((req, res) => {
		if (req.isAuthenticated()) {
			return res.redirect("/home");
		}
		res.render("auth");
	})
	.post(uploadMiddleware, authController.createUser);

// General auth route
router.route("/auth").get((req, res) => {
	res.render("auth");
});

// Protected routes
router.use(authMiddleware);

router.route("/home").get((req, res) => {
	if (req.session.views) {
		req.session.views++;
		console.log(`<p>Number of views: ${req.session.views}</p>`);
	} else {
		req.session.views = 1;
		console.log("Welcome! Refresh the page to start counting views.");
	}
	res.render("index");
});

router.route("/account", ownerMiddleware).get((req, res) => {
	req.flash("info", "This is risky business.");
	res.render("account");
});

router
	.route("/users/:id")
	.get(authController.getUserById)
	.patch(authController.updateUser)
	.delete(authController.deleteUser);

router.route("/protected", adminMiddleware).get(authController.getUsers);

router.get("/logout", authController.logout);

// Home route
router.get("/", (req, res) => {
	console.log(`${req.method} request for '${req.url}'`);
	if (req.session.views) {
		req.session.views++;
		console.log(`<p>Number of views: ${req.session.views}</p>`);
	} else {
		req.session.views = 1;
		console.log("Welcome! Refresh the page to start counting views.");
	}

	if (req.isAuthenticated()) {
		return res.redirect("/posts");
	}
	res.render("auth");
});

router.get(
	"/admin-account/:id",
	adminMiddleware,
	ownerMiddleware,
	(req, res) => {
		res.render("adminAccount", { user: req.user });
	}
);

// Error handling middleware (optional)
router.use((err, req, res, next) => {
	console.error(err.stack);
	req.flash("error", "Somehing broke");
	res.redirect("/login");
});

module.exports = router;
