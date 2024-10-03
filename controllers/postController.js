const db = require("../models");
const path = require("path");

module.exports = {
	createPost: async (req, res) => {
		const { content } = req.body;
		const media = req.file;

		let mediaType = null;
		let mediaPath = null;

		if (media) {
			const fileExt = path.extname(media.originalname).toLowerCase();
			if (fileExt === ".jpg" || (fileExt === ".jpeg") | (fileExt === ".png")) {
				mediaType = "img";
			} else if (fileExt === ".mp4") {
				mediaType = "video";
			}

			mediaPath = "/media/" + media.filename;
		}

		try {
			await db.Post.create({
				content,
				mediaPath,
				mediaType,
				userId: req.user.id
			});

			req.flash("success", "Post created successfully!");
			res.redirect("/posts");
		} catch (error) {
			console.log(error);
			req.flash("error", "Post not created");
			res.redirect("/posts");
		}
	},
	getPost: async (req, res) => {
		try {
			const posts = await db.Post.findAll({
				include: [{ model: db.User, as: "user" }]
			});

			posts.sort((a, b) => [new Date(b.createdAt) - new Date(a.createdAt)]);

			req.flash("success", "Posts retrieved successfully");
			res.render("posts", { posts: posts });
		} catch (error) {
			req.flash("error", "Post not created");
			res.redirect("/posts");
		}
	},
	getPostsWithComments: async (req, res) => {
		const { id } = req.params;
		console.log(id);

		try {
			const post = await db.Post.findOne({
				where: { id },
				include: [
					{
						model: db.Comment,
						as: "comments"
					},
					{
						model: db.User,
						as: "user"
					}
				]
			});
			if (post) {
				console.log(post);

				res.render("post", { post });
			} else {
				req.flash("error", "post not found.");
				console.log("not found");

				res.redirect("/posts");
			}
		} catch (error) {
			req.flash("error", "Failed to retrieve post.");
			console.error(error);

			res.redirect("/posts");
		}
	},

	delete: async (req, res) => {
		const { id } = req.params;

		try {
			await db.Post.destroy({ where: { id } });

			req.flash("success", "Post deleted successfully.");
			res.redirect("/posts");
		} catch (error) {
			req.flash("error", "Failed to delete post.");
			res.redirect("/posts");
		}
	},

	deleteAll: async (req, res) => {
		try {
			await db.Post.destroy({
				where: {
					userId: { userId }
				}
			});
			req.flash("success", "Post deleted successfully.");
			res.redirect("/posts");
		} catch (error) {
			req.flash("error", "Failed to delete Post.");
			res.redirect("/posts");
		}
	}
};
