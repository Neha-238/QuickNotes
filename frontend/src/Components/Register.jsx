import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
      });
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      alert(err.response.data.message || "Registration failed");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-box">
        <h2>Create Account ✨</h2>
        <p className="subtitle">Register to use QuickNotes</p>
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        <p className="link-text">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}
