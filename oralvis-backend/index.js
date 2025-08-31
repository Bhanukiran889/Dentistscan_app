const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const { authenticate, authorizeRole } = require("./middleware/authMiddleware");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// DB
const db = require("./db");

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);


// Example protected route (Technician only)
app.get("/api/secret-tech", authenticate, authorizeRole("Technician"), (req, res) => {
  res.json({ message: "Hello Technician, this is a protected route!" });
});

// Example protected route (Dentist only)
app.get("/api/secret-dentist", authenticate, authorizeRole("Dentist"), (req, res) => {
  res.json({ message: "Hello Dentist, this is a protected route!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
