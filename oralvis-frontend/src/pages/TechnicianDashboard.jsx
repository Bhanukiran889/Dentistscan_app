import { useState } from "react";
import axios from "axios";

export default function TechnicianDashboard() {
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [scanType, setScanType] = useState("");
  const [region, setRegion] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("Please select a file");

    const formData = new FormData();
    formData.append("patientName", patientName);
    formData.append("patientId", patientId);
    formData.append("scanType", scanType);
    formData.append("region", region);
    formData.append("scanImage", file);

    try {
      const res = await axios.post("http://localhost:5000/api/scans/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Upload successful!");
      setPatientName("");
      setPatientId("");
      setScanType("");
      setRegion("");
      setFile(null);
    } catch (err) {
      setMessage(err.response?.data?.error || "Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Technician Dashboard</h2>
      <form
        onSubmit={handleUpload}
        className="bg-white shadow-lg p-6 rounded-xl max-w-md"
      >
        <input
          type="text"
          placeholder="Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />
        <input
          type="text"
          placeholder="Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />
        <input
          type="text"
          placeholder="Scan Type (X-Ray, CT, etc.)"
          value={scanType}
          onChange={(e) => setScanType(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />
        <input
          type="text"
          placeholder="Region (Upper Jaw, etc.)"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full border p-2 mb-3 rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Upload Scan
        </button>
        {message && <p className="mt-3 text-sm">{message}</p>}
      </form>
    </div>
  );
}
