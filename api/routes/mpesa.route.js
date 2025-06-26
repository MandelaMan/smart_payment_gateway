const express = require("express");
const { test } = require("../controllers/mpesa.controller");

const router = express.Router();

router.get("/", test);

module.exports = router;
