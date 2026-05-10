import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Ошибка входа");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("Не удалось подключиться к серверу");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* ── Top bar ─────────────────────────────────────── */}
        <div className="auth-card-top">
          <img src="/logo.png" alt="Logo" className="auth-logo-icon" />
          <h1 className="auth-title">Sign In</h1>
        </div>

        {/* ── Form ────────────────────────────────────────── */}
        <div className="auth-body">
          {error && <p className="auth-error">{error}</p>}

          <div className="auth-field">
            <label className="auth-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              className="auth-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="test@mail.com"
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="auth-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <NavLink to={ROUTES.REGISTER} className="auth-switch">
            No account? Register here →
          </NavLink>

          <div className="auth-divider" />

          <button className="auth-submit" onClick={handleSubmit}>
            Log In
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;