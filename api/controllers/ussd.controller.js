module.exports = {
  initiateUSSD: (req, res) => {
    // Read the variables sent via POST from our API
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    let response = "";
    if (text == "") {
      // This is the first request. Note how we start the response with CON
      response = `CON Welcome to Starlynx Communications. Select from the options below
            1. New Customer
            2. Existing Customer`;
    } else if (text == "1") {
      // Business logic for first level response
      response = `CON Please enter your Customer Number`;
    } else if (text == "2") {
      // Business logic for first level response
      // This is a terminal request. Note how we start the response with END
      response = `END Your phone number is ${phoneNumber}`;
    } else if (text == "1*1") {
      // This is a second level response where the user selected 1 in the first instance
      const customerNumber = "ENK-1234";
      // This is a terminal request. Note how we start the response with END
      response = `END Your account number is ${customerNumber}`;
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
