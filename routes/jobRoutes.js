const express = require("express");
const { protect, authorization } = require("../middleware/auth");
const {
  createJob,
  getAllJobs,
  getJobById,
} = require("../controllers/jobController");

const router = express.Router();

// Create job (Protected - Employer only)
router.post("/", protect, createJob);

// Get all jobs with filtering (Public)
router.get("/", getAllJobs);

// Get single job details (Public)
router.get("/:id", getJobById);

module.exports = router;
