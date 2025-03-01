let express = require('express');
let router = express.Router();
const PaymentSchedule = require("../../models/payments/paymentSchedule");
const { checkParam } = require('../../middleware/validate');

//GET all payments' schedules
router.get('/', async (req, res) => {
    try {
        const schedules = await PaymentSchedule.findAll();
        res.status(200).json(schedules);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch all payment schedules.' });
    }
})

//GET a specific payment schedule (search after payment id)
router.get('/:id', checkParam('id'), async (req, res) => {
    try {
        const { id } = req.params;
        const schedule = await PaymentSchedule.findByPk(id);
        if (!schedule) {
            res.status(404).json({ error: `Payment schedule with id ${id} not found!` })
        }
        res.status(200).json(schedule);
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

//GET all payments' schedules (search after user account id)
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const schedules = await PaymentSchedule.findAll({
            where: { userAccountId: userId }
        });
        res.status(200).json(schedules);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch all payment schedules for provided user.' });
    }
})

//ADD a new payment schedule
router.post('/add', async (req, res) => {
    try {
        const { month, day, cardId, userId, cui } = req.body;

        if (!month || !day || !cardId || !userId || !cui ) {
            return res.status(400).json({ error: 'Missing required fields in request body.' });
        }

        // Validate month and day using custom rules
        if (month < 1 || month > 12) {
            return res.status(400).json({ error: "Invalid month. It must be between 1 and 12." });
        }
        const currentYear = new Date().getFullYear(); // Get cuurent yer -> leap year consideration
        const daysInMonth = new Date(currentYear, month, 0).getDate();
        if (day < 1 || day > daysInMonth) {
            return res.status(400).json({ error: `Invalid day ${day} for month ${month}.` });
        }

        const schedule = await PaymentSchedule.create({
            month,
            day,
            cardId,
            userAccountId: userId,
            institutionCUI: cui,
        });

        res.status(201).json({ success: true, message: 'Payment schedule created successfully.', schedule });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to insert new schedule into database.' });
    }
})

module.exports = router;