let express = require('express');
const asyncHandler = require("express-async-handler");
let router = express.Router();
const EnrollmentRequest = require("../../models/institutions/enrollmentRequest");
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { checkParam } = require('../../middleware/validate');


//GET all enrollment requests
router.get('/', asyncHandler(async (req, res) => {
    const requests = await EnrollmentRequest.findAll();
    if (requests.length === 0) {
        return res.status(200).json({ message: "No enrollment requests found!" });
    }
    res.status(200).json(requests);
}));

const uploadPath = process.env.FILE_UPLOAD_PATH || path.join(__dirname, '../../enrollmentDocs');

// Check if the directory exists
if (!fs.existsSync(uploadPath)) {
    // Create the directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: uploadPath,
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

//ADD new enrollment request
router.post('/add',
    (req, res, next) => {
        upload.single('newFile')(req, res, function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to upload newFile.' });
            }
            next();
        });
    },
    asyncHandler(async (req, res) => {
        const data = req.body;
        const file = req.file;
        const fileData = fs.readFileSync(file.path);

        const request = await EnrollmentRequest.create({
            institutionCUI: data['CUI:'],
            uploadDate: new Date(),
            pdfDocument: fileData
        });

        if (!request) {
            const error = new Error("Failed to create a new enrollment request.");
            error.status = 500;
            throw error;
        }
        res.status(201).json(request);
    })
);

//GET the id of a request (search after institution CUI)
router.get('/cui/:cui', asyncHandler(async (req, res) => {
    const { cui } = req.params;

    const request = await EnrollmentRequest.findOne({
        attributes: ['id'],
        where: {
            institutionCUI: cui
        }
    });

    if (!request) {
        return res.status(404).json({ error: 'Enrollment request not found.' });
    }
    res.status(200).json(request.id);
}));

//GET enrollment request (search after request id)
router.get('/:id', checkParam('id'), asyncHandler(async (req, res) => {
    const { id } = req.params;
    const request = await EnrollmentRequest.findByPk(id);
    if (!request) {
        return res.status(404).json({ error: `Enrollment request with id ${id} not found!` })
    }
    res.status(200).json(request);
}));

module.exports = router;