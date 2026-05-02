import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Content = () => {
  const { id } = useParams();

  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComic = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/comics/${id}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Комикс не найден");
          return;
        }

        setComic(data);
      } catch (error) {
        console.error(error);
        setError("Не удалось подключиться к серверу");
      } finally {
        setLoading(false);
      }
    };

    fetchComic();
  }, [id]);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!comic) {
    return <p>Комикс не найден</p>;
  }

  return (
    <>
      <h1>{comic.title}</h1>

      <img
        src={comic.imageUrl}
        alt={comic.title}
        style={{
          width: "240px",
          borderRadius: "12px"
        }}
      />

      <h3>Автор: {comic.author}</h3>

      <p>{comic.description}</p>
    </>
  );
};

export default Content;