const express = require("express");
const mongoose = require("mongoose");
const { validateCity } = require("../utils/validator");
const { connectDB } = require("../utils/db");

const authenticateToken = require("../utils/authenticateToken");

const router = express.Router();

// Mongoose Schema and Model
const citySchema = {
  cityName: String,
  date: Date,
};

const City = mongoose.model("City", citySchema);

// Connect to the database when the server starts
connectDB();

// POST route to save searched city
router.post("/saveRecentSearchedCity", authenticateToken, async (req, res) => {
  try {
    const { error } = validateCity(req.body);

    if (error) {
      console.log("Invalid data.", error.details);
      res.send(error.details);
    } else {
      const { cityName } = req.body;
      const city = new City({ cityName, date: new Date() });
      await city.save();
      res.send({
        status: 200,
        message: "City saved successfully.",
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

// GET route to fetch last 10 searched cities
router.get("/getRecentSearchedCity", authenticateToken, async (req, res) => {
  try {
    const cities = await City.aggregate([
      {
        $group: {
          _id: "$cityName", // Grouping by the city name (or unique identifier)
          latestEntry: { $max: "$date" }, // Getting the latest date for each city
        },
      },
      {
        $sort: {
          latestEntry: -1, // Sort by latest entry in descending order
        },
      },
      {
        $limit: 10, // Limit to the last 10 cities
      },
      {
        $project: {
          _id: 0, // Exclude the _id field from the result
          name: "$_id", // Include the city name
          latestEntry: 1, // Include the latest entry date if necessary
        },
      },
    ]);

    res.json(cities);
  } catch (error) {
    console.error(error);
    res.send({
      message: err.message,
      status: err.status,
    });
  }
});

module.exports = router;
