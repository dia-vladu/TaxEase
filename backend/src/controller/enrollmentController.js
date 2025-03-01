const axios = require("axios");
const asyncHandler = require("express-async-handler");
const EnrolledInstitution = require("../models/institutions/enrolledInstitution");
const removeDiacritics = require("../utils/stringUtils");

const enrollInstitution = asyncHandler(async (req, res) => {
    const data = req.body;

    const requestId = await axios.get(`http://localhost:8080/api/requests/cui/${data["CUI:"]}`);
    console.log('requestId', requestId.data);
    if (!requestId) {
        return res.status(404).json({ success: false, message: "Enrollment request id not found!" });
    }

    const countyCode = await axios.get(`http://localhost:8080/api/counties/code/${data["County:"]}`);
    console.log('countyCode', countyCode.data);
    if (!countyCode) {
        return res.status(404).json({ success: false, message: "County code not found!" });
    }
    
    try {
        const response = await EnrolledInstitution.create({
            cui: data["CUI:"],
            name: removeDiacritics(data["Institution Name:"]),
            phoneNumber: data["Contact Phone:"],
            publicEmail: data["Public Email Address:"],
            address: removeDiacritics(data["Address:"]),
            officialSiteLink: data["Website Link:"],
            locality: data["Locality:"],
            bonificationPercentage: data["Bonification Percentage:"],
            penaltyPercentage: data["Penalty Percentage:"],
            requestId: requestId.data,
            countyCode: countyCode.data,
        });

        console.log('response', response); 

        res.status(201).json({ success: true, message: 'Enrollment done successfully.', response });
    } catch (error) {
        console.error('Error inserting into EnrolledInstitution:', error); 

        // Check if the error is a Sequelize database error
        if (error.name === 'SequelizeDatabaseError') {
            // Log specific details about the error
            console.error('Sequelize error details:', error.message);
            console.error('Sequelize error fields:', error.fields);  // Fields might show the specific column causing the issue
        }

        // Send the error details in the response to the client
        res.status(500).json({ success: false, message: "Failed to insert data into table.", error: error.message });
    }


    // if (!response) {
    //     const error = new Error({ success: false, message: "Failed to insert data into table." });
    //     error.status = 500;
    //     throw error;
    // }
    // res.status(201).json({ success: true, message: 'Enrollment done successfully.', response });
});

module.exports = { enrollInstitution };