const express = require("express");
const {
  getCustomerDetails,
  reportTransactions,
} = require("../controllers/customer.controller");

const router = express.Router();

router.post("/", reportTransactions);
router.get("/:customerNo", getCustomerDetails);

module.exports = router;
