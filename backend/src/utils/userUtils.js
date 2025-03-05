function validateTIN(tin) {
    if (!tin || typeof tin !== "string" || tin.length === 0) {
        throw new Error("Invalid TIN: must be a non-empty string");
    }

    if (!/^\d+$/.test(tin)) {
        throw new Error("Invalid TIN: must contain only digits");
    }
}

function extractBirthDate(tin) {
    validateTIN(tin);

    if (tin.length < 7) {
        throw new Error("Invalid TIN: too short to extract birth date");
    }

    const firstDigit = parseInt(tin.charAt(0), 10);
    const yearMapping = {
        1: "19",
        2: "19",
        3: "18",
        4: "18",
        5: "20",
        6: "20",
    };

    const yearPrefix = yearMapping[firstDigit];
    if (!yearPrefix) {
        throw new Error("Invalid TIN: unknown first digit for birth year prefix");
    }

    const year = parseInt(yearPrefix + tin.substr(1, 2), 10);
    const month = parseInt(tin.substr(3, 2), 10);
    const day = parseInt(tin.substr(5, 2), 10);

    const birthDate = new Date(year, month - 1, day);
    if (
        birthDate.getFullYear() !== year ||
        birthDate.getMonth() !== month - 1 ||
        birthDate.getDate() !== day
    ) {
        throw new Error("Invalid TIN: date components out of range");
    }

    console.log(birthDate);
    return birthDate;
}

function extractGender(tin) {
    validateTIN(tin);

    const firstDigit = parseInt(tin.charAt(0), 10);

    if (firstDigit < 1 || firstDigit > 8) {
        return null;
    }

    const gender = (firstDigit % 2 === 0) ? "F" : "M";
    return gender;
}

module.exports = { extractBirthDate, extractGender };