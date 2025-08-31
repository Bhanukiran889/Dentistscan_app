import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import DentistDashboard from "./pages/DentistDashboard";

// role-based protected route
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/login" />;
  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/technician"
          element={
            <ProtectedRoute role="Technician">
              <TechnicianDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dentist"
          element={
            <ProtectedRoute role="Dentist">
              <DentistDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
