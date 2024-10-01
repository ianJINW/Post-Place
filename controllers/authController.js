const db = require("../models");
const passport = require("passport");

module.exports = {
	createUser: async (req, res) => {
		const { email, username, password } = req.body;

		if (!email || !username || !password) {
			req.flash("error", "All fields are required.");

			return res.redirect("/register");
		}

		/* 	if (!req.file) {
			req.flash("Error uploading file: " + req.fileValidationError);
			return res.redirect("/register");
		} */

		try {
			let profileImage = req.file
				? `/profileImages/${req.file.filename}`
				: "/profileImages/default.jpeg";

			const existingUser = await db.User.findOne({ where: { email } });
			const existingUsername = await db.User.findOne({ where: { username } });

			if (existingUser) {
				req.flash("error", "Email is already registered.");

				return res.redirect("/register");
			}

			if (existingUsername) {
				req.flash("error", "Username is already registered.");

				return res.redirect("/register");
			}

			const user = await db.User.create({
				email,
				username,
				password,
				profileImage,
				role: "user"
			});

			console.log("logged");

			req.flash("success", "User registered successfully");

			res.redirect("/login");
		} catch (error) {
			console.log("logged", error);

			req.flash("error", "Error registering user");

			res.redirect("/register");
		}
	},
	getUsers: async (req, res) => {
		try {
			const users = await db.User.findAll();

			req.flash("success", "Users retrieved successfully");

			res.render("users", { users });
		} catch (error) {
			req.flash("error", "Failed to retrieve users.");

			res.redirect("/users");
		}
	},
	getUserById: async (req, res) => {
		const { id } = req.params;

		try {
			const user = await db.User.findOne({ where: { id } });

			if (user) {
				res.render("user", { user });
			} else {
				req.flash("error", "User not found.");

				res.redirect("/users");
			}
		} catch (error) {
			req.flash("error", "Failed to retrieve user.");

			res.redirect("/users");
		}
	},
	login: async (req, res, next) => {
		passport.authenticate("local", {
			successRedirect: "/home",
			failureRedirect: "/login",
			failureFlash: true,
			successFlash: "Welcome back!"
		})(req, res, next);
	},
	logout: async (req, res) => {
		try {
			req.logout(err => {
				if (err) {
					req.flash("error", "Logged out unsuccessful. Please try again.");

					return res.redirect("/home");
				}

				req.flash("success", "Logged out successfully!");

				res.redirect("/login");
			});
		} catch (error) {
			req.flash(
				"error",
				"An unexpected error occurred. Please try again later."
			);
			res.redirect("/home");
		}
	},
	updateUser: async (req, res) => {
		const id = req.params;
		const { email, username, password } = req.body;
		let profileImagePath;

		if (req.file) {
			profileImagePath = `/media/profile-photos/${req.file.filename}`;
		}

		const updates = {};

		if (email) updates.email = email;
		if (username) updates.username = username;
		if (password) updates.password = password;
		if (profileImagePath) updates.profileImage = profileImagePath;
		console.log(updates, "updates");

		try {
			const user = await db.User.update({ updates }, { where: { id } });
			console.log(user, "user");

			req.flash("success", "User updated successfully.");

			res.redirect(`/users/${id}`);
		} catch (error) {
			console.error(error);

			req.flash(
				"error",
				"An unexpected error occurred. Please try again later."
			);
			res.redirect("/account");
		}
	},
	deleteUser: async (req, res) => {
		const { id } = req.params;
		try {
			await db.User.destroy({ where: { id } });
			req.flash("success", "User deleted successfully.");

			res.redirect("/users");
		} catch (error) {
			req.flash("error", "Failed to delete user.");

			res.redirect("/users");
		}
	}
};
