const mongoose = require("mongoose");

const connectdb = async () => {
  try {
    await mongoose
      .connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("MongoDB connected successfully"))
      .catch((err) => console.error("MongoDB connection error:", err));
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectdb;
