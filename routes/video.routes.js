const { getVideosList, addVideo } = require('../controllers/video.controllers');
const { verifyJWT } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/fileUpload.middleware');
const router = require('express').Router();

router
    .get('/', verifyJWT, getVideosList)
    .post('/', verifyJWT, upload.fields([{ name: "videoFile", maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), addVideo)
    .put('/:id', (req, res) => { })
    .delete('/:id', (req, res) => { })

module.exports = router;