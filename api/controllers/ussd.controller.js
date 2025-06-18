module.exports = {
  initiateUSSD: (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text = "" } = req.body;
    const parts = text.split("*");
    let response;

    if (text === "") {
      response = `CON Welcome! What would you like to do?
                1. My account
                2. My phone number`;
    } else if (parts[0] === "1" && parts.length === 1) {
      response = `CON Enter your account number:`;
    } else if (parts[0] === "2") {
      response = `END Your phone number is ${phoneNumber}`;
    } else if (parts[0] === "1" && parts.length === 2) {
      const acct = parts[1].trim();
      const info = { balance: 2540.75, name: "Alice Kyalo" };
      if (!info) {
        response = `END Sorry, account ${acct} not found.`;
      } else {
        response = `END Hello ${
          info.name
        }!\nAccount: ${acct}\nBalance: KES ${info.balance.toFixed(2)}`;
      }
    } else {
      response = `END Invalid choice. Please try again.`;
    }

    // Send the response back to the API
    res.set("Content-Type: text/plain");
    res.send(response);
  },
  test: (req, res) => {
    res.json({
      message: "ok",
    });
  },
};
