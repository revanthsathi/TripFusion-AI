const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");

// =======================
// Cloudinary Storage
// =======================
const storage = new CloudinaryStorage({

    cloudinary,

    params: async (req, file) => ({

        folder: "tripfusion/hotels",

        allowed_formats: [
            "jpg",
            "jpeg",
            "png",
            "webp"
        ],

        public_id:
            Date.now() +
            "-" +
            file.originalname
                .split(".")[0]
                .replace(/\s+/g, "-")

    })

});

// =======================
// Multer Upload
// =======================
const upload = multer({

    storage,

    limits: {

        fileSize: 5 * 1024 * 1024 // 5MB

    },

    fileFilter(req, file, cb) {

        const allowedTypes = [

            "image/jpeg",

            "image/png",

            "image/jpg",

            "image/webp"

        ];

        if (allowedTypes.includes(file.mimetype)) {

            cb(null, true);

        } else {

            cb(new Error("Only image files are allowed."));

        }

    }

});

module.exports = upload;