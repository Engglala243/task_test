require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Job Portal API",
    status: "Server is running",
  });
});

// Connect to MongoDB first
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.use("/api/auth", require("./routes/authRoutes"));
    app.use("/api/jobs", require("./routes/jobRoutes"));
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
