const multer = require('multer');

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'C:\\Users\\Diana\\opt\\oracle\\oradata\\cereri-inrolare');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

// File filter for validation (e.g., only accept PDFs)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Only PDFs are allowed!'), false); // Reject file
    }
};

// Create multer instance
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Limit: 5MB
    },
    fileFilter: fileFilter
});

module.exports = upload;