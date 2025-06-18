const express = require("express");
const { initiateUSSD } = require("../controllers/ussd.controller");

const router = express.Router();

router.post("/", initiateUSSD);

module.exports = router;
