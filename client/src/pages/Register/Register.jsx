import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Ошибка регистрации");
        return;
      }
      navigate("/login");
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
          <h1 className="auth-title">Join the Crew</h1>
        </div>

        {/* ── Form ────────────────────────────────────────── */}
        <div className="auth-body">
          {error && <p className="auth-error">{error}</p>}

          <div className="auth-field">
            <label className="auth-label" htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              className="auth-input"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Semyon"
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
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
            <label className="auth-label" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              className="auth-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <NavLink to={ROUTES.LOGIN} className="auth-switch">
            Already have an account? Sign in →
          </NavLink>

          <div className="auth-divider" />

          <button className="auth-submit" onClick={handleSubmit}>
            Register
          </button>
        </div>

      </div>
    </div>
  );
};

export default Register;