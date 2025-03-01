const express = require('express');
const router = express.Router();
const PaymentCard = require("../../models/payments/paymentCard");
const { checkParam } = require('../../middleware/validate');

//GET all payment cards.
router.get('/', async (req, res) => {
    try {
        const cards = await PaymentCard.findAll();
        res.status(200).json(cards);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to retrieve payment cards!' });
    }
})

//ADD a new payment card (assigned to a specific user)
router.post('/add', async (req, res) => {
    try {
        const { cardNumber, expiryDate, userId } = req.body;

        // Validate input
        if (!cardNumber || !expiryDate || !userId) {
            return res.status(400).json({ error: 'All fields are required: cardNumber, expiryDate, userId.' });
        }
        if (cardNumber.length !== 16 || isNaN(cardNumber)) {
            return res.status(400).json({ error: 'Invalid card number. It must be 16 digits long.' });
        }

        const card = await PaymentCard.create({
            cardNumber,
            expiryDate,
            userId
        });

        res.status(201).json(card);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'A card with this number already exists.' });
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to add the new card.' });
    }
});

//GET payment cards of a certain user (search after userId)
//TO DO: If a user has multiple cards assigned? -> await PaymentCard.findAll(...)
router.get('/:userId', checkParam('userId'), async (req, res) => {
    try {
        const { userId } = req.params;
        const card = await PaymentCard.findOne({
            where: { userId }
        });
        if (card) {
            res.status(200).json(card);
        } else {
            res.status(404).json({ error: `Card with user id ${userId} not found!` })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

module.exports = router;