const express = require("express");

const router = express.Router();
const commentController = require("../controllers/commentController");
const upload = require("../config/multerComment");

// Middleware for file upload
const uploadMiddleware = (req, res, next) => {
	upload.single("media")(req, res, err => {
		if (err) {
			req.flash("error", "Error uploading profile image");
			return res.redirect("/register");
		}
		next();
	});
};

router
	.route("/comments")
	.post(uploadMiddleware, commentController.createComment);

router
	.route("/post", (req, res) => {
		console.log(`${req.method} request for '${req.url}'`);
	})
	.get((req, res) => {
		res.redirect("/comments");
	});

router
	.route("/comments/:id")
	.post(uploadMiddleware, commentController.createComment)
	.delete(commentController.deleteComment);

module.exports = router;
