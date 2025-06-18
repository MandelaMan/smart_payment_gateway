const { getCustomerDetails } = require("./zoho.controller");

module.exports = {
  initiateUSSD: (req, res) => {
    const { phoneNumber, text = "" } = req.body;

    const input = text.trim();
    const parts = input.split("*");

    let response;

    const mainMenu = `CON Welcome to Starlynx Communications. Select from the options below:
    1. New Customer Registration
    2. Manage Account
    0. Exit`;

    if (input === "" || input === "99") {
      response = mainMenu;
    } else if (input === "0") {
      response = "END Thank you for using our service!";
    } else if (parts[0] === "1") {
      response = `END Please call 0713 400 200 or visit https://starlynx.biz/ ${phoneNumber}`;
    } else if (parts[0] === "2") {
      if (parts.length === 1) {
        // Ask for account number
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
          // Simulated account info
          const info = { isActive: true, dueDate: "23/06/2025" };

          if (!info) {
            response = `END Account ${accountNumber} not found.`;
          } else {
            response = `CON Account Status: ${
              info.isActive ? "Active" : "Suspended"
            }\nExpiry Date: ${info.dueDate}\nSelect from the options below:
    1. Renew Subscription
    2. Upgrade Subscription
    3. Cancel Subscription
    0. Exit
    99. Back`;
          }
        }
      } else if (parts.length === 3) {
        const accountNumber = parts[1].trim();
        const action = parts[2].trim();

        switch (action) {
          case "1":
            // Renew Subscription
            response = `END Your subscription for account ${accountNumber} has been renewed successfully.`;
            break;
          case "2":
            // Upgrade Subscription
            response = `END Your subscription for account ${accountNumber} has been upgraded. Our team will contact you shortly.`;
            break;
          case "3":
            // Cancel Subscription
            response = `END Your subscription for account ${accountNumber} has been cancelled.`;
            break;
          case "0":
            response = "END Thank you for using our service!";
            break;
          case "99":
            response = `CON Enter your account number:
    0. Exit
    99. Back`;
            break;
          default:
            response = "END Invalid option selected.";
        }
      } else {
        response = "END Invalid entry. Please try again.";
      }
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
