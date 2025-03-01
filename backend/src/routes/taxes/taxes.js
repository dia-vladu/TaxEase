let express = require('express');
const asyncHandler = require("express-async-handler");
let router = express.Router();
const Tax = require("../../models/taxes/tax");
const { checkParam } = require('../../middleware/validate');


//GET all taxes.
router.get('/', asyncHandler(async (req, res) => {
    const taxes = await Tax.findAll();
    if (taxes.length === 0) {
        return res.status(404).json({ message: 'No taxes found.' });
    }
    res.status(200).json(taxes);
}));

//ADD a new tax.
router.post('/add', asyncHandler(async (req, res) => {
    const { cui, data } = req.body;

    if (!cui || !data || !data.name || !data.treasuryAccount || !data.iban) {
        return res.status(400).json({ error: 'Missing required fields in request body.' });
    }

    const tax = await Tax.create({
        name: data.name,
        treasuryAccount: data.treasuryAccount,
        iban: data.iban,
        institutionCUI: cui
    });

    if (!tax) {
        const error = new Error("Failed to insert tax into database!");
        error.status = 500;
        throw error;
    }

    res.status(201).json({ success: true, message: 'Tax created successfully.', tax });
}));

//GET a specific tax (search after tax id)
router.get('/:id', checkParam('id'), asyncHandler(async (req, res) => {
    const { id } = req.params;
    const tax = await Tax.findByPk(id);
    if (!tax) {
        return res.status(404).json({ error: `Tax with id ${id} not found!` })
    }
    res.status(200).json(tax);
}));

module.exports = router;