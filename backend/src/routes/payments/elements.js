let express = require('express');
let router = express.Router();
const PaymentElement = require("../../models/payments/paymentElement");
const { checkParam } = require('../../middleware/validate');

//GET all payment elements
router.get('/', async (req, res) => {
    try {
        const elements = await PaymentElement.findAll();
        res.status(200).json(elements);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to fetch all payments' elements." });
    }
})

//GET a specific payment element (search after element id)
router.get('/:id', checkParam('id'), async (req, res) => {
    try {
        const { id } = req.params;
        const element = await PaymentElement.findByPk(id);
        if (!element) {
            res.status(404).json({ error: `Payment element with id ${id} not found!` })
        }
        res.status(200).json(element);
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

//GET all payment elements for a specific payment (search after payment id)
router.get('/payment/:paymentId', async (req, res) => {
    const { paymentId } = req.params;
    try {
        const elements = await PaymentElement.findAll({
            where: { paymentId }
        });
        res.status(200).json(elements);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch all payment elements for provided payment.' });
    }
})

//ADD a new payment element
router.post('/add', async (req, res) => {
    try {
        const { paymentId, knownTaxId, taxId, feeId } = req.body;

        // Validate required fields
        if (!paymentId) {
            return res.status(400).json({ error: 'Payment ID is required.' });
        }

        // Ensure only one of knownTaxId, taxId, or feeId is provided
        const associatedIds = [knownTaxId, taxId, feeId].filter(Boolean);
        if (associatedIds.length !== 1) {
            return res.status(400).json({
                error: 'You must provide exactly one of knownTaxId, taxId, or feeId.'
            });
        }

        const newElement = await PaymentElement.create({
            paymentId,
            knownTaxId: knownTaxId || null,
            taxId: taxId || null,
            feeId: feeId || null
        });

        res.status(201).json({
            success: true,
            message: 'New Payment element created successfully.', newElement
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create the element plata.' });
    }
})

module.exports = router;