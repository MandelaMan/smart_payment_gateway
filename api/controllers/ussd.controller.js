const { getCustomerDetails } = require("./zoho.controller");

module.exports = {
  initiateUSSD: (req, res) => {
    const { phoneNumber, text = "" } = req.body;

    const input = text.trim();
    const parts = input.split("*");

    let response;

    const mainMenu = `CON Welcome to Starlynx Communications. Select from the options below
            1. New Customer Registration
            2. My Account
            0. Exit`;

    if (input === "" || input === "99") {
      response = mainMenu;
    } else if (input === "0") {
      response = "END Thank you for using our service!";
    } else if (parts[0] === "1") {
      response = `END Please call 0713 400 200 or visit https://starlynx.biz/ ${phoneNumber}`;
    } else if (parts[0] === "2") {
      if (parts.length === 1) {
        response = `CON Enter your account number:
                    0. Exit
                    99. Back`;
      } else if (parts.length === 2) {
        const accountNumber = parts[1].trim();
        if (accountNumber === "0") {
          response = "END Thank you for using our service!";
        } else if (accountNumber === "99") {
          response = mainMenu;
        } else {
          const info = { balance: 113.4, name: "John Doe" };
          if (!info) {
            response = `END Account ${accountNumber} not found.`;
          } else {
            response = `END Hello ${
              info.name
            }!\nAccount: ${accountNumber}\nBalance: KES ${info.balance.toFixed(
              2
            )}`;
          }
        }
      }
    } else {
      response = "END Invalid choice. Please try again.";
    }

    // Send the response back to the API
    res.set("Content-Type: text/plain");
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
