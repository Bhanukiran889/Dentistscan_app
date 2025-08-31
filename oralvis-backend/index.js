const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./db")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {authenticateToken, authorizeRole} = require("./auth");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"))

const PORT = process.env.PORT || 5000;

// Register user (Technician or Dentist)
app.post("/register", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
    [email, hashedPassword, role],
    function (err) {
      if (err) {
        return res.status(400).json({ message: "User already exists" });
      }
      res.json({ id: this.lastID, email, role });
    }
  );
});

// Login user
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role });
  });
});

app.get("/", (req, res) => {
  res.send("OralVis Healthcare Backend is running...");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});