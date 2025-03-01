let express = require('express');
const asyncHandler = require("express-async-handler");
let router = express.Router();
const Fee = require("../../models/taxes/fee");
const { checkParam } = require('../../middleware/validate');


//GET all fees. 
router.get('/', asyncHandler(async (req, res) => {
    const fees = await Fee.findAll();
    if (fees.length === 0) {
        return res.status(200).json({ message: 'No fees found' });
    }
    res.status(200).json(fees);
}));

// ADD new fee
router.post('/add', asyncHandler(async (req, res) => {
    const { cui, data } = req.body;

    if (!cui || !data || !data.name || !data.treasuryAccount || !data.iban || !data.amount) {
        return res.status(400).json({ error: 'Missing required fields in request body.' });
    }

    const fee = await Fee.create({
        name: data.name,
        treasuryAccount: data.treasuryAccount,
        iban: data.iban,
        amount: data.amount,
        institutionCUI: cui
    });

    if (!fee) {
        const error = new Error({ success: false, message: 'Failed to insert fee into database!' });
        error.status = 500;
        throw error;
    }
    res.status(201).json({ success: true, message: 'Fee created successfully.', fee });
}));

//GET a specific fee (search after fee id) 
router.get('/:id', checkParam('id'), asyncHandler(async (req, res) => {
    const { id } = req.params;
    const fee = await Fee.findByPk(id);
    if (!fee) {
        return res.status(404).json({ error: `Fee with id ${id} not found!` })
    }
    res.status(200).json(fee);
}));

module.exports = router;