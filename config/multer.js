const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const dir = path.join(__dirname, "../public/profileImages");
		console.log(dir);

		cb(null, dir);
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	}
});

const fileFilter = (req, file, cb) => {
	const allowed = /jpeg|jpg|png|gif/;
	const validCheck =
		allowed.test(path.extname(file.originalname).toLowerCase()) &&
		allowed.test(file.mimetype);

	if (validCheck) {
		cb(null, true);
	} else {
		cb(
			new Error("Invalid file type. Only JPEG,PNG, JPG and GIF are allowed."),
			false
		);
	}
};

const upload = multer({
	storage: storage,
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter: fileFilter
});

module.exports = upload;
