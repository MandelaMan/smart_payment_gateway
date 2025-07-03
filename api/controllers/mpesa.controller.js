const moment = require("moment");
const axios = require("axios");
const fs = require("fs");
const { readJsonFromFile } = require("../../utils/helperFunctions");

const mpesaCallbackFunction = async (req, res) => {
  readJsonFromFile("./logs/transactions.json", (err, data) => {
    if (err) {
      console.log(err);
    }
    const updatedTransactions = [...data, req.body];
    fs.writeFile(
      "./logs/transactions.json",
      JSON.stringify(updatedTransactions, null, 2),
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          // run function after confirming actual payment
          res.status(200).json({
            message: "ok",
          });
        }
      }
    );
  });
};

const getAccessToken = async () => {
  try {
    const secret_key = process.env.MPESA_CONSUMER_SECRET;
    const consumer_key = process.env.MPESA_CONSUMER_KEY;

    const auth = Buffer.from(`${consumer_key}:${secret_key}`).toString(
      "base64"
    );

    const config = {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    };

    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      config
    );

    return response.data.access_token; // return the token
  } catch (error) {
    console.error("Error getting access token:", error.message);
    throw error; // Propagate the error to the caller
  }
};

const initiateSTKPush = async (phone, amount) => {
  try {
    const token = await getAccessToken();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    let user_phone = phone.replace(/^(\+|0)+/, "");
    const Timestamp = moment().format("YYYYMMDDHHmmss");
    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASS_KEY;
    const password = new Buffer.from(shortcode + passkey + Timestamp).toString(
      "base64"
    );

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp,
      TransactionType: "CustomerBuyGoodsOnline",
      Amount: amount,
      PartyA: `${user_phone}`,
      PartyB: shortcode,
      PhoneNumber: `${user_phone}`,
      CallBackURL: "https://api.starlynx.biz/mpesa/callback",
      AccountReference: "Test",
      TransactionDesc: "Test",
    };

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      config
    );

    return response.data;
  } catch (error) {
    console.error("STK Push Error:", error.message);
    return { error: "Initiate STKPush" + user_phone + error.message };
  }
};

const test = async (req, res) => {
  try {
    const results = await initiateSTKPush("+254701057515", 1);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Test" + err.message });
  }
};

module.exports = {
  mpesaCallbackFunction,
  getAccessToken,
  initiateSTKPush,
  test,
};
