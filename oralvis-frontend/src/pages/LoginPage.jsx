import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "https://dentistscan-app.onrender.com/api/auth/login",
        { email, password }
      );

      const token = res.data.token;
      const role = res.data.role;

      Cookies.set("token", token, { expires: 1 });
      Cookies.set("role", role, { expires: 1 });

      if (role === "Technician") navigate("/technician");
      else navigate("/dentist");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-96 border border-gray-100"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
          Login
        </h2>
        {error && (
          <p className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4 text-center border border-red-200">
            {error}
          </p>
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 p-3 mb-4 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-3 mb-6 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-500 transition ${
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
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="mt-4 text-sm text-gray-600">
          <p className="mb-1">
            Note: Server may take 30–60 seconds to respond on first request
            (cold start).
          </p>
          <p className="font-medium">Test Credentials:</p>
          <ul className="list-disc list-inside">
            <li>
              <span className="font-semibold">Technician:</span>{" "}
              tech@exm.com / <span>password:</span>123
            </li>
            <li>
              <span className="font-semibold">Dentist:</span>{" "}
              dentist@exm.com / <span>password:</span>123
            </li>
          </ul>
        </div>
      </form>
    </div>
  );
}
