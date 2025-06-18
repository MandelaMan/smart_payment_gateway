const express = require("express");
const {
  initiateUSSD,
  testFunctionality,
} = require("../controllers/ussd.controller");

const router = express.Router();

router.post("/", initiateUSSD);
router.post("/test", testFunctionality);

module.exports = router;
