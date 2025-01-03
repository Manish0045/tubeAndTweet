const { asyncHandler } = require('../middlewares/asyncHandler');
const { Tweet } = require('../models/Tweet.model');


const getTweets = asyncHandler(async (req, res) => { });

const getTweet = asyncHandler(async (req, res) => { });

const addTweet = asyncHandler(async (req, res) => { });

const editTweet = asyncHandler(async (req, res) => { });

const deleteTweet = asyncHandler(async (req, res) => { });


module.exports = {
    getTweets,
    getTweet,
    addTweet,
    editTweet,
    deleteTweet
}