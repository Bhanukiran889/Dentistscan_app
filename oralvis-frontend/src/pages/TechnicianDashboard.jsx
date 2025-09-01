import { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Cookies from "js-cookie";

export default function TechnicianDashboard() {
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [scanType, setScanType] = useState("");
  const [region, setRegion] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("Please select a file");

    setLoading(true);
    setMessage("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("patientName", patientName);
    formData.append("patientId", patientId);
    formData.append("scanType", scanType);
    formData.append("region", region);
    formData.append("scanImage", file);

    try {
      await axios.post("https://dentistscan-app.onrender.com/api/scans/upload", formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Upload successful!");
      setSuccess(true);
      setPatientName("");
      setPatientId("");
      setScanType("");
      setRegion("");
      setFile(null);
    } catch (err) {
      setMessage(err.response?.data?.error || "Upload failed");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-800">
          Technician Dashboard
        </h2>

        <form
          onSubmit={handleUpload}
          className="bg-white shadow-2xl p-8 rounded-2xl w-full max-w-lg space-y-4 animate-fadeIn"
        >
          <input
            type="text"
            placeholder="Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full border border-gray-300 p-3 mb-4 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full border border-gray-300 p-3 mb-4 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Scan Type (X-Ray, CT, etc.)"
            value={scanType}
            onChange={(e) => setScanType(e.target.value)}
            className="w-full border border-gray-300 p-3 mb-4 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Region (Upper Jaw, etc.)"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full border border-gray-300 p-3 mb-4 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          {/* File Upload with Drag & Drop */}
          <div
            className={`w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition
    ${
      file
        ? "border-indigo-500 bg-indigo-50"
        : "border-gray-300 bg-gray-50 hover:bg-gray-100"
    }`}
            onDragOver={(e) => e.preventDefault()} // prevent browser default
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setFile(e.dataTransfer.files[0]);
              }
            }}
          >
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
            >
              {file ? (
                <p className="text-sm text-gray-700 font-medium">
                  Selected File:{" "}
                  <span className="text-indigo-600">{file.name}</span>
                </p>
              ) : (
                <>
                  <svg
                    className="w-10 h-10 text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5.992 5.992 0 0112 4c2.21 0 4.2 1.195 5.312 2.977A4 4 0 1119 16H7z"
                    />
                  </svg>
                  <p className="text-gray-600 text-sm">
                    <span className="font-semibold text-indigo-600">
                      Click to upload
                    </span>{" "}
                    or drag & drop
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, JPEG (max 10MB)
                  </p>
                </>
              )}
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-400 transition ${
              loading ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            )}
            {loading ? "Uploading..." : "Upload Scan"}
          </button>

          {message && (
            <p
              className={`mt-2 text-center font-medium ${
                success ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </>
  );
}
