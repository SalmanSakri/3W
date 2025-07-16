const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require("dotenv")
const app = express();
const UserRoutes = require("./routes/userRoutes")

// .env file load
dotenv.config()
const PORT = process.env.PORT || 5000;
const DB = process.env.MONGODB_URI

// Middleware
app.use(cors({
 origin: ['http://localhost:5173/', 'https://3w-frontend-code.netlify.app/'], // frontend domain
  credentials: true
}));

app.use(express.json());
app.use(express.json());

// MongoDB connection
mongoose.connect(DB)
  .then(() => { console.log(`Data base connected`) })
  .catch((error) => { `Data-base is not connected: error ${error}  ` })

// Routes
app.use("/api", UserRoutes);

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
