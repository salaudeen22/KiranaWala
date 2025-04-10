require("dotenv").config();
const express = require("express");
const connectdb = require("./database/db");
const app = express();
const port = process.env.PORT || 6565;
const cors = require("cors");
const morgan = require("morgan"); // Request logging
const broadcastRoute = require("./router/retailerRoute/broadcastRoutes");
// Import routes
const employeeRoute = require("./router/retailerRoute/employeeRoutes");

const ownerRoute = require("./router/retailerRoute/ownerRoutes");
const productRoute = require("./router/retailerRoute/productRoutes");
const customerRoute = require("./router/retailerRoute/customerRoutes");

const deliveryRoute = require("./router/retailerRoute/deliveryRoutes");
const uploadRoute = require("./middleware/upload");



// Database connection
connectdb();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes

app.use("/api/employees", employeeRoute);
app.use("/api/owners", ownerRoute);
app.use("/api/retailers", require("./router/retailerRoute/retailerRoutes"));
app.use("/api/analytics", require("./router/retailerRoute/analyticsRoutes"));
app.use("/api/products", productRoute);
app.use("/api/customers", customerRoute);
app.use("/api/broadcasts", broadcastRoute);
app.use("/api/delivery", deliveryRoute);

app.use("/api", uploadRoute);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ status: "API Running", timestamp: new Date() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});