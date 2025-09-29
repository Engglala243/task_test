const express = require("express");
const { protect, authorization } = require("../middleware/auth");

const router = express.Router();

// Public route - no authentication required
router.get("/public", (req, res) => {
  res.json({ message: "This is a public job endpoint" });
});

// Protected route - requires authentication
router.get("/protected", protect, (req, res) => {
  res.json({ 
    message: "This is a protected job endpoint",
    user: req.user 
  });
});

// Admin only route - requires admin role
router.get("/admin", protect, authorization("admin"), (req, res) => {
  res.json({ 
    message: "This is an admin-only endpoint",
    user: req.user 
  });
});

module.exports = router;