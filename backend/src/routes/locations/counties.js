let express = require('express');
const asyncHandler = require("express-async-handler");
let router = express.Router();
const County = require("../../models/locations/county");
const { checkParam } = require('../../middleware/validate');

//GET all counties.
router.get('/', asyncHandler(async (req, res) => {
    const counties = await County.findAll();
    if (counties.length === 0) {
        return res.status(200).json({ error: `No counties found!` })
    }
    res.status(200).json(counties);
}));

//GET a specific county (search after code)
router.get('/:code', checkParam('code'), asyncHandler(async (req, res) => {
    const { code } = req.params;
    const county = await County.findByPk(code);
    if (!county) {
        return res.status(404).json({ error: `County with code ${code} not found!` })
    }
    res.status(200).json(county);
}));

//GET the code of a specific county (search after county name)
router.get('/code/:countyName', asyncHandler(async (req, res) => {
    const { countyName } = req.params;

    const county = await County.findOne({
        attributes: ['code'],
        where: { name: countyName }
    });

    if (!county) {
        return res.status(404).json({ error: `County ${countyName} not found!` });
    }
    res.status(200).json(county.code);
}));

module.exports = router;