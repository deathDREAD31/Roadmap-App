import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./Signup.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email && password) {
      try {
        const response = await axios.post("http://localhost:5000/user/signup", {
          email,
          password,
        });

        alert(response.data.message);
        navigate("/");
      } catch (error) {
        console.error("Signup failed:", error.response?.data || error.message);
        alert(error.response?.data?.error || "Signup failed");
      }
    }
  };

  return (
    <div className="signup-page">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </label>
        <button type="submit">Create Account</button>
      </form>
      <p>
        Already have an account? <Link to="/">Log in</Link>
      </p>
    </div>
  );
}
