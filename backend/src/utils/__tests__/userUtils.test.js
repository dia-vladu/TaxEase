const { extractBirthDate, extractGender } = require("../userUtils");

describe("extractBirthDate", () => {
    test("Should correctly extract birth date", () => {
        expect(extractBirthDate("1981101012345")).toEqual(new Date(1998, 10, 1));
        expect(extractBirthDate("5010213123456")).toEqual(new Date(2001, 1, 13));
    })

    test("Should throw an error for invalid TIN formats", () => {
        expect(() => extractBirthDate(null)).toThrow("Invalid TIN: must be a non-empty string");
        expect(() => extractBirthDate("")).toThrow("Invalid TIN: must be a non-empty string");
        expect(() => extractGender(23)).toThrow("Invalid TIN: must be a non-empty string");
        expect(() => extractBirthDate("123")).toThrow("Invalid TIN: too short to extract birth date");
        expect(() => extractBirthDate("5a1b213123456")).toThrow("Invalid TIN: must contain only digits");
    })

    test("should throw an error for invalid first digit", () => {
        expect(() => extractBirthDate("7990101123456")).toThrow("Invalid TIN: unknown first digit for birth year prefix");
    });

    test("should throw an error if the date is out of range", () => {
        expect(() => extractBirthDate("1990999123456")).toThrow("Invalid TIN: date components out of range");
        expect(() => extractBirthDate("5021321123456")).toThrow("Invalid TIN: date components out of range");
    });
})

describe("extractGender", () => {
    test("should return 'M' for male identifiers", () => {
        expect(extractGender("1980101012345")).toBe("M");
        expect(extractGender("3010203123456")).toBe("M");
    });

    test("should return 'F' for female identifiers", () => {
        expect(extractGender("2010101012345")).toBe("F");
        expect(extractGender("4021321123456")).toBe("F");
    });

    test("should return null for invalid TIN", () => {
        expect(extractGender("9990101012345")).toBeNull();
        expect(() => extractGender("")).toThrow("Invalid TIN: must be a non-empty string");
        expect(() => extractGender(23)).toThrow("Invalid TIN: must be a non-empty string");
        expect(() => extractGender(null)).toThrow("Invalid TIN: must be a non-empty string");
        expect(() => extractGender("abcde")).toThrow("Invalid TIN: must contain only digits");
        expect(() => extractGender("a990101012345")).toThrow("Invalid TIN: must contain only digits");
    });
});