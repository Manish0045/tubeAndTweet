const { Subscription } = require('../models/subscription.model');
const { asyncHandler } = require('../middlewares/asyncHandler');


const getSubscriptions = asyncHandler(async (req, res) => { });
const getSubscription = asyncHandler(async (req, res) => { });
const addSubcription = asyncHandler(async (req, res) => { });
const editSubscription = asyncHandler(async (req, res) => { });
const deleteSubscription = asyncHandler(async (req, res) => { });


module.exports = {
    getSubscriptions,
    getSubscription,
    addSubcription,
    editSubscription,
    deleteSubscription
}