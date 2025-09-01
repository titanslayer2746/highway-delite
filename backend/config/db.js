const mongoose = require("mongoose");
const User = require("../models/User"); // Import the User model

const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected Successfully");
    // Create the empty User collection
    await User.createCollection();
    console.log("User collection created successfully");
  } catch (err) {
    console.error("MongoDB Connection Failed:", err.message);
    process.exit(1); // Exit the process with failure
  }
};

connectDB();

module.exports = connectDB;
