import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const searchComics = async () => {
      if (!query.trim()) {
        setComics([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `http://localhost:5000/api/comics/search?q=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Ошибка поиска");
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

    searchComics();
  }, [query]);

  return (
    <main>
      <h1>Поиск</h1>

      {query ? (
        <p>Результаты по запросу: {query}</p>
      ) : (
        <p>Введите запрос в поиске.</p>
      )}

      {loading && <p>Загрузка...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && query && comics.length === 0 && (
        <p>Ничего не найдено</p>
      )}

      <div>
        {comics.map((comic) => (
          <div key={comic.id}>
            <Link to={`/comics/${comic.id}`}>
              <img src={comic.imageUrl} alt={comic.title} width="160" />
              <h3>{comic.title}</h3>
            </Link>

            <p>Автор: {comic.author}</p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Search;