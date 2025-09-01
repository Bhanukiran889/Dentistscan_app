import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import Header from "../components/Header";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const DentistDashboard = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  const token = Cookies.get("token");

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/scans", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setScans(response.data);
        setLoading(false);

        if (response.status === 403) { 
          Cookies.remove("token");
          Cookies.remove("role");
          navigate("/login");
        }
      } catch (err) {
        if (err.response?.status === 403) {
          Cookies.remove("token");
          Cookies.remove("role");
          navigate("/login");
        } else {
          setError(err.response?.data?.error || "Failed to fetch scans");
        }
        setLoading(false);
      }
    };

    fetchScans();
  }, [token, navigate]);

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
    img.crossOrigin = "anonymous";
    img.onload = function () {
      doc.addImage(img, "JPEG", 20, 90, 150, 100);
      doc.save(`${scan.patientName}_scan.pdf`);
    };
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-gray-600 text-lg font-medium">
        Loading scans...
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-20 text-red-500 font-semibold">{error}</div>
    );

  if (scans.length === 0)
    return (
      <div className="text-center mt-20 text-gray-600 font-medium">
        No scans available yet.
      </div>
    );

  return (
    <>
      <Header />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
          Dentist Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scans.map((scan) => (
            <div
              key={scan.id}
              className="bg-white border border-gray-200 rounded-2xl shadow-lg p-5 flex flex-col justify-between transition transform hover:scale-105"
            >
              <img
                src={scan.imageUrl}
                alt={scan.patientName}
                className="w-full h-52 object-cover rounded-xl mb-4 shadow-sm"
              />
              <div className="mb-3 text-gray-700 space-y-1">
                <p><strong>Name:</strong> {scan.patientName}</p>
                <p><strong>ID:</strong> {scan.patientId}</p>
                <p><strong>Type:</strong> {scan.scanType}</p>
                <p><strong>Region:</strong> {scan.region}</p>
                <p><strong>Date:</strong>{" "}
                  {scan.uploadDate
                    ? new Date(scan.uploadDate).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div className="flex gap-3 mt-3">
                <a
                  href={scan.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  View Full Image
                </a>
                <button
                  onClick={() => downloadPDF(scan)}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
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
