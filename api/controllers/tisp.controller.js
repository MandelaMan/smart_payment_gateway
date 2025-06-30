const axios = require("axios");
const moment = require("moment");
require("dotenv").config();

const getTISPCustomer = async () => {
  const data = {
    dueDate: "30/06/2023",
    isActive: true,
  };
  return data;
};

const test = (req, res) => {
  res.json({
    message: "ok",
  });
};

module.exports = {
  getTISPCustomer,
  test,
};
