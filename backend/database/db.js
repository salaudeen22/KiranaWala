const mongoose = require("mongoose");

const connectdb = async () => {
  try {
    await mongoose
      .connect(process.env.DB_URI)
      .then(() => console.log("MongoDB connected successfully"))
      .catch((err) => console.error("MongoDB connection error:", err));
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectdb;
