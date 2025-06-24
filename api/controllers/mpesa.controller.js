const moment = require("moment");
const axios = require("axios");

// Auth: Refresh token to get access_token
async function getAccessToken() {
  try {
    const secret_key = process.env.MPESA_CONSUMER_SECRET;
    const consumer_key = process.env.MPESA_CONSUMER_KEY;

    const auth = new Buffer.from(`${consumer_key}:${secret_key}`).toString(
      "base64"
    );

    const config = {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    };

    await axios
      .get(
        `https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`,
        config
      )
      .then((response) => {
        return response.data.access_token;
      });
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  initiateSTKPush: async (phone, amount) => {
    let user_phone = phone.replace(/^0+/, "");

    const Timestamp = moment().format("YYYYMMDDHHmmss");

    const shortcode = process.env.MPESA_SHORTCODE;

    const passkey = process.env.MPESA_PASS_KEY;

    const password = new Buffer.from(shortcode + passkey + Timestamp).toString(
      "base64"
    );

    let inputs = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp,
      TransactionType: "CustomerBuyGoodsOnline",
      Amount: amount,
      PartyA: `254${user_phone}`,
      PartyB: shortcode,
      PhoneNumber: `254${user_phone}`,
      CallBackURL: "https://api.starlynx.biz",
      AccountReference: "Test",
      TransactionDesc: "Test",
    };

    const accessToken = await getAccessToken();

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    await axios
      .post(
        `https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest`,
        inputs,
        config
      )
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        return err.message;
      });
  },
  test: (req, res) => {
    res.json({
      message: "ok",
    });
  },
};
