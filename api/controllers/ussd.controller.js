const { readableText } = require("../../utils/helperFunctions");
const { getCustomerDetails } = require("./customer.controller");
const { initiateSTKPush } = require("./mpesa.controller");
require("dotenv").config();

const mainMenuSetup = () => {
  return `CON Welcome to Starlynx Communications. Select from the options below:
  1. New Customer Registration
  2. Manage Account
  0. Exit`;
};

const completedTransaction = (account) => {
  response = `END Subscription for account ${account} has been renewed. New expiry date is 30/07/2025`;
};

const initiateUSSD = async (req, res) => {
  const { phoneNumber, text = "" } = req.body;

  let packageAmount = 1;

  const input = text.trim();
  const parts = input.split("*");

  let response;

  const mainMenu = `CON Welcome to Starlynx Communications Limited. Select from the options below:
  1. New Customer Registration
  2. Manage My Account
  0. Exit`;

  if (input === "" || input === "99") {
    response = mainMenu;
  } else if (input === "0") {
    response = "END Thank you for using our service!";
  } else if (parts[0] === "1") {
    // ${phoneNumber}
    response = `END Please call 0713 400 200 or visit https://starlynx.biz/`;
  } else if (parts[0] === "2") {
    if (parts.length === 1) {
      // Ask for account number
      response = `CON Enter your Customer Number:
                  0. Exit
                  99. Back`;
    } else if (parts.length === 2) {
      const accountNumber = parts[1].trim();

      if (accountNumber === "0") {
        response = "END Thank you for using our service!";
      } else if (accountNumber === "99") {
        response = mainMenu;
      } else {
        const details = await getCustomerDetails(accountNumber);

        if (!details) {
          response = `END Account ${accountNumber} not found.`;
        } else {
          //sent amount to send o the customer

          response = `CON ${details.customer_name}\nPackage: ${
            details.package
          } - Ksh ${details.amount}\nAccount Status: ${readableText(
            details.status
          )}\nExpires On: ${details.dueDate}\n 
              1. Renew Subscription
              2. Upgrade Subscription
              3. Downgrade Subscription
              4. Cancel Subscription
              0. Exit
              99.Back`;
        }
      }
    } else if (parts.length === 3) {
      const accountNumber = parts[1].trim();
      const action = parts[2].trim();

      if (action === "1") {
        results = await initiateSTKPush(phoneNumber, packageAmount);

        if (results) {
          response =
            "END A payment request has been sent. Please check your phone to complete the payment with MPESA.";
        } else {
          response = "END Failed to initiate payment. Please try again later.";
        }
      } else if (action === "2") {
        // Upgrade Subscription
        response = `END Your subscription for account ${accountNumber} has been upgraded. Our team will contact you shortly.`;
      } else if (action === "3") {
        // Cancel Subscription
        response = `END Your subscription for account ${accountNumber} has been cancelled.`;
      } else if (action === "0") {
        response = "END Thank you for using our service!";
      } else if (action === "99") {
        response = `CON Enter your account number:
                      0. Exit
                      99. Back`;
      } else {
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
};

const test = async (req, res) => {
  res.json({
    message: "OK",
  });
};

module.exports = {
  completedTransaction,
  initiateUSSD,
  test,
};
