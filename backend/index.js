require("dotenv").config();
const express = require("express");
const connectdb = require("./database/db");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const port = process.env.PORT || 6565;
const cors = require("cors");
const morgan = require("morgan");

// Database connection
connectdb();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Create HTTP server
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  origin: ["http://localhost:5173/", "http://localhost:5174/"]
});


app.set("io", io);


// Also make io available in routes via req.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join_customer', (customerId) => {
    socket.join(`customer_${customerId}`);
    console.log(`Customer ${customerId} joined room customer_${customerId}`);
  });

  socket.on('join_retailer', (retailerId) => {
    socket.join(`retailer_${retailerId}`);
    console.log(`Retailer ${retailerId} joined room retailer_${retailerId}`);
  });

  socket.onAny((event, ...args) => {
    console.log(`Received event ${event} from ${socket.id}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});


app.use("/api/e",require("./router/eProductRoute"));
// Import routes
app.use("/api/employees", require("./router/retailerRoute/employeeRoutes"));
app.use("/api/owners", require("./router/retailerRoute/ownerRoutes"));
app.use("/api/retailers", require("./router/retailerRoute/retailerRoutes"));
app.use("/api/review", require("./router/ReviewRoutes"));
app.use("/api/analytics", require("./router/retailerRoute/analyticsRoutes"));
app.use("/api/products", require("./router/retailerRoute/productRoutes"));
app.use("/api/customers", require("./router/retailerRoute/customerRoutes"));
app.use("/api/broadcasts", require("./router/retailerRoute/broadcastRoutes"));
app.use("/api/delivery", require("./router/retailerRoute/deliveryRoutes"));
app.use("/api", require("./middleware/upload"));



// Health check
app.get("/", (req, res) => {
  res.status(200).json({ status: "API Running", timestamp: new Date() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
