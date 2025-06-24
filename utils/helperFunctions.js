const { verify, sign } = require("jsonwebtoken");
const axios = require("axios");

module.exports = {
  errorHandler: (statusCode, message) => {
    const error = new Error();

    error.statusCode = statusCode;
    error.message = message;

    return error;
  },
  generateToken: async (req, res, next) => {
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
          token = response.data.access_token;
          next();
        });
    } catch (error) {
      console.log(error.message);
    }
  },
  verifyToken: (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
      return res.clearCookie("access_token").status(500).json({
        success: 0,
        message: "Internal error. Try again later token has expired",
      });
    } else {
      verify(token, "4_8y$1hDv76", (err, user) => {
        if (err) {
          next(this.errorHandler(403, "Token expired"));
        }
        req.user = user;
        next();
      });
    }
  },
};
