const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const express = require("express");
const router = express.Router();
const helper = require("../../services/stripe/stripeSession.js");

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { items, metadata } = req.body;
    console.log("session:", req.session);
    const { userId } = req.session.user;
    console.log("userId:", userId);

    const user = await helper.fetchUserData(userId);
    console.log("userData:", user);
    const email = user.email;

    const institutionData = await helper.fetchInstitutionData(metadata.institutionCui);
    console.log("institution data:", institutionData);
    const { bonificationPercentage, penaltyPercentage } = institutionData;

    // Prepare the line items for Stripe
    const lineItems = await helper.prepareLineItems(items, bonificationPercentage, penaltyPercentage);
    console.log("line items:", lineItems);

    // Create a Stripe checkout session
    const session = await createStripeSession(lineItems, email, metadata, `http://localhost:3000/dashboard`);

    res.json({ url: session.url, session_id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Function to create a Stripe session
const createStripeSession = async (lineItems, email, metadata, url) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    success_url: url,
    cancel_url: url,
    metadata: metadata,
    customer_email: email,
  });

  return session;
};

router.post("/create-checkout-session-plata-neautentificata", async (req, res) => {
  try {
    const { items, metadata } = req.body;
    let name = null;
    metadata.tax_name !== null
      ? (name = metadata.tax_name)
      : (name = metadata.fee_name);
    const unitAmountInBani = metadata.amount * 100;

    const lineItems = [
      {
        price_data: {
          currency: "ron",
          product_data: {
            name: name,
          },
          unit_amount: unitAmountInBani,
        },
        quantity: 1,
      },
    ];

    const session = await createStripeSession(lineItems, metadata.email, metadata, `http://localhost:3000/pay`);

    res.json({ url: session.url, session_id: session.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
