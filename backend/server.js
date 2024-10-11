const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const CustomError = require("./utils/customError");
const globalErrorHandler = require("./errorController");
const memberRouter = require("./routes/member");
const searchRouter = require("./routes/search");

// Express app
const app = express();

// Middlewares
app.use(cors({ origin: "http://localhost:3000" })); // CORS setup
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

// Logger middleware
app.use((req, res, next) => {
  // console.log(req.originalUrl);
  next();
});

// Register view engine
app.set("view engine", "ejs");

// Register routes
app.use("/member", memberRouter);
app.use("/city", searchRouter);

// Handle all undefined routes
app.all("*", (req, res, next) => {
  next(new CustomError(`Can't find ${req.originalUrl} on the server!`, 404));
});

// Error handler middleware
app.use(globalErrorHandler);

// Start the server
const PORT = process.env.PORT || 3200; // Enhanced flexibility for port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
