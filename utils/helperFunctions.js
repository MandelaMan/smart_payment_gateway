const { verify, sign } = require("jsonwebtoken");
const axios = require("axios");
const fs = require("fs");

const errorHandler = (statusCode, message) => {
  const error = new Error();

  error.statusCode = statusCode;
  error.message = message;

  return error;
};

const readJsonFromFile = (file_location, cb) => {
  fs.readFile(file_location, "utf-8", (err, jsonString) => {
    if (err) {
      return cb && cb(err);
    }

    try {
      const data = JSON.parse(jsonString);
      return cb && cb(null, data);
    } catch (error) {
      return cb && cb(err);
    }
  });
};

module.exports = {
  errorHandler,
  readJsonFromFile,
};
