let express = require('express');
const asyncHandler = require("express-async-handler");
let router = express.Router();
const Institution = require("../../models/institutions/institution");
const { checkParam } = require('../../middleware/validate');

//GET all admins' emails
router.get('/admin-emails', asyncHandler(async (req, res) => {
    const adminEmails = await Institution.findAll({
        attributes: ['adminEmail'],
    });
    if (adminEmails.length === 0) {
        return res.status(200).json({ message: "No admin emails found." });
    }
    res.status(200).json(adminEmails);
}));

//GET institution (search after CUI)
router.get('/:cui', checkParam('cui'), asyncHandler(async (req, res) => {
    const { cui } = req.params;
    const institution = await Institution.findByPk(cui);
    if (!institution) {
        return res.status(404).json({ error: `Institution with cui ${cui} not found!` })
    }
    res.status(200).json(institution);
}));

module.exports = router;