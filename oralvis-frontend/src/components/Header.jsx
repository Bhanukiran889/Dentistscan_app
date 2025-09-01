import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Header = () => {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const role = Cookies.get("role");

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 shadow-md flex justify-between items-center">
      <h1
        className="text-2xl font-bold cursor-pointer tracking-wide hover:opacity-90 transition"
        onClick={() =>
          navigate(role === "Technician" ? "/technician" : "/dentist")
        }
      >
        OralVis Healthcare
      </h1>

      {token && (
        <nav className="flex gap-4 items-center">
          {role === "Technician" && (
            <Link
              to="/technician"
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm font-medium"
            >
              Dashboard
            </Link>
          )}
          {role === "Dentist" && (
            <Link
              to="/dentist"
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm font-medium"
            >
              Dashboard
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition text-sm font-medium cursor-pointer"
          >
            Logout
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;
