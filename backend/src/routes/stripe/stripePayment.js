const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const express = require('express');
const router = express.Router();
const helper = require('../../services/stripe/stripePayment.js');

router.post("/payment-success", async (req, res) => {
    try {
        const { session_id } = req.body;
        const session = await helper.getStripeSession(stripe, session_id);
        console.log("session:", session);

        const { metadata } = session;
        console.log("metadata:", metadata)
        const { userId } = req.session.user;

        // Check payment status
        if (session.payment_status !== "paid") {
            return res.status(400).json({ error: "Payment not completed." });
        }
        if (!metadata) {
            return res.status(400).json({ error: "Missing metadata from Stripe session." });
        }

        metadata.amount = session.amount_total / 100;
        
        const bodyPlata = helper.buildBodyPlata(metadata, userId);
        console.log("bodyPlata:", bodyPlata);
        const paymentResponse = await helper.sendPostRequest(helper.API_URLS.ADD_PLATA, bodyPlata);
        const payment = paymentResponse.payment;
        console.log("Payment Response:", paymentResponse);

        if (!paymentResponse || !payment) {
            return res.status(500).json({ error: "Failed to create payment." });
        }

        const itemsList = JSON.parse(metadata.items)
        console.log("itemsList:", itemsList);
        await helper.processPaymentItems(itemsList, payment.id);

        res.status(200).json({ clearLocalStorage: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post("/payment-success-plata-neautentificata", async (req, res) => {
    try {
        const { session_id } = req.body;
        const session = await helper.getStripeSession(stripe, session_id);
        const { metadata } = session;

        const userIdFromSession = req.session.user?.userId;

        let id_user;

        if (userIdFromSession) {
            id_user = userIdFromSession;
        } else {
            const response = await helper.sendPostRequest(helper.API_URLS.ADD_UTILIZATOR,
                helper.buildBodyUtilizator(metadata));
            id_user = response.id;
        }

        const bodyPlata = helper.buildBodyPlata(metadata, id_user);
        const paymentResponse = await helper.sendPostRequest(helper.API_URLS.ADD_PLATA, bodyPlata);
        const payment = paymentResponse.payment;
        
        const bodyElem = helper.buildBodyElem(payment.id, metadata);
        console.log("bodyElem:", bodyElem);
        await helper.sendPostRequest(helper.API_URLS.ADD_ELEMENT_PLATA, bodyElem);

        res.status(200).json({ clearLocalStorage: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;