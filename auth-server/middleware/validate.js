
// Validation middleware
module.exports = {
  validateRegister: (req, res, next) => {
    const { firstName, lastName, email, password, course } = req.body;
    const errors = [];

    if (!firstName || firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters');
    }

    if (!lastName || lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters');
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Please enter a valid email address');
    }

    if (!password || password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    if (!course) {
      errors.push('Please select a course');
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    next();
  },
  
  validateLogin: (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Please enter a valid email address');
    }

    if (!password) {
      errors.push('Password is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    next();
  }
};
