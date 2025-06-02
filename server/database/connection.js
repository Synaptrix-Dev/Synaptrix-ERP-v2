// db.js
const mongoose = require('mongoose');
let isConnected = false;

const connectToDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log("✨ Connected to Synaptrix Database");
    return conn;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
};

module.exports = connectToDB;
