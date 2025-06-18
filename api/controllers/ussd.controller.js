const { getCustomerDetails } = require("./zoho.controller");

module.exports = {
  initiateUSSD: (req, res) => {
    const { phoneNumber, text = "" } = req.body;

    const input = text.trim();
    const parts = input.split("*");

    let response;

    const mainMenu = `CON Welcome to Starlynx Communications. Select from the options below:
    1. New Customer Registration
    2. Manage my Account
    0. Exit`;

    if (input === "" || input === "99") {
      response = mainMenu;
    } else if (input === "0") {
      response = "END Thank you for using our service!";
    } else if (parts[0] === "1") {
      response = `END Please call 0713 400 200 or visit https://starlynx.biz/ ${phoneNumber}`;
    } else if (parts[0] === "2") {
      response = `END Ready to proceed`;
    } else {
      response = "END Invalid choice. Please try again.";
    }

    res.set("Content-Type", "text/plain");
    res.send(response);
  },
  testFunctionality: async (req, res) => {
    const { customerNo } = req.body;

    const info = await getCustomerDetails(customerNo);

    res.json({
      message: info,
    });
  },
};
