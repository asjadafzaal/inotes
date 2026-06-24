require("dotenv").config(); // ✅ Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const authRoutes = require("./routes/auth"); // Authentication routes
const notesRoutes = require("./routes/notes"); // Notes routes

// ✅ Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for frontend communication

// ✅ MongoDB Atlas Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not set in .env file!");
  process.exit(1); // Stop server if MongoDB URI is missing
}

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB Atlas connection error:", err.message || err);
    const setupMockDb = require("./middleware/mockDb");
    setupMockDb();
  });

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the Notes App!");
});

// ✅ Start Server locally
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ Export the app for Vercel
module.exports = app;
