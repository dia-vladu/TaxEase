const express = require('express');
const router = express.Router();
const upload = require('../middleware/fileUpload');
const fileController = require('../controller/uploadFile');

router.post('/extractPDFText',
    (req, res, next) => {
        upload.single('newFile')(req, res, function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to upload file' });
            }
            next();
        });
    },
    fileController.extractTextFromPDF
);

router.route('/uploadFile')
    .post(fileController.uploadFile)
    .delete(fileController.deleteFile);

module.exports = router;