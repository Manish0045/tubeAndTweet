const { asyncHandler } = require("../middlewares/asyncHandler");
const { CustomError } = require('../utils/ErrorHandler');
const { Video } = require('../models/video.model');
const { default: mongoose } = require("mongoose");
const { uploadImageToCloudinary, uploadVideoToCloudinary } = require("../utils/cloudinary");
const fs = require('fs');

const getVideosList = asyncHandler(async (req, res) => {
    const videosList = await Video.find().populate({
        path: 'owner',
        select: 'username'
    });
    if (!videosList) {
        throw new CustomError(404, 'No videos found');
    }
    return res.status(200).json({ videosList });
});

const getVideosByUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    console.log(userId);
    const videosList = await Video.find({ owner: new mongoose.Types.ObjectId(userId) })
        .populate({
            path: 'owner',
            select: "username"
        });
    console.log(videosList);
    return res.status(200).json({ videosList });
});

const addVideo = async (req, res) => {
    const { title, description } = req.body;

    try {
        const videoFilePath = req.files?.videoFile[0].path;

        if (!videoFilePath) {
            throw new CustomError(400, 'Video file is required');
        }

        const thumbnailPath = req.files?.thumbnail[0].path;

        if (!thumbnailPath) {
            throw new CustomError(400, 'Thumbnail is required');
        }

        const thumbnailUploadDetails = await uploadImageToCloudinary(thumbnailPath);
        if (!thumbnailUploadDetails) {
            throw new CustomError(500, 'Error uploading thumbnail');
        }

        const videoUploadDetails = await uploadVideoToCloudinary(videoFilePath);
        if (!videoUploadDetails) {
            throw new CustomError(500, 'Error uploading video');
        }

        const newVideo = new Video({
            title,
            description,
            thumbnail: thumbnailUploadDetails.url,
            videoFile: videoUploadDetails.url,
            duration: videoUploadDetails.duration,
            owner: req.user._id
        });

        const savedVideo = await newVideo.save();

        if (!savedVideo) {
            throw new CustomError(500, 'Error saving video');
        }

        return res.status(201).json({ video: savedVideo });
    } catch (error) {
        const videoFilePath = req.files?.videoFile[0].path;
        const thumbnailPath = req.files?.thumbnail[0].path;

        if (videoFilePath && fs.existsSync(videoFilePath)) {
            fs.unlinkSync(videoFilePath);
        }

        if (thumbnailPath && fs.existsSync(thumbnailPath)) {
            fs.unlinkSync(thumbnailPath);
        }

        console.error({ Error: 500, message: 'Error saving video' }, error.message);

    }
};

const deleteVideo = asyncHandler(async (req, res) => { });


module.exports = {
    getVideosList,
    getVideosByUser,
    addVideo,
    deleteVideo
}