require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const helmet = require("helmet");
const passport = require("passport");
const methodOverride = require("method-override");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const authroutes = require("./routes/auth");
const postroutes = require("./routes/post");
const commentroutes = require("./routes/comment");
const { sequelize } = require("./models");
const app = express();

if (!process.env.SESSION_SECRET || !process.env.PORT) {
	console.error("Error: SESSION_SECRET or PORT not defined in .env file");
	process.exit(1);
}

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		store: new SequelizeStore({
			db: sequelize
		}),
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: process.env.NODE_ENV === "production",
			httpOnly: true,
			checkExpirationInterval: 15 * 60 * 1000,
			sameSite: "strict",
			maxAge: 30 * 60 * 1000
		}
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

app.use(helmet());

app.set("view engine", "ejs");
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));

app.use(flash());

app.use((req, res, next) => {
	// Log flash messages before setting to res.locals
	console.log("Flash before setting to res.locals:", req.flash());
	res.locals.user = req.user;
	res.locals.isLoggedIn = req.isAuthenticated();
	res.locals.messages = req.flash();
	console.log("Messages in res.locals:", res.locals.messages);

	next();
});

app.use("/", authroutes);
app.use("/", postroutes);
app.use("/", commentroutes);

app.use((req, res) => {
	res.status(404).render("404", { requestedUrl: req.originalUrl });
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(err.status || 500).send({ message: err.message });
});

let PORT = process.env.PORT;
// Synchronize database and start server

sequelize.sync().then(() => {
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
});

process.on("SIGINT", async () => {
	console.log("Server is shutting down...");
	await sequelize.close();
	process.exit();
});
