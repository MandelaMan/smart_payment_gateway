const moment = require("moment");
const axios = require("axios");
const { getSpecificCustomer } = require("./zoho.controller");

module.exports = {
  getCustomerDetails: async (customerNo) => {
    const zohoCustomerDetails = {
      ...(await getSpecificCustomer(customerNo)),
      isActive: true,
      dueDate: "23/06/2025",
    };

    return zohoCustomerDetails;
  },
  getCustomerDetailsTest: async (req, res) => {
    const { customerNo } = req.params;

    const zohoCustomerDetails = {
      ...(await getSpecificCustomer(customerNo)),
      isActive: true,
      dueDate: "23/06/2025",
    };

    res.json(zohoCustomerDetails);
  },
  test: (req, res) => {
    res.json({
      message: "ok",
    });
  },
};
