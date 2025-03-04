const axios = require("axios");
const { extractBirthDate, extractGender } = require("../../utils/userUtils");

const API_URLS = {
    ADD_PLATA: "http://localhost:8080/api/payments/add",
    ADD_ELEMENT_PLATA: "http://localhost:8080/api/paymentElements/add",
    UPDATE_IMPOZIT: "http://localhost:8080/api/knownTaxes",
    ADD_UTILIZATOR: "http://localhost:8080/api/users/add"
};

/**
 * Retrieves a Stripe session.
 * @param {Object} stripe - The Stripe instance.
 * @param {string} session_id - The session ID.
 * @returns {Promise<Object>} - The Stripe session.
 */
async function getStripeSession(stripe, session_id) {
    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        return session;
    } catch (error) {
        throw new Error("Failed to retrieve Stripe session: " + error.message);
    }
}

async function sendPostRequest(url, body) {
    try {
        const response = await axios.post(url, body);
        return response.data;
    } catch (error) {
        throw new Error(`POST request to ${url} failed: ${error.message}`);
    }
}

async function updateImpozit(id) {
    try {
        await axios.put(`${API_URLS.UPDATE_IMPOZIT}/${id}`);
    } catch (error) {
        throw new Error(`Failed to update impozit with ID ${id}: ${error.message}`);
    }
}

async function processPaymentItems(itemsList, paymentId) {
    for (const item of itemsList) {
        const bodyElem = {
            paymentId: paymentId,
            knownTaxId: item.id,
            taxId: null,
            feeId: null,
        }
        console.log("bodyElem:", bodyElem);
        await sendPostRequest(API_URLS.ADD_ELEMENT_PLATA, bodyElem);
        await updateImpozit(item.id);
    }
}

function buildBodyUtilizator(metadata) {
    return {
        identificationCode: metadata.payerCode,
        surname: metadata.surname,
        name: metadata.name,
        birthDate: extractBirthDate(metadata.payerCode),
        email: metadata.email,
        phoneNumber: null,
        address: null,
        gender: extractGender(metadata.payerCode),
    };
}

function buildBodyPlata(metadata, userId) {
    return {
        paymentDate: new Date(),
        amount: metadata.amount,
        benefitedPersonId: metadata.identificationCode || metadata.payeeCode,
        institutionCUI: metadata.institutionCui,
        cardId: null,
        userId: userId,
    };
}

function buildBodyElem(paymentId, metadata) {
    return {
        paymentId: paymentId,
        knownTaxId: null,
        taxId: metadata.tax_id !== '' ? metadata.tax_id : null,
        feeId: metadata.fee_id !== '' ? metadata.fee_id : null,
    };
}

module.exports = {
    getStripeSession, sendPostRequest, updateImpozit, processPaymentItems, API_URLS,
    buildBodyUtilizator, buildBodyPlata, buildBodyElem
};
