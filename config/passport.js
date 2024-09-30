const LocalStrategy = require("passport-local").Strategy;
const db = require("../models");
const bcrypt = require("bcryptjs");

module.exports = passport => {
	passport.use(
		new LocalStrategy(async (username, password, done) => {
			try {
				console.log(`Trying to find user: ${username}`);
				const user = await db.User.findOne({ where: { username } });

				if (!user) {
					console.log("No such user");
					return done(null, false, {
						message: "No user with that username found"
					});
				}

				const match = await bcrypt.compare(password, user.password); // Ensure you await here
				if (!match) {
					console.log("Incorrect password");
					return done(null, false, { message: "Incorrect password" });
				}

				return done(null, user);
			} catch (error) {
				console.error("Database error:", error);
				return done(error);
			}
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser(async (id, done) => {
		try {
			const user = await db.User.findByPk(id);
			done(null, user);
		} catch (error) {
			console.error("Error during deserialization:", error);
			done(error);
		}
	});
};
