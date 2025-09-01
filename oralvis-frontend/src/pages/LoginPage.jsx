import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://dentistscan-app.onrender.com/api/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      const role = res.data.role;
      Cookies.set("token", token, { expires: 1 });
      Cookies.set("role", role, { expires: 1 });

      if (role === "Technician") navigate("/technician");
      else navigate("/dentist");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
          className="w-full bg-indigo-600 text-white font-medium py-3 rounded-lg hover:bg-indigo-700 transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
}
