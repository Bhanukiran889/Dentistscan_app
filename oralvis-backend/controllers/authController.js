const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/userModel");

// 🔐 Register User
const register = (req, res) => {
  const { email, password, role } = req.body;

  // Basic validation
  if (!email || !password || !role) {
    return res.status(400).json({ error: "Email, password, and role are required" });
  }

  // Hash password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: "Error hashing password" });
    }

    // Save user in DB
    createUser(email, hashedPassword, role, (err, userId) => {
      if (err) {
        return res.status(500).json({ error: "User already exists or DB error" });
      }
      res.json({
        message: "User registered successfully",
        userId, // this is a UUID
      });
    });
  });
};

// 🔑 Login User
const login = (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Find user
  findUserByEmail(email, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, role: user.role }, // id is UUID now
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ message: "Login successful", token });
    });
  });
};

module.exports = { register, login };
