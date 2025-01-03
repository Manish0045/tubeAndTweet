const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');

const cloudinaryOptions = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
};

cloudinary.config(cloudinaryOptions);

// Upload image to Cloudinary and handle local file deletion
const uploadImageToCloudinary = async (localFilePath) => {
    try {
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "image" });

        // If the file upload to Cloudinary is successful, delete the local file
        fs.unlinkSync(localFilePath);

        // Return the Cloudinary response object
        return response;
    } catch (error) {
        // If there's an error during the Cloudinary upload, log it and delete the local file
        console.error("Error uploading to Cloudinary:", error);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); // Ensure the file is deleted even if upload fails
        }
        return null; // Return null if upload fails
    }
};

// Upload video to Cloudinary and handle local file deletion
const uploadVideoToCloudinary = async (localFilePath) => {
    try {
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "video" });

        // If the file upload to Cloudinary is successful, delete the local file
        fs.unlinkSync(localFilePath);

        // Return the Cloudinary response object
        return response;
    } catch (error) {
        // If there's an error during the Cloudinary upload, log it and delete the local file
        console.error("Error uploading to Cloudinary:", error);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); // Ensure the file is deleted even if upload fails
        }
        return null; // Return null if upload fails
    }
};

module.exports = {
    uploadImageToCloudinary,
    uploadVideoToCloudinary
};
