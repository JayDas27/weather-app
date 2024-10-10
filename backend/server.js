const cors = require("cors");
const express = require("express");
require("dotenv").config();

const CustomError = require("./utils/customError");
const globalErrorHandler = require("./errorController");

// Express app
const app = express();

// Allow requests from "http://localhost:3000"
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Register view engine
app.set("view engine", "ejs");

//
app.use(logger);

// Get access to "body" in response
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(express.json()); // To parse JSON bodies

const memberRouter = require("./routes/member");
app.use("/member", memberRouter);

const searchRouter = require("./routes/search");
app.use("/city", searchRouter);

// Logger middleware
function logger(req, res, next) {
  // console.log(req.originalUrl);
  next();
}

// Showing error if the request URL is not correct
app.all("*", (req, res, next) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server!`,
    404
  );

  next(err);
});

// Error handler middleware
app.use(globalErrorHandler);

// Start the server
const PORT = 3200;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
