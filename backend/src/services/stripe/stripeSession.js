const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const axios = require("axios");
const { calculateTaxAdjustments } = require("../../utils/taxAdjustment.js");

const fetchUserData = async (userId) => {
  const userResponse = await axios.get(`http://localhost:8080/api/users/${userId}`);
  return userResponse.data;
};

const fetchInstitutionData = async (cui) => {
  const institutionResponse = await axios.get(`http://localhost:8080/api/enrolledInstitutions/cui/${cui}`);
  return institutionResponse.data;
};

const prepareLineItems = async (taxesData, bonificationRate, penaltyRate) => {
  return taxesData.flatMap((tax) => {
    const { bonification, penalties } = calculateTaxAdjustments(
      tax,
      new Date(),
      bonificationRate,
      penaltyRate,
      tax.taxName
    );

    // Convert to cents (bani for lei/RON)
    const unitAmountInBani = tax.amount * 100;

    let finalAmount = unitAmountInBani;

    if (bonification) {
      finalAmount = finalAmount - bonification.amount * 100; // Subtract bonification
    }
    // if (penalties) {
    //   finalAmount = finalAmount + penalties.amount * 100; // Add penalty
    // }

    // Base tax line item
    const lineItems = [
      {
        price_data: {
          currency: "ron",
          product_data: { name: unitAmountInBani === finalAmount ? tax.taxName : `${tax.taxName} * Bonification applied` },
          unit_amount: finalAmount,
        },
        quantity: 1,
      },
    ];

    // Add penalty as a separate line item
    if (penalties) {
      lineItems.push({
        price_data: {
          currency: "ron",
          product_data: { name: `Penalty for ${tax.taxName} (${penaltyRate}% penalty rate)` },
          unit_amount: penalties.amount * 100,
        },
        quantity: 1,
      });
    }

    // Add bonification (discount) as a separate line item (negative amount)
    if (bonification) {
      lineItems.push({
        price_data: {
          currency: "ron",
          product_data: {
            name: `Bonification for ${tax.taxName} (${bonificationRate}% discount)`,
          },
          unit_amount: 0,
        },
        quantity: 1,
      });
    }

    return lineItems;
  });
};

module.exports = { fetchUserData, fetchInstitutionData, prepareLineItems }