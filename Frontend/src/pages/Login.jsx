import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email && password) {
      try {
        const res = await axios.post("http://localhost:5000/user/login",{
            email,password,
        });

        const token = res.data.token;
        
        login(token);
        navigate("/roadmap");
      } catch (err){
        console.error("Login failed:", err.response?.data || err.message);
        alert(err.response?.data?.err || "Login failed");
      }
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
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
        <button type="submit">Log In</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
