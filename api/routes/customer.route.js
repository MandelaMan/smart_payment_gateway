const express = require("express");
const { getCustomerDetails } = require("../controllers/customer.controller");

const router = express.Router();

router.get("/", getCustomerDetails);

module.exports = router;
