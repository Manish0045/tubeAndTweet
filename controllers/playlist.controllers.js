const { asyncHandler } = require('../middlewares/asyncHandler');
const { Playlist } = require('../models/Playlist.model');


const getPlaylists = asyncHandler(async (req, res) => { });

const getPlaylist = asyncHandler(async (req, res) => { });

const addPlaylist = asyncHandler(async (req, res) => { });

const editPlaylist = asyncHandler(async (req, res) => { });

const deletePlaylist = asyncHandler(async (req, res) => { });


module.exports = {
    getPlaylists,
    getPlaylist,
    addPlaylist,
    editPlaylist,
    deletePlaylist
}