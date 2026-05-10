import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./Search.css";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [comics, setComics]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    const searchComics = async () => {
      if (!query.trim()) { setComics([]); return; }
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `http://localhost:5000/api/comics/search?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        if (!response.ok) { setError(data.message || "Search error"); return; }
        setComics(data);
      } catch (err) {
        console.error(err);
        setError("Could not connect to server");
      } finally {
        setLoading(false);
      }
    };
    searchComics();
  }, [query]);

  return (
    <div className="search-page">

      {/* ── Header band ───────────────────────────────────── */}
      <div className="search-header-band">
        <h1 className="search-page-title">Search</h1>
        {query && (
          <span className="search-query-tag">"{query}"</span>
        )}
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="search-main">

        {/* empty query hint */}
        {!query && (
          <p className="search-status">Type something in the search bar above.</p>
        )}

        {/* loading */}
        {loading && <p className="search-loading">Searching</p>}

        {/* error */}
        {error && <p className="search-error">{error}</p>}

        {/* no results */}
        {!loading && !error && query && comics.length === 0 && (
          <p className="search-empty">Nothing found</p>
        )}

        {/* results */}
        {!loading && !error && comics.length > 0 && (
          <>
            <div className="search-count-badge">
              {comics.length} result{comics.length !== 1 ? "s" : ""} found
            </div>

            <div className="search-grid">
              {comics.map((comic) => (
                <Link
                  key={comic.id}
                  to={`/comics/${comic.id}`}
                  className="search-card"
                >
                  <img
                    className="search-card-img"
                    src={comic.imageUrl}
                    alt={comic.title}
                    loading="lazy"
                  />
                  <div className="search-card-body">
                    <p className="search-card-title">{comic.title}</p>
                    {comic.author && (
                      <p className="search-card-author">{comic.author}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Search;