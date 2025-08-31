import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import DentistDashboard from "./pages/DentistDashboard";
import ProtectedRoute from "./components/ProtectedRoute"; 
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
