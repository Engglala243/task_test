const Job = require("../models/Job");
const { validateJobData, createPaginationInfo } = require("../utils/helpers");

exports.createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary, skills } = req.body;

    // Only employers can create jobs
    if (req.user.role !== "employer") {
      return res.status(403).json({ error: "Only employers can create jobs" });
    }

    const validation = validateJobData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: validation.errors,
      });
    }

    const newJob = new Job({
      title: title.trim(),
      description: description.trim(),
      company: company.trim(),
      location: location.trim(),
      salary,
      skills: skills || [],
      postedBy: req.user._id,
    });

    await newJob.save();
    await newJob.populate("postedBy", "name email");

    res.status(201).json({
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, location, search } = req.query;

    const pageNum = Math.max(1, Number.parseInt(page));
    const limitNum = Math.min(50, Math.max(1, Number.parseInt(limit))); // Max 50 items per page

    // Build filter object
    const filter = {};
    if (location) {
      filter.location = { $regex: location.trim(), $options: "i" };
    }
    if (search) {
      const searchTerm = search.trim();
      filter.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { company: { $regex: searchTerm, $options: "i" } },
        { skills: { $in: [new RegExp(searchTerm, "i")] } },
      ];
    }

    const jobs = await Job.find(filter)
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await Job.countDocuments(filter);
    const paginationInfo = createPaginationInfo(pageNum, limitNum, total);

    res.status(200).json({
      jobs,
      pagination: paginationInfo,
    });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid job ID format" });
    }

    const job = await Job.findById(id).populate("postedBy", "name email");

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json({ job });
  } catch (error) {
    console.error("Get job by ID error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
