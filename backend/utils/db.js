const mongoose = require("mongoose");

// Connection to mongoDB URI
const uri = process.env.DATABASE_URL;

// Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    await mongoose
      .connect(uri)
      .then(() => {
        console.log("Connected to MongoDB successfully!");
      })
      .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1);
      });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};

// Function to disconnect from the database
const disconnectDB = async () => {
  await mongoose.connection.close();
  console.log("MongoDB disconnected");
};

module.exports = { connectDB, disconnectDB };
