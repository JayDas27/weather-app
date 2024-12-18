const express = require("express");
const mongoose = require("mongoose");
const { validateCity } = require("../utils/validator");
const { handleDatabaseOperation } = require("../utils/db");
const authenticateToken = require("../utils/authenticateToken");

const router = express.Router();

// Mongoose Schema and Model
const citySchema = {
  cityName: String,
  date: Date,
};

const City = mongoose.model("City", citySchema);

const citiesAggregate = [
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
      cityName: "$_id", // Include the city name
      latestEntry: 1, // Include the latest entry date if necessary
    },
  },
];

// POST route to save searched city
router.post("/saveRecentSearchedCity", authenticateToken, (req, res) => {
  handleDatabaseOperation(async () => {
    const { error } = validateCity(req.body);
    if (error) {
      console.log("Invalid data.", error.details);
      return res.status(400).send(error.details);
    }

    const { cityName } = req.body;
    const city = new City({ cityName, date: new Date() });
    await city.save();
    const cities = await City.aggregate(citiesAggregate);

    return {
      status: 200,
      message: "City saved successfully.",
      data: cities,
    };
  }, res);
});

// GET route to fetch last 10 searched cities
router.get("/getRecentSearchedCity", authenticateToken, (req, res) => {
  handleDatabaseOperation(async () => {
    const cities = await City.aggregate(citiesAggregate);
    return cities;
  }, res);
});

module.exports = router;
