const scanModel = require("../models/scanModel");

const cloudinary = require("../config/cloudinary");

// Technician: Upload new scan
const uploadScan = async (req, res) => {
  try {
    const { patientName, patientId, scanType, region } = req.body;

    if (!patientName || !patientId || !scanType || !region || !req.file) {
      return res.status(400).json({ error: "All fields and image are required" });
    }

    // Upload file buffer to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: "oralvis_scans" },
      async (error, uploadResult) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ error: "Image upload failed" });
        }

        const newScan = await scanModel.createScan({
          patientName,
          patientId,
          scanType,
          region,
          imageUrl: uploadResult.secure_url,
        });

        res.status(201).json({ message: "Scan uploaded successfully", scan: newScan });
      }
    );

    // Write file buffer into Cloudinary stream
    result.end(req.file.buffer);
  } catch (err) {
    console.error("Upload scan error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Dentist: View all scans
const getAllScans = async (req, res) => {
  try {
    const scans = await scanModel.getAllScans();
    res.json(scans);
  } catch (err) {
    console.error("Get scans error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { uploadScan, getAllScans };
