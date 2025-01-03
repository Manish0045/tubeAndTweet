const { asyncHandler } = require('../middlewares/asyncHandler');
const { Comment } = require('../models/comment.model');
const { CustomError } = require('../utils/ErrorHandler');
const { ApiResponse } = require('../utils/ApiResponse');

const addComment = asyncHandler(async (req, res) => { });

const getComment = asyncHandler(async (req, res) => { });

const getCommentByUser = asyncHandler(async (req, res) => { });

const editComment = asyncHandler(async (req, res) => { });

const deleteComment = asyncHandler(async (req, res) => { });

module.exports = {
    getComment,
    getCommentByUser,
    addComment,
    editComment,
    deleteComment
}