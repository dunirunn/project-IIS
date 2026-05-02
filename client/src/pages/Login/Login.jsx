import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Ошибка входа");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/profile");
    } catch (error) {
      console.error(error);
      setError("Не удалось подключиться к серверу");
    }
  };

  return (
    <main>
      <h1>Вход</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="test@mail.com"
          />
        </div>

        <div>
          <label>Пароль</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Введите пароль"
          />
        </div>
        <NavLink to={ROUTES.REGISTER}>Нет аккаунта? Зарегистрируйтесь</NavLink>
        <button type="submit">Войти</button>
      </form>
    </main>
  );
};

export default Login;