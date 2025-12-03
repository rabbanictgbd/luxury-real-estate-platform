import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await login(email, password);
      navigate("/dashboard"); // Redirect after login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-base-100 shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4 text-red-600">
        Login 🩸
      </h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input name="email" type="email" placeholder="Email" className="input input-bordered w-full" required />
        <input name="password" type="password" placeholder="Password" className="input input-bordered w-full" required />
        
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" className="btn btn-error w-full text-white">
          Login
        </button>
      </form>

      <p className="text-center mt-4">
        Don’t have an account?{" "}
        <Link to="/register" className="text-red-500 font-semibold">
          Register
        </Link>
      </p>
    </div>
  );
}
