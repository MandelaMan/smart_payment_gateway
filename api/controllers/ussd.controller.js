module.exports = {
  initiateUSSD: (req, res) => {
    const accountStatus = "Account status: Active";
    // Read the variables sent via POST from our API
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    let response = "";
    if (text == "" || text == 0) {
      // This is the first request. Note how we start the response with CON
      response = `CON Welcome to Starlynx Communications. Select from the options below
            1. Register - New Customer
            2. My Account`;
    } else if (text == "1") {
      // Business logic for first level response
      response = `END Please call 0713 400 200 or visit https://starlynx.biz/`;
    } else if (text == "2") {
      // This is the first request. Note how we start the response with CON
      response = `CON Please enter your Customer Number`;
    } else if (text != "") {
      // This is the first request. Note how we start the response with CON
      response = `END ${text}`;
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
