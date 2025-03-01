const pdfParser = require('pdf-parse');

const extractTextFromPDF = async (req, res) => {
    try {
        if (!req.file || !req.file.path) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const result = await pdfParser(req.file.path);
        res.send(result.text);
    } catch (error) {
        console.error('Error parsing PDF:', error);
        res.status(500).json({ error: 'Failed to parse PDF' });
    }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const uploadFile = async (req, res) => {
    try {
        await delay(1000); // Simulate a delay of 1 seconds
        console.log('File uploaded successfully');
        res.status(200).json({ result: true, msg: 'File uploaded' });
    } catch (error) {
        res.status(500).json({ error: 'File upload failed' });
    }
};

const deleteFile = (req, res) => {
    const { fileName } = req.query;
    console.log(`File deleted: ${fileName}`);
    res.status(200).json({ result: true, msg: 'File deleted' });
};

module.exports = { extractTextFromPDF, uploadFile, deleteFile };