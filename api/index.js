const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

// Import routes
const ussdRoutes = require("./routes/ussd.route");
const customerRoutes = require("./routes/customer.route");
const mpesaRoutes = require("./routes/mpesa.route");
const tispRoutes = require("./routes/tisp.route");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Serve static files from Vite React build
app.use(express.static(path.join(__dirname, "../client/dist")));

// API Routes
app.use("/ussd", ussdRoutes);
app.use("/customer", customerRoutes);
app.use("/mpesa", mpesaRoutes);
app.use("/tisp", tispRoutes);

// Catch-all route to serve React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is up and running on port " + PORT);
});
