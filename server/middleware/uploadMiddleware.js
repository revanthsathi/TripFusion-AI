const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("Destination middleware reached");
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        console.log("Received File:", file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage
});

module.exports = upload;