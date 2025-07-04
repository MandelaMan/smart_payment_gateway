const express = require("express");
const { getTISPCustomer, test } = require("../controllers/tisp.controller");

const router = express.Router();

router.post("/client", test);

module.exports = router;
