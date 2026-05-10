import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Content.css";

const Content = () => {
  const { id } = useParams();
  const [comic, setComic]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    const fetchComic = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/comics/${id}`);
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || "Comic not found");
          return;
        }
        setComic(data);
      } catch (err) {
        console.error(err);
        setError("Could not connect to server");
      } finally {
        setLoading(false);
      }
    };
    fetchComic();
  }, [id]);

  if (loading) return <p className="content-loading">Loading</p>;
  if (error)   return <p className="content-error">{error}</p>;
  if (!comic)  return <p className="content-missing">Comic not found</p>;

  return (
    <div className="content-page">

      {/* ── Hero strip ──────────────────────────────────────── */}
      <div className="content-hero">

        <div className="content-hero-text">
          {comic.publisher && (
            <div className="content-publisher-badge">{comic.publisher}</div>
          )}
          <h1 className="content-title">{comic.title}</h1>
          {comic.author && (
            <div className="content-meta-row">
              <div className="content-author-chip">
                <span>By</span> {comic.author}
              </div>
            </div>
          )}
        </div>

        <div className="content-cover-wrap">
          <img
            className="content-cover"
            src={comic.imageUrl}
            alt={comic.title}
          />
        </div>
      </div>

      {/* wavy divider */}
      <svg className="content-wave" viewBox="0 0 1440 40"
        preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 0 C240 40 480 40 720 20 C960 0 1200 0 1440 20 L1440 40 L0 40 Z"
          fill="#fdf6e3"
        />
      </svg>

      {/* ── Description ─────────────────────────────────────── */}
      {comic.description && (
        <div className="content-body">
          <div className="content-desc-header">
            <div className="content-desc-badge">Synopsis</div>
            <div className="content-desc-rule" />
          </div>
          <div className="content-desc-bubble">
            {comic.description}
          </div>
        </div>
      )}

    </div>
  );
};

export default Content;