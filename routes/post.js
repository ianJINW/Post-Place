const express = require("express");

const router = express.Router();
const postController = require("../controllers/postController");
const upload = require("../config/multerPost");

// Middleware for file upload
const uploadMiddleware = (req, res, next) => {
	upload.single("media")(req, res, err => {
		if (err) {
			return res.status(400).send("Error uploading file: " + err.message);
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
	.get(postController.getPostsById)
	.delete(postController.delete);

module.exports = router;
