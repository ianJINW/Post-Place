const db = require("../models");
const passport = require("passport");

module.exports = {
	createUser: async (req, res) => {
		console.log("Current flash messages:", res.locals.messages);

		const { email, username, password } = req.body;

		if (!email || !username || !password) {
			req.flash("error", "All fields are required.");

			return res.redirect("/register");
		}

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
				profileImage
			});

			req.flash("success", "User registered successfully");

			res.redirect("/home");
		} catch (error) {
			req.flash("error", "Error registering user");

			res.redirect("/register");
		}
	},
	getUsers: async (req, res) => {
		console.log("Current flash messages:", res.locals.messages);

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
		console.log("Current flash messages:", res.locals.messages);

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
		console.log("Current flash messages:", res.locals.messages);

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
	deleteUser: async (req, res) => {
		console.log("Current flash messages:", res.locals.messages);

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
