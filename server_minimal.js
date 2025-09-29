require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Auth API", status: "Server is running", port: PORT });
});

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Test endpoint working" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});