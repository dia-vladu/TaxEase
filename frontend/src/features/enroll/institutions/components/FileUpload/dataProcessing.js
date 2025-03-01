import axios from 'axios';

const insertDataToInstitutiiPublice = async (file, formData, taxData) => {
    try {
        // Convert FormData to include all extracted data
        const newForm = appendDataToForm(file, formData);

        console.log('file:', file);
        console.log('formData:', formData);
        console.log('taxData:', taxData);
        console.log("newForm:", newForm);

        try {
            const pdfResponse = await axios.post('http://localhost:8080/api/requests/add', newForm);
            const institutionResponse = await axios.post('http://localhost:8080/api/enrolledInstitutions/enrollment', formData);

            console.log('pdfResponse:', pdfResponse.data);
            console.log('institutionResponse:', institutionResponse.data);
        } catch (error) {
            console.error('Error occurred during one of the requests:', error);
            return;
        }

        // Process taxes & fees concurrently
        await insertTaxesAndFees(formData.get('CUI:'), taxData);
    } catch (error) {
        console.error('Error inserting data:', error);
    }
};

const appendDataToForm = (file, formData) => {
    const newForm = new FormData();
    newForm.append('newFile', file);
    formData.forEach((value, key) => {
        newForm.append(key, value);
    });
    return newForm;
};

// Helper function to insert taxes and fees concurrently
const insertTaxesAndFees = async (cui, taxData) => {
    const taxPromises = taxData.map((elem) => {
        const endpoint = elem.name.startsWith('T')
            ? 'http://localhost:8080/api/taxes/add'
            : 'http://localhost:8080/api/fees/add';

        return axios.post(endpoint, { cui, data: elem });
    });

    try {
        const responses = await Promise.all(taxPromises);
        responses.forEach(response => console.log(response.data));
    } catch (error) {
        console.error('Error inserting taxes/fees:', error);
    }
};

const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("newFile", file);

    try {
        const response = await axios.post("http://localhost:8080/api/files/extractPDFText", formData);
        return response.data;
    } catch (error) {
        throw new Error("File upload failed.");
    }
};

const parseExtractedText = (responseData) => {
    const keywords = [
        "Institution Name:", "County:", "Locality:", "CUI:", "Address:",
        "Contact Phone:", "Public Email Address:", "Website Link:",
        "Bonification Percentage:", "Penalty Percentage:", "List of Taxes and Fees:"
    ];

    let startExtraction = false;
    const taxData = [];
    const extractedData = new FormData();
    const lines = responseData.split("\n");

    // Extract tax data
    lines.forEach((line) => {
        if (startExtraction) {
            const taxValues = line.split(", ");
            if (taxValues.length >= 3) {
                taxData.push({
                    iban: taxValues[0]?.trim() || null, //optional chaining
                    treasuryAccount: taxValues[1]?.trim() || null,
                    name: taxValues[2]?.trim() || null,
                    amount: taxValues[3]?.trim() || null,
                });
            }
        }

        if (line.includes("List of Taxes and Fees:")) {
            startExtraction = true;
        }
    });

    // Extract institution data
    let addedTaxes = false;
    for (const keyword of keywords) {
        const match = responseData.match(new RegExp(`${keyword}(.+)`, "u"));
        if (match) {
            const value = match[1].trim();
            if (keyword === "List of Taxes and Fees:" && !addedTaxes) {
                extractedData.append(keyword, JSON.stringify(taxData));
                addedTaxes = true;
            } else {
                extractedData.append(keyword, value);
            }
        }
    }

    return { extractedData, taxData };
};

const validateExtractedData = (extractedData) => {
    console.log(extractedData);
    const requiredFields = [
        "Institution Name:", "County:", "Locality:", "CUI:", "Address:",
        "Contact Phone:", "Public Email Address:", "Website Link:"
    ];

    for (const field of requiredFields) {
        if (!extractedData.get(field)) {
            throw new Error("The form sent is not complete!");
        }
    }
};

export const extractData = async (files) => {
    try {
        const file = files[0];
        console.log(typeof file, file);
        if (!file) throw new Error("No file selected.");

        const responseData = await uploadFile(file);
        const { extractedData, taxData } = parseExtractedText(responseData);

        validateExtractedData(extractedData);
        insertDataToInstitutiiPublice(file, extractedData, taxData);

        console.log("Extraction successful!");
    } catch (error) {
        console.error("Extraction failed:", error);
        throw error;
    }
};
