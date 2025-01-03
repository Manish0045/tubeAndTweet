const { asyncHandler } = require('../middlewares/asyncHandler');
const { Like } = require('../models/like.model');


const getLikes = asyncHandler(async (req, res) => { });

const getLike = asyncHandler(async (req, res) => { });

const addLike = asyncHandler(async (req, res) => { });

const editLike = asyncHandler(async (req, res) => { });

const deleteLike = asyncHandler(async (req, res) => { });


module.exports = {
    getLikes,
    getLike,
    addLike,
    editLike,
    deleteLike
}