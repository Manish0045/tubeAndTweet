const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');
const { CustomError } = require('../utils/ErrorHandler');
const { verifyToken } = require('../utils/constants');

const verifyJWT = async (req, _, next) => {
    try {
        const token = req.body.token || req.headers.authorization?.split(' ')[1];

        if (!token) throw new CustomError(400, "No token provided");

        const decodedTokenData = await verifyToken(token);

        // console.log(decodedTokenData);

        const user = await User.findById(decodedTokenData._id);

        if (decodedTokenData && !user.refreshToken || user.refreshToken === "") {
            throw new CustomError(409, "Invalid token provided or token expired!");
        }

        req.user = { _id: decodedTokenData._id, username: user.username };
        next();
    } catch (error) {
        console.error("Error: Error while validating token", error.message);
        next(error);
    }
}

module.exports = {
    verifyJWT
}