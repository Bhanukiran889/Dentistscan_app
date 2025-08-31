const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const { authenticate, authorizeRole } = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");
const scanRoutes = require("./routes/scanRoutes");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // optional, for form-data
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/scans", scanRoutes)


// Example protected route (Technician only)
app.get(
  "/technician-test",
  authenticate,
  authorizeRole("Technician"),
  (req, res) => {
    res.json({ message: "Technician route working!", user: req.user });
  }
);

app.get(
  "/dentist-test",
  authenticate,
  authorizeRole("Dentist"),
  (req, res) => {
    res.json({ message: "Dentist route working!", user: req.user });
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
