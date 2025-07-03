const express = require("express");
const {
  test,
  mpesaCallbackFunction,
} = require("../controllers/mpesa.controller");

const router = express.Router();

router.get("/", test);
router.post("/callback", mpesaCallbackFunction);

module.exports = router;
