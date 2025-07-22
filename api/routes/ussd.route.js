const express = require("express");
const {
  initiateUSSD,
  completedTransaction,
} = require("../controllers/ussd.controller");

const router = express.Router();

router.post("/", initiateUSSD);
router.get("/complete", completedTransaction);

module.exports = router;
