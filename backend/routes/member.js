const express = require("express");
const mongoose = require("mongoose");
const { validateSignup } = require("../utils/validator");
const { connectDB, disconnectDB } = require("../utils/db");

const jwt = require("jsonwebtoken");
const authenticateToken = require("../utils/authenticateToken");

const router = express.Router();

const userSchema = {
  username: String,
  password: String,
  role: String,
};

const User = mongoose.model("User", userSchema);

// Connect to the database when the server starts
connectDB();

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
      password: req.body.password,
    });

    if (user) {
      // Create JWT
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h", // Token expiration time
        }
      );

      console.log("Generated Token:", token);

      res.send({
        message: "Authorized",
        status: 200,
        data: {
          token,
          username: user.username,
          id: user._id,
        },
      });
    } else {
      const message =
        "Access denied. Invalid username or password. Please check and try again.";
      res.send({
        message,
        status: 401,
      });
    }
  } catch (err) {
    res.send({
      message: err.message,
      status: err.status,
    });
  }
  //  finally {
  //   await disconnectDB();
  // }
});

router.post("/register", authenticateToken, async (req, res) => {
  try {
    const { error } = validateSignup(req.body);

    if (error) {
      console.log("Registration Error", error.details);

      // const message = "Failed to create user";
      // res.render("index", { title: "Registration Error", message });

      res.send(error.details);
    } else {
      const existingUser = await User.findOne({
        username: req.body.username,
      });

      const createdBy = await User.findOne({
        _id: req.body.createdBy,
      });

      if (existingUser || createdBy.role !== "admin") {
        const message =
          createdBy.role !== "admin"
            ? "You don't have admin permission to create user."
            : "Duplicate username";

        res.send({
          message,
          status: 200,
        });
      } else {
        const newUser = new User({
          username: req.body.username,
          password: req.body.password,
          role: req.body.role,
        });

        try {
          const user = await newUser.save();
          res.send({
            status: 200,
            message: "New user created successfully",
            data: user,
          });
        } catch (error) {
          res.send({
            message: error.message,
            status: 400,
          });
        }
      }
    }
  } catch (err) {
    res.send({
      message: err.message,
      status: err.status,
    });
  }
  //  finally {
  //   await disconnectDB();
  // }
});

module.exports = router;
