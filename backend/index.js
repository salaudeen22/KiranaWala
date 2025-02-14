require("dotenv").config();
const express = require("express");
const connectdb = require("./database/db");
const app = express();
const port = process.env.PORT || 6565;
const venAuthRoute = require("./router/retailerRoute/auth");
const productRoute=require("./router/retailerRoute/productRoute")

connectdb();

app.use(express.json());

app.use("/api/vendor/auth", venAuthRoute);
app.use("/api/vendor/products",productRoute);

app.listen(port, () => {
  console.log(`listening to the ${port}`);
});
