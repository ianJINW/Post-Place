const express = require("express");

const router = express.Router();
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const upload = require("../config/multerPost");
const uploadComment = require("../config/multerComment");

// Middleware for file upload
const uploadMiddleware = (req, res, next) => {
	upload.single("media")(req, res, err => {
		if (err) {
			req.flash("error", "Error uploading profile image");
			return res.redirect("/posts");
		}
		next();
	});
};
// Middleware for file upload
const uploadCommentMiddleware = (req, res, next) => {
	uploadComment.single("media")(req, res, err => {
		if (err) {
			req.flash("error", "Error uploading profile image");
			return res.redirect("/posts");
		}
		next();
	});
};

router
	.route("/posts")
	.get(postController.getPost)
	.post(uploadMiddleware, postController.createPost);

router.route("/create").get((req, res) => {
	res.render("create");
});

router
	.route("/post", (req, res) => {
		console.log(`${req.method} request for '${req.url}'`);
	})
	.get((req, res) => {
		res.redirect("/posts");
	});

router
	.route("/posts/:id")
	.get(postController.getPostsWithComments)
	.post(uploadCommentMiddleware, commentController.createComment)
	.delete(postController.delete);

router.route("/posts/:id");

module.exports = router;
