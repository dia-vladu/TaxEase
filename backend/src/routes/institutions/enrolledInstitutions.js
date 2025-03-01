let express = require("express");
const asyncHandler = require("express-async-handler");
const sequelize = require("../../sequelize");
let router = express.Router();
const multer = require("multer");
const EnrolledInstitution = require("../../models/institutions/enrolledInstitution");
const { enrollInstitution } = require("../../controller/enrollmentController");
const { checkParam } = require('../../middleware/validate');

//GET all enrolled institutions
router.get("/", asyncHandler(async (req, res) => {
  const institutions = await EnrolledInstitution.findAll();
  if (institutions.length === 0) {
    return res.status(200).json({ message: "No enrolled institutions found!" });
  }
  res.status(200).json(institutions);
}));

const upload = multer();
//Enrollment process <=> storage request + get county code + storage institution as enrolled
router.post("/enrollment", upload.none(), enrollInstitution);

//GET enrolled institution (search after CUI)
router.get("/cui/:cui", checkParam('cui'), asyncHandler(async (req, res) => {
  const { cui } = req.params;
  const institution = await EnrolledInstitution.findByPk(cui);
  if (!institution) {
    return res.status(404).json({ error: `Institution with cui ${cui} not found!` });
  }
  res.status(200).json(institution);
}));

//GET enrolled institution (search after name)
router.get("/name/:name", asyncHandler(async (req, res) => {
  const { name } = req.params;

  const institution = await EnrolledInstitution.findOne({
    where: { name }
  });
  if (!institution) {
    return res.status(404).json({ error: `Institution "${name}" not found!` });
  }
  res.status(200).json(institution);
}));

//GET all enrolled institutions (search after county code)
router.get("/code/:countyCode", asyncHandler(async (req, res) => {
  const { countyCode } = req.params;
  const institutions = await EnrolledInstitution.findAll({
    where: { countyCode }
  });
  if (institutions.length === 0) {
    return res.status(200).json({ message: "No enrolled institutions found in this county" });
  }
  res.status(200).json(institutions);
}));

//GET all fees and taxes for a specific institution (search after institution cui)
router.get("/feesAndTaxes/:cui", async (req, res) => {
  const { cui } = req.params;

  try {
    const records = await sequelize.query(
      `
        SELECT id, name, treasury_Account, iban, NULL AS amount, institution_CUI
        FROM TAXES
        WHERE institution_CUI = :cui
        UNION
        SELECT id, name, treasury_Account, iban, amount, institution_CUI
        FROM FEES
        WHERE institution_CUI = :cui;
      `,
      {
        replacements: { cui },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
