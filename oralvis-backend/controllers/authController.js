const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/userModel");

// Register User
const register = (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Email, password, and role are required" });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: "Error hashing password" });
    }

    createUser(email, hashedPassword, role, (err, userId) => {
      if (err) {
        return res.status(500).json({ error: "User already exists or DB error" });
      }

      // Generate token immediately after registration
      const token = jwt.sign(
        { id: userId, role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        message: "User registered successfully",
        userId,
        token, // 🔑 include token here
      });
    });
  });
};

// Login User
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  findUserByEmail(email, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        message: "Login successful",
        token,
      });
    });
  });
};

module.exports = { register, login };
