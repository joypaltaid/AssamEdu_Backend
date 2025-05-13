const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ErrorHandler = require("./errorhandler");

const uploadDir = path.resolve(__dirname, "..", "uploads", "images");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const sanitizedFilename = file.originalname.replace(/\s+/g, "");
    cb(null, `${Date.now()}-${sanitizedFilename}`);
  },
});

const imageFileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (extName && mimeType) {
    return cb(null, true);
  } else {
    return cb(
      new ErrorHandler("Only JPEG, JPG, and PNG files are allowed!", 400)
    );
  }
};
const imageUploader = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFileFilter,
});

module.exports = { imageUploader };
