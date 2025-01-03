const { asyncHandler } = require("../middlewares/asyncHandler");
const { User } = require("../models/user.model");
const { CustomError } = require("../utils/ErrorHandler");
const { ApiResponse } = require("../utils/ApiResponse");
const { uploadImageToCloudinary } = require("../utils/cloudinary");
const { hashPassword, comparePassword, generateRefreshAndAccessToken, generateAccessToken } = require("../utils/constants");
const fs = require('fs');

const registerUser = async (req, res, next) => {
    const { username, email, fullName, password } = req.body;
    try {

        if ([username, email, password, fullName].some(field => field?.trim() === "")) {
            throw new CustomError(400, "All fields are required!");
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            throw new CustomError(409, "User already exists!");
        }

        const hashedPassword = await hashPassword(password);

        const avatarLocalFilePath = req.files?.avatar[0].path;
        const coverImageLocalFilePath = req.files?.coverImage ? req.files.coverImage[0].path : '';

        if (!avatarLocalFilePath) {
            throw new CustomError(400, "Failed to Upload avatar file!");
        }

        const cloudinaryAvatar = await uploadImageToCloudinary(avatarLocalFilePath);
        const cloudinaryCoverImage = (coverImageLocalFilePath !== "")
            ? await uploadImageToCloudinary(coverImageLocalFilePath)
            : "";


        if (!cloudinaryAvatar) {
            throw new CustomError(409, null, "Failed to Upload on cloudinary!");
        }

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            fullName,
            avatar: cloudinaryAvatar?.url,
            coverImage: cloudinaryCoverImage?.url || ""
        });

        return res.status(201).json(new ApiResponse(201, { _id: newUser._id, username: newUser.username }, "User created successfully!"));
    } catch (error) {
        const avatarLocalFilePath = req.files?.avatar[0].path;
        const coverImageLocalFilePath = req.files?.coverImage ? req.files.coverImage[0].path : '';
        fs.unlinkSync(avatarLocalFilePath);
        fs.unlinkSync(coverImageLocalFilePath);
        next(new CustomError(error.statusCode, error.message));
    }
};

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!(username || email)) throw new CustomError(400, "Username or Email is required!");

    if (!password) throw new CustomError(400, "Password is Required!");

    const user = await User.findOne({ $or: [{ username }, { email }] }).select("+password");

    if (!user) throw new CustomError(404, "No User found with that email or username!");

    const isCorrectPassword = await comparePassword(password, user.password);

    if (!isCorrectPassword) throw new CustomError(409, "Invalid Credentials!");

    const { ACCESS_TOKEN, REFRESH_TOKEN } = await generateRefreshAndAccessToken(user);

    user.refreshToken = REFRESH_TOKEN;
    await user.save();

    return res.status(200).json(new ApiResponse(200, { _id: user._id, username: user.username, email: user.email, token: ACCESS_TOKEN }))
});

const signOutUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const user = await User.findById(userId);
    user.refreshToken = '';
    await user.save();
    return res.status(200).json(new ApiResponse(200, {}, "User signed out"))
});

const getNewAccessToken = asyncHandler(async (req, res) => {
    const refreshTokn = req.body;

    if (!refreshTokn) throw new CustomError(400, "Refresh Token is required!");

    const user = await user.findOne({ $where: { refreshToken: refreshTokn } });

    if (!user) throw new CustomError(404, "User not found!");

    const { ACCESS_TOKEN } = await generateAccessToken(user);

    return res.status(200).json(new ApiResponse(200, { _id: user._id, username: user.username, token: ACCESS_TOKEN }, "New Access Token generated successfully!"));
});

const getRefreshToken = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const user = await User.findById(userId);

    if (!user) throw new CustomError(404, "User not found!");

    const refreshToken = user.refreshToken;

    if (!refreshToken) throw new CustomError(401, "Unauthorized!");

    return res.status(200).json(new ApiResponse(200, { refreshToken }, "Refresh Token Fetched successfully!"));

});

const getCurrentUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const user = await User.findById(userId);

    if (!user) throw new CustomError(404, "User not found!");

    return res.status(200).json(new ApiResponse(200, { user }, "User Fetched successfully!"));
});

const updateUser = asyncHandler(async (req, res) => { });

const deleteAccount = asyncHandler(async (req, res) => { });

const getChannelProfile = asyncHandler(async (req, res) => {

    // const userId = req.user?._id;
    const username = req.params.username;

    if (!username?.trim()) throw new CustomError(400, "Username is missing");



    const channelDetails = await User.aggregate([
        {
            $match: {
                username
            },
        }, {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "posts"
            }
        }, {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        }
    ])



});

const getWatchHistory = asyncHandler(async (req, res) => { });

module.exports = {
    registerUser,
    loginUser,
    signOutUser,
    updateUser,
    deleteAccount,
    getChannelProfile,
    getWatchHistory,
    getRefreshToken,
    getCurrentUser,
    getNewAccessToken
}