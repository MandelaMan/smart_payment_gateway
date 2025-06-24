const moment = require("moment");
const { getSpecificCustomer } = require("./zoho.controller");
const { getTISPCustomer } = require("./tisp.controller");

module.exports = {
  getCustomerDetails: async (customerNo) => {
    const customerDetails = {
      ...(await getSpecificCustomer(customerNo)),
      ...(await getTISPCustomer(customerNo)),
    };

    return customerDetails;
  },
  test: (req, res) => {
    res.json({
      message: "ok",
    });
  },
};
