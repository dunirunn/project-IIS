import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    imageUrl: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/comics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const createdComic = await response.json();

      if (!response.ok) {
        alert(createdComic.message || "Ошибка при добавлении комикса");
        return;
      }

      navigate(`/comics/${createdComic.id}`);
    } catch (error) {
      console.error(error);
      alert("Не удалось подключиться к серверу");
    }
  };
  
  return (
    <>
      <h1>Профиль</h1>

      {user ? (
        <>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </>
      ) : (
        <p>Вы не вошли в аккаунт</p>
      )}


      <h1>Добавить комикс</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Название</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Batman"
          />
        </div>

        <div>
          <label>Автор</label>
          <input
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Frank Miller"
          />
        </div>

        <div>
          <label>Описание</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Описание комикса"
          />
        </div>

        <div>
          <label>Ссылка на картинку</label>
          <input
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <button type="submit">Добавить</button>
      </form>
    </>
  );
};

export default Profile;