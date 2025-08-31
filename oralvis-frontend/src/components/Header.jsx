import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate(role === "Technician" ? "/technician" : "/dentist")}>
        OralVis Healthcare
      </h1>
      {token && (
        <nav className="flex gap-4 items-center">
          {role === "Technician" && (
            <Link
              to="/technician"
              className="hover:bg-blue-500 px-3 py-1 rounded"
            >
              Dashboard
            </Link>
          )}
          {role === "Dentist" && (
            <Link
              to="/dentist"
              className="hover:bg-blue-500 px-3 py-1 rounded"
            >
              Dashboard
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;
