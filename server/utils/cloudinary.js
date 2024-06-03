var cloudinary = require("cloudinary").v2;
var fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloud = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const uploadedImage = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    return uploadedImage;
  } catch (error) {
    // remove locally saved temporary file as the upload operation has failed
    fs.unlinkSync(localFilePath);
    return null;
  }
};
module.exports = {
  uploadOnCloud: uploadOnCloud,
};
