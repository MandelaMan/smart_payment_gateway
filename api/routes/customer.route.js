const express = require("express");
const {
  getCustomerDetails,
  reportTransactions,
  test,
} = require("../controllers/customer.controller");

const router = express.Router();

router.post("/", reportTransactions);
router.get("/:customerNo", getCustomerDetails);
router.post("/test", test);

module.exports = router;
