const express = require("express");
const rateLimit = require("express-rate-limit");

const authController = require("../controllers/authController");
const upload = require("../config/multer");
const authMiddleware = require("../middleware/auth");

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

// Home route
router.get("/", (req, res) => {
	console.log(`${req.method} request for '${req.url}'`);
	if (req.isAuthenticated()) {
		return res.render("index");
	}
	res.render("auth");
});

// Login routes
router
	.route("/login")
	.get((req, res) => {
		res.render("auth");
	})
	.post(loginLimiter, authController.login);

// Registration routes
router
	.route("/register")
	.get((req, res) => {
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
	res.render("index");
});

router.route("/users").get(authController.getUsers);

router
	.route("/users/:id")
	.get(authController.getUserById)
	.delete(authController.deleteUser);

router.route("/protected").get(authController.getUsers);

router.get("/logout", authController.logout);

// Error handling middleware (optional)
router.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something broke!");
});

module.exports = router;
