const express = require("express");
const router = express.Router();
const { authenticate, authorizeRole } = require("../middleware/authMiddleware");
const scanController = require("../controllers/scanController");
const upload = require("../middleware/updoad");

// Technician upload scan (multipart/form-data with file)
router.post(
  "/upload",
  authenticate,
  authorizeRole("Technician"),
  upload.single("scanImage"),
  scanController.uploadScan
);

// Dentist view all scans
router.get(
  "/",
  authenticate,
  authorizeRole("Dentist"),
  scanController.getAllScans
);

module.exports = router;
