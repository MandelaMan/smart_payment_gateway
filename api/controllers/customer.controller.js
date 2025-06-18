const moment = require("moment");
const axios = require("axios");

module.exports = {
  getCustomerDetails: (customerNo, next) => {
    const mock = {
      ACC100101: { balance: 2540.75, name: "Alice Kyalo" },
      ACC200202: { balance: 113.4, name: "John Doe" },
    };

    const customerDetails = mock[customerNo] || null;

    return customerDetails;
  },
  test: (req, res) => {
    res.json({
      message: "ok",
    });
  },
};
