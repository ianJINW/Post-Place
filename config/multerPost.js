const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const dir = path.join(__dirname, "/../public/media");

		cb(null, dir);
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	}
});

const upload = multer({
	storage: storage,
	limit: { filesize: 10 * 1024 * 1024 }
});

module.exports = upload;
