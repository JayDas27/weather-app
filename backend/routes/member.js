const express = require("express");
const mongoose = require("mongoose");
const { validateSignup } = require("../utils/validator");
const { handleDatabaseOperation } = require("../utils/db");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../utils/authenticateToken");

const router = express.Router();

const userSchema = {
  username: String,
  password: String,
  role: String,
  createdBy: String,
};

const User = mongoose.model("User", userSchema);

// Route to handle user login
router.post("/login", async (req, res) => {
  handleDatabaseOperation(async () => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });

    if (user) {
      // Create JWT
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h", // Token expiration time
        }
      );

      res.send({
        message: "Authorized",
        status: 200,
        data: { token, username: user.username, id: user._id },
      });
    } else {
      res.status(401).json({
        message:
          "Access denied. Invalid username or password. Please check and try again.",
      });
    }
  }, res);
});

// Route to handle user registration
router.post("/register", authenticateToken, async (req, res) => {
  handleDatabaseOperation(async () => {
    const { error } = validateSignup(req.body);

    if (error) {
      console.log("Registration Error", error.details);

      // const message = "Failed to create user";
      // res.render("index", { title: "Registration Error", message });

      res.status(400).json(error.details);
    } else {
      const { username, password, role, createdBy } = req.body;

      const existingUser = await User.findOne({ username });
      const creator = await User.findOne({ _id: createdBy });

      if (existingUser || creator.role !== "admin") {
        const message =
          creator.role !== "admin"
            ? "You don't have admin permission to create user."
            : "Duplicate username";
        res.status(200).json({ message, status: 200 });
      } else {
        const newUser = new User({ username, password, role, createdBy });

        try {
          const user = await newUser.save();
          res.json({
            status: 200,
            message: "New user created successfully",
            data: {
              id: user._id,
              username: user.username,
              role: user.role,
              createdBy: user.createdBy,
            },
          });
        } catch (error) {
          res.status(400).json({ message: error.message, status: 400 });
        }
      }
    }
  }, res);
});

module.exports = router;
