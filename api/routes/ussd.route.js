const express = require("express");
const {
  initiateUSSD,
  testFunctionality,
  customerData,
} = require("../controllers/ussd.controller");

const router = express.Router();

router.post("/", initiateUSSD);
router.post("/test", testFunctionality);
router.get("/customer", customerData);

module.exports = router;
