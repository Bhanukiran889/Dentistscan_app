import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

const ProtectedRoute = ({ children, role }) => {
  const token = Cookies.get("token");
  const userRole = Cookies.get("role");

  //  If no token, go to login
  if (!token) return <Navigate to="/login" />;

  try {
    // Decode token to check expiry
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // in seconds

    if (decoded.exp && decoded.exp < currentTime) {
      // Token expired → clear cookies and redirect
      Cookies.remove("token");
      Cookies.remove("role");
      return <Navigate to="/login" />;
    }
  } catch {
    // If token is invalid / not decodable
    Cookies.remove("token");
    Cookies.remove("role");
    return <Navigate to="/login" />;
  }

  // Check role if passed
  if (role && userRole !== role) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
