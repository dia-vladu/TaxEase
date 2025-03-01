const { getMonthDifference } = require("./dateUtils.js");

const calculateTaxAdjustments = (knownTax, paymentDate, bonificationRate, penaltyRate, name) => {
    const issuanceDate = new Date(knownTax.issuanceDate);
    const paymentYear = paymentDate.getFullYear();
    const issuanceYear = issuanceDate.getFullYear();
    const isSameYear = paymentYear === issuanceYear;

    const march31 = new Date(paymentYear, 2, 31);
    const sept30 = new Date(paymentYear, 8, 30);

    const beforeMarch31 = paymentDate < march31;
    const afterSeptember30 = paymentDate > sept30;

    const calculatePenalities = (startDate, endDate) => ({
        amount: (penaltyRate / 100) * getMonthDifference(startDate, endDate) * parseFloat(knownTax.amount),
        name: `Penalty: ${name}`
    });

    const calculateBonificatie = () => {
        return {
            amount: (bonificationRate / 100) * parseFloat(knownTax.amount),
            name: `Bonification: ${name}`
        }
    };

    let penalties = null;
    let bonification = null;

    if (parseFloat(knownTax.amount) <= 50) {
        bonification = isSameYear && beforeMarch31 ? calculateBonificatie() : null;
        penalties = !bonification ? calculatePenalities(march31, issuanceDate) : null;
    } else {
        if (beforeMarch31 && isSameYear) {
            bonification = calculateBonificatie();
        } else if (beforeMarch31 && !isSameYear) {
            penalties = calculatePenalities(issuanceDate, sept30);
        } else if (afterSeptember30 || !isSameYear) {
            penalties = calculatePenalities(sept30, issuanceDate);
        }
    }

    return { bonification, penalties };
};

module.exports = { calculateTaxAdjustments };
