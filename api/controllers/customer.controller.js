const moment = require("moment");
const { getSpecificCustomer } = require("./zoho.controller");
const { getTISPCustomer } = require("./tisp.controller");

module.exports = {
  reportTransactions: (req, res) => {
    res.json({
      message: "ok",
    });
  },
  getCustomerDetails: async (customerNo) => {
    const customerDetails = {
      ...(await getSpecificCustomer(customerNo)),
      ...(await getTISPCustomer(client)),
    };

    return customerDetails;
  },
  test: (req, res) => {
    res.json({
      message: "ok",
    });
  },
};
