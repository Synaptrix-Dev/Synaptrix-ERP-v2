const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });

const URI = process.env.DATABASE;

const connectToDB = async () => {
  // Check if there's an existing connection
  if (mongoose.connection.readyState >= 1) {
    console.log("✨ Reusing existing MongoDB connection ✨");
    return mongoose.connection;
  }

  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      maxPoolSize: 10, // Limit connection pool size
      minPoolSize: 2, // Minimum connections to keep open
    });
    console.log(
      "✨ ================== Connected to Synaptrix Database ================== ✨"
    );
  } catch (err) {
    console.error("Error Connecting to Database!", err);
    throw err;
  }
};

module.exports = connectToDB;
