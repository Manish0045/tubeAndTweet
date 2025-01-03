const router = require('express').Router();
const userRoutes = require('./user.routes');
const videoRoutes = require('./video.routes');
const likeRoutes = require('./like.routes');
const subscriptionRoutes = require('./subscription.routes');
const tweetRoutes = require('./tweet.routes');
const commentRoutes = require('./comment.routes');
const playlistRoutes = require('./playlist.routes');
// const upload = require('../middlewares/fileUpload.middleware');

router
    .use('/v1/user', userRoutes)
    .use('/v1/video', videoRoutes)
    .use('/v1/like', likeRoutes)
    .use('/v1/subscription', subscriptionRoutes)
    .use('/v1/comment', commentRoutes)
    .use('/v1/playlist', playlistRoutes)
    .use('/v1/tweet', tweetRoutes)
// .post('/v1/avatar-upload', upload.single('avatar'), (req, res) => {
//     res.json({ message: 'Image uploaded successfully' });
// })
// .post('/v1/cover-upload', upload.single('coverImage'), (req, res) => {
//     res.json({ message: 'Image uploaded successfully' });
// })
// .post('/v1/video-upload', upload.single('vid'), (req, res) => {
//     res.json({ message: 'Video uploaded successfully' });
// })

module.exports = router;