const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// =======================
// Upload Single Image
// =======================
const uploadSingleImage = async (
    filePath,
    folder
) => {

    const result = await cloudinary.uploader.upload(
        filePath,
        {
            folder
        }
    );

    fs.unlinkSync(filePath);

    return result.secure_url;

};

// =======================
// Upload Multiple Images
// =======================
const uploadMultipleImages = async (
    files,
    folder
) => {

    const imageUrls = [];

    for (const file of files) {

        const result =
            await cloudinary.uploader.upload(
                file.path,
                {
                    folder
                }
            );

        imageUrls.push(result.secure_url);

        fs.unlinkSync(file.path);

    }

    return imageUrls;

};

module.exports = {
    uploadSingleImage,
    uploadMultipleImages
};