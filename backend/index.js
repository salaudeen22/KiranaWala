require("dotenv").config();
const express = require("express");
const connectdb = require("./database/db");
const app = express();
const port = process.env.PORT || 6565;
var cors = require("cors");
const venAuthRoute = require("./router/retailerRoute/auth");
const productRoute = require("./router/retailerRoute/productRoute");
const UploadImage = require("./middleware/upload");
const employeeRoute = require("./router/retailerRoute/employeeRoutes");
// const orderRoutes = require("./router/retailerRoute/orderRoutes");
// const inventoryRoute = require("./router/retailerRoute/inventoryRoutes.js");
// const analyticsRoute = require("./router/retailerRoute/analyticsRoutes");

connectdb();

app.use(express.json());
app.use(cors());

app.use("/api/vendor/auth", venAuthRoute);


// app.use("/api/inventory", inventoryRoute);



app.use("/api", UploadImage);
app.use("/api/vendor/products", productRoute);

app.use("/api/employees", employeeRoute);

app.listen(port, () => {
  console.log(`listening to the ${port}`);
});
