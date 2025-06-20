const express = require("express");
const { getCustomerDetails } = require("../controllers/customer.controller");

const router = express.Router();

router.get("/:customerNo", getCustomerDetails);

module.exports = router;
