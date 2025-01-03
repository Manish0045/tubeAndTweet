const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            if (!fs.existsSync('public/images')) {
                fs.mkdirSync('public/images')
            }
            cb(null, 'public/images');
        } else if (file.mimetype.startsWith('video')) {
            if (!fs.existsSync('public/videos')) {
                fs.mkdirSync('public/videos')
            }
            cb(null, 'public/videos');
        } else {
            cb({ message: 'This file type is not supported' }, false);
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

module.exports = upload;