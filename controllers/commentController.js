const db = require("../models");
const path = require("path");

module.exports = {
	createComment: async (req, res) => {
		const { comment } = req.body; // Ensure this matches the model
		const media = req.file;
		const postId = req.params.id;
		console.log("kamehameha", postId);

		// Validate comment content
		if (!comment) {
			req.flash("error", "Comment cannot be empty.");
			return res.redirect(`/posts/${postId}`);
		}

		let mediaType = null;
		let mediaPath = null;

		if (media) {
			const fileExt = path.extname(media.originalname).toLowerCase();
			if (
				fileExt === ".jpg" ||
				fileExt === ".jpeg" ||
				fileExt === ".png" ||
				fileExt === ".jfif"
			) {
				mediaType = "img";
			} else if (fileExt === ".mp4") {
				mediaType = "video";
			}

			mediaPath = "/comment/" + media.filename;
		}
		console.log("Atiii");
		try {
			await db.Comment.create({
				comment, // Use 'comment' from req.body
				mediaPath,
				mediaType,
				userId: req.user.id,
				postId: postId
			});

			console.log("inakataaaa");
			req.flash("success", "Comment created successfully!");
			res.redirect(`/posts/${postId}`);
		} catch (error) {
			console.error(error, "saa zingine"); // Log the error
			req.flash("error", "Comment not created.");
			res.redirect("/home");
		}
	},
	getComments: async (req, res) => {
		try {
			const comments = await db.Comment.findAll({
				include: [{ model: db.User, as: "user" }]
			});

			comments.sort((a, b) => [new Date(b.createdAt) - new Date(a.createdAt)]);

			req.flash("success", "comments retrieved successfully");
			res.render("Comment", { comments: comments });
		} catch (error) {
			req.flash("error", "Comment not created");
			res.redirect("/comments");
		}
	},
	deleteComment: async (req, res) => {
		const { id } = req.params; // Correct destructuring

		try {
			const result = await db.Comment.destroy({ where: { id } });

			if (result === 0) {
				req.flash("error", "Comment not found.");
			} else {
				req.flash("success", "Comment deleted successfully.");
			}

			res.redirect("/comments");
		} catch (error) {
			console.error(error); // Log the error
			req.flash("error", "Comment not deleted.");
			res.redirect("/comments");
		}
	}
};
