const fs = require('fs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const bcrypt = require('bcryptjs');

const DATABASE = process.env.DB_NAME || "videoAndTweets";

const generateRefreshAndAccessToken = async (user) => {
    try {
        const ACCESS_TOKEN = await jwt.sign({ _id: user._id, username: user.username }, ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
        const REFRESH_TOKEN = await jwt.sign({ _id: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
        return { ACCESS_TOKEN, REFRESH_TOKEN };
    } catch (error) {
        console.error("Error while generating token", error.message);
    }
};

const generateAccessToken = async (user) => {
    try {
        return jwt.sign({ _id: user._id, username: user.username }, ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    } catch (error) {
        console.error("Error while generating token", error.message);
    }
}

const verifyToken = async (token) => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (err) {
        throw new Error("Invalid or expired access token");
    }
};

const verifyRefreshToken = async (token) => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (err) {
        throw new Error("Invalid or expired refresh token");
    }
};

const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        console.error(error.message);
    }
}

const comparePassword = async (password, hashedPassword) => {
    try {
        const isCorrectPassword = await bcrypt.compare(password, hashedPassword);
        return isCorrectPassword;
    } catch (error) {
        console.error(error.message);
    }
}

// Helper function to store refresh tokens (could use Redis or a DB)
// const storeRefreshTokenInDB = async (userId, refreshToken) => {
//     // Example storing in DB (you can use Redis for faster invalidation)
//     await User.updateOne({ _id: userId }, { refreshToken: refreshToken });
// };

// Refresh Access Token
// const regenerateAccessToken = async (req, res) => {
//     const refreshToken = req.cookies.refreshToken;

//     if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

//     try {
//         const decoded = await exports.verifyRefreshToken(refreshToken);

//         // Check if the refresh token is still valid and stored (e.g., in DB or Redis)
//         const user = await User.findOne({ _id: decoded._id, refreshToken: refreshToken });
//         if (!user) return res.status(403).json({ message: "Invalid or expired refresh token" });

//         // Generate a new access token
//         const accessToken = await exports.generateAccessToken(user);
//         res.json({ accessToken });
//     } catch (err) {
//         console.error('Error regenerating access token:', err);
//         res.status(500).json({ message: "Failed to regenerate access token" });
//     }
// };

// Logout and revoke refresh token
// const logout = async (req, res) => {
//     const refreshToken = req.cookies.refreshToken;

//     if (!refreshToken) return res.status(400).json({ message: "No refresh token provided" });

//     try {
//         const decoded = await exports.verifyRefreshToken(refreshToken);

//         // Invalidate the refresh token (e.g., remove it from DB or Redis)
//         await User.updateOne({ _id: decoded._id }, { $unset: { refreshToken: 1 } });
//         res.clearCookie("refreshToken"); // Clear cookie from client

//         res.status(200).json({ message: "Logged out successfully" });
//     } catch (err) {
//         console.error('Error logging out:', err);
//         res.status(500).json({ message: "Failed to log out" });
//     }
// };


module.exports = {
    DATABASE,
    generateRefreshAndAccessToken,
    generateAccessToken,
    verifyToken,
    verifyRefreshToken,
    hashPassword,
    comparePassword
}