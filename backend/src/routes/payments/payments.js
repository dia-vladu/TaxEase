let express = require('express');
let router = express.Router();
const Payment = require("../../models/payments/payment");
const { checkParam } = require('../../middleware/validate');

//GET all payments
// if given -> (filter after benefited person identification number)
router.get('/', async (req, res) => {
    const { userId } = req.query; // Use query parameter for filtering
    try {
        const payments = userId
            ? await Payment.findAll({ where: { benefitedPersonId: userId } })
            : await Payment.findAll();
        res.status(200).json({ success: true, data: payments, message: 'Payments fetched successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to fetch payments.' });
    }
})

router.post('/add', async (req, res) => {
    try {
        const { amount, benefitedPersonId, institutionCUI, cardId, userId } = req.body;

        if (!amount || !institutionCUI || !userId ) {
            return res.status(400).json({ error: 'Missing required fields in request body.' });
        }

        const payment = await Payment.create({
            paymentDate: new Date(),
            amount,
            benefitedPersonId: benefitedPersonId || null,
            institutionCUI,
            cardId: cardId || null,
            userId,
        });

        res.status(201).json({ success: true, message: 'Payment created successfully.', payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to insert payment into database.' });
    }
})

//GET a specific payment (search after payment id)
router.get('/:id', checkParam('id'), async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findByPk(id);
        if (!payment) {
            res.status(404).json({ error: `Payment with id ${id} not found!` })
        }
        res.status(200).json(payment);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch payment.' })
    }
})

module.exports = router;