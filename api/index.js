const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
var cors = require("cors");
require("dotenv").config();

//import Routes
const ussdRoutes = require("./routes/ussd.route");
// const zohoRoutes = require("./routes/zoho.route");
const customerRoutes = require("./routes/customer.route");
const mpesaRoutes = require("./routes/mpesa.route");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use("/ussd", ussdRoutes);
// app.use("/zoho", zohoRoutes);
app.use("/customer", customerRoutes);
app.use("/mpesa", mpesaRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello. Welcome to Starlynx API!" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is up and running " + PORT);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
