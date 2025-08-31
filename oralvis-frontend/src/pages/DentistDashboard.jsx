import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import Header from "../components/Header";
import Cookies from "js-cookie";

const DentistDashboard = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = Cookies.get("token");

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/scans", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setScans(response.data); // ← response is an array
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch scans");
        setLoading(false);
      }
    };

    fetchScans();
  }, [token]);

  const downloadPDF = (scan) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Patient Scan Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Patient Name: ${scan.patientName}`, 20, 40);
    doc.text(`Patient ID: ${scan.patientId}`, 20, 50);
    doc.text(`Scan Type: ${scan.scanType}`, 20, 60);
    doc.text(`Region: ${scan.region}`, 20, 70);
    doc.text(
      `Upload Date: ${
        scan.uploadDate ? new Date(scan.uploadDate).toLocaleString() : "N/A"
      }`,
      20,
      80
    );

    const img = new Image();
    img.src = scan.imageUrl;
    img.crossOrigin = "anonymous"; // helps with CORS for jsPDF
    img.onload = function () {
      doc.addImage(img, "JPEG", 20, 90, 150, 100);
      doc.save(`${scan.patientName}_scan.pdf`);
    };
  };

  if (loading) return <div className="text-center mt-10">Loading scans...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (scans.length === 0)
    return <div className="text-center mt-10">No scans available yet.</div>;

  return (
    <>
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dentist Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scans.map((scan) => (
            <div
              key={scan.id}
              className="border rounded-lg shadow p-4 flex flex-col justify-between"
            >
              <img
                src={scan.imageUrl}
                alt={scan.patientName}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <div className="mb-2">
                <p>
                  <strong>Name:</strong> {scan.patientName}
                </p>
                <p>
                  <strong>ID:</strong> {scan.patientId}
                </p>
                <p>
                  <strong>Type:</strong> {scan.scanType}
                </p>
                <p>
                  <strong>Region:</strong> {scan.region}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {scan.uploadDate
                    ? new Date(scan.uploadDate).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                <a
                  href={scan.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  View Full Image
                </a>
                <button
                  onClick={() => downloadPDF(scan)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Download Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DentistDashboard;
