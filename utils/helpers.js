const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // Password should be at least 6 characters long
  return password && password.length >= 6;
};

const validateJobData = (jobData) => {
  const { title, description, company, location, salary } = jobData;
  const errors = [];

  if (!title || title.trim().length < 3) {
    errors.push("Title must be at least 3 characters long");
  }

  if (!description || description.trim().length < 10) {
    errors.push("Description must be at least 10 characters long");
  }

  if (!company || company.trim().length < 2) {
    errors.push("Company name must be at least 2 characters long");
  }

  if (!location || location.trim().length < 2) {
    errors.push("Location must be at least 2 characters long");
  }

  if (!salary || salary < 0) {
    errors.push("Salary must be a positive number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateUserRegistration = (userData) => {
  const { name, email, password, role } = userData;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (!email || !validateEmail(email)) {
    errors.push("Please provide a valid email address");
  }

  if (!validatePassword(password)) {
    errors.push("Password must be at least 6 characters long");
  }

  if (role && !["jobseeker", "employer"].includes(role)) {
    errors.push("Role must be either 'jobseeker' or 'employer'");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const sanitizeUser = (user) => {
  const { password, ...sanitizedUser } = user.toObject();
  return sanitizedUser;
};

const createPaginationInfo = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    currentPage: Number.parseInt(page),
    totalPages,
    total,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateJobData,
  validateUserRegistration,
  sanitizeUser,
  createPaginationInfo,
};
