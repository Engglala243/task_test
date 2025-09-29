require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  console.log("Root route accessed");
  res.json({ message: "Welcome to the Auth API", status: "Server is running" });
});

// Test routes - both GET and POST
app.get("/test", (req, res) => {
  console.log("GET /test accessed");
  res.json({ message: "GET test endpoint working", method: "GET" });
});

app.post("/test", (req, res) => {
  console.log("POST /test accessed", req.body);
  res.json({ message: "POST test endpoint working", method: "POST", data: req.body });
});

// Connect to MongoDB first
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    // Load routes after DB connection
    app.use("/api/auth", require("./routes/authRoutes"));
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
