const router = require('express').Router();
const upload = require('../middlewares/fileUpload.middleware');
const { registerUser, loginUser, signOutUser } = require('../controllers/user.controllers');
const { verifyJWT } = require('../middlewares/auth.middleware');

router
    .get('/', (req, res) => { })
    .post('/signup', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), registerUser)
    .post('/login', loginUser)
    .post('/sign-out', verifyJWT, signOutUser)
    .put('/:id', (req, res) => { })
    .delete('/:id', (req, res) => { })

module.exports = router;