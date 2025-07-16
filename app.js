const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require("dotenv");

const app = express();
dotenv.config();

// Import routes
const UserRoutes = require("./routes/userRoutes");

// Environment variables
const PORT = process.env.PORT || 5000;
const DB = process.env.MONGODB_URI;

// CORS middleware
app.use(cors({
  origin: ['http://localhost:5173',process.env.FRONTEND_URL],
  credentials: true
}));

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Database connected");
})
.catch((error) => {
  console.error("Database connection failed:", error.message);
});

// Routes
app.use("/api", UserRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running ✅" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;