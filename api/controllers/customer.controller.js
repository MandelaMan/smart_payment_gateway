const moment = require("moment");
const { getSpecificCustomer } = require("./zoho.controller");
const { getTISPCustomer } = require("./tisp.controller");

const reportTransactions = () => {
  res.json({
    message: "ok",
  });
};

const getCustomerDetails = async (client) => {
  const customerDetails = {
    ...(await getSpecificCustomer(client)),
    ...(await getTISPCustomer(client)),
  };

  return customerDetails;
};

const test = async (req, res) => {
  const { client } = req.body;

  const result = await getCustomerDetails(client);

  // res.json({
  //   message: "ok",
  // });

  res.json(result);
};

module.exports = {
  reportTransactions,
  getCustomerDetails,
  test,
};
