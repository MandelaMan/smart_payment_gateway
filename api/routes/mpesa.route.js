const express = require("express");
const {
  test,
  mpesaTransactionsInCallback,
  mpesaTransactionsOutCallback,
} = require("../controllers/mpesa.controller");

const router = express.Router();

router.get("/", test);
router.post("/callbackIn", mpesaTransactionsInCallback);
router.post("/callbackOut", mpesaTransactionsOutCallback);

module.exports = router;
