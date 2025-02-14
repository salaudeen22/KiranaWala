require("dotenv").config();
const express = require("express");
const connectdb = require("./database/db");
const app = express();
const port = process.env.PORT || 6565;
const venAuthRoute = require("./router/retailerRoute/auth");

connectdb();

app.use(express.json());

app.use("/api/vendors/auth", venAuthRoute);

app.listen(port, () => {
  console.log(`listening to the ${port}`);
});
