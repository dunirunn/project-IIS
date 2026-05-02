import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRandomComics = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/comics/random?limit=8");
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Ошибка загрузки комиксов");
          return;
        }

        setComics(data);
      } catch (error) {
        console.error(error);
        setError("Не удалось подключиться к серверу");
      } finally {
        setLoading(false);
      }
    };

    fetchRandomComics();
  }, []);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main>

      <h2>Рекомендуемые</h2>

      {comics.length === 0 ? (
        <p>Пока нет добавленных комиксов</p>
      ) : (
        <div>
          {comics.map((comic) => (
            <div key={comic.id}>
              <Link to={`/comics/${comic.id}`}>
                <img
                  src={comic.imageUrl}
                  alt={comic.title}
                  width="160"
                />
                <h3>{comic.title}</h3>
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Home;