let express = require("express");
let router = express.Router();
const KnownTax = require("../../models/taxes/knownTax");
const { checkParam } = require('../../middleware/validate');


//GET all known taxes
router.get("/", async (req, res) => {
  try {
    const taxes = await KnownTax.findAll();
    res.status(200).json(taxes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch known taxes." });
  }
});

//GET one impozit anuntat (search after impozit id)
router
  .route("/:id")
  .get(checkParam('id'), async (req, res) => {
    try {
      const { id } = req.params;
      const tax = await KnownTax.findByPk(id);
      if (!tax) {
        res.status(404).json({ error: `Known tax with id ${id} not found!` });
      }
      res.status(200).json(tax);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to fetch known tax.' });
    }
  })
  .put(checkParam('id'), async (req, res) => {
    const { id } = req.params;
    try {
      const affectedRows = await KnownTax.update(
        { paid: true },
        { where: { id } }
      );

      if (affectedRows[0] === 0) {
        return res.status(404).json({ error: `Known tax with id ${id} not found.` });
      }

      res.status(200).json({ message: "Successfully updated known tax." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update known tax." });
    }
  });

//GET all known taxes (search after user id)
//Also check for query param -> to get only the unpaid taxes
router.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  const { unpaid } = req.query;
  try {
    let conditions = { userAccountId: userId };
    if (unpaid === 'true') {
      conditions.paid = 'NO'; // Filter by unpaid taxes
    }
    const taxes = await KnownTax.findAll({
      where: conditions,
    });

    if(!taxes){
      res.send(200).json([]);
    }
    res.status(200).json(taxes);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch all known taxes for provided user." });
  }
});

//UPDATE known tax to add a payment schedule 
router.put("/schedule-payment/:taxId", async (req, res) => {
  const { taxId } = req.params;
  taxId = parseInt(taxId);
  const { scheduleId } = req.body;
  try {

    const affectedRows = await KnownTax.update(
      { paymentScheduleId: scheduleId },
      { where: { id: taxId } }
    )

    if (affectedRows[0] === 0) {
      return res.status(404).json({ error: `Tax with id ${taxId} not found.` });
    }

    res.status(200).json({ message: "Successfully updated known tax with schedule payment." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update known tax." });
  }
});

module.exports = router;
