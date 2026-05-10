import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

/* ── Static "Timeless Best-Sellers" — comics 1–8 ─────────── */
const STATIC_COMICS = [
  { id: 1, title: "Batman (1940-2011) #9",          publisher: "Detective Comics"  },
  { id: 2, title: "Amazing Fantasy #15",      publisher: "Marvel Comics"     },
  { id: 3, title: "New Teen Titans #1-40",    publisher: "Detective Comics"  },
  { id: 4, title: "Fantastic Four #232-293",  publisher: "Marvel Comics"     },
  { id: 5, title: "Superman Annual",          publisher: "Detective Comics"  },
  { id: 6, title: "X-Men #9 (1st Series)",   publisher: "Marvel Comics"     },
  { id: 7, title: "Flash (V2) #80",           publisher: "Detective Comics"  },
  { id: 8, title: "Supergirl Mini-Series #1", publisher: "Detective Comics"  },
];

/* ── Comic card ───────────────────────────────────────────── */
const ComicCard = ({ id, title, publisher, imageUrl }) => (
  <Link to={`/comics/${id}`} className="comic-card">
    <img
      className="comic-card-img"
      src={imageUrl}
      alt={title}
      loading="lazy"
    />
    <div className="comic-card-body">
      <p className="comic-card-title">{title}</p>
      <p className="comic-card-publisher">{publisher}</p>
    </div>
  </Link>
);

/* ── Home page ────────────────────────────────────────────── */
const Home = () => {
  const [randomComics, setRandomComics] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");

  useEffect(() => {
    const fetchRandom = async () => {
      try {
        const res  = await fetch("http://localhost:5000/api/comics/random?limit=8");
        const data = await res.json();
        if (!res.ok) { setError(data.message || "Failed to load"); return; }
        setRandomComics(data);
      } catch (err) {
        console.error(err);
        setError("Could not connect to server");
      } finally {
        setLoading(false);
      }
    };
    fetchRandom();
  }, []);

  /* hero = first static comic */
  const hero = STATIC_COMICS[0];

  return (
    <div className="home-page">

      {/* ── HERO BANNER ─────────────────────────────────────── */}
      <section className="hero-banner">
        <img src="/homebg.png" alt="" className="hero-bg" aria-hidden="true" />
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-label">Comics of the Day:</span>
            <h1 className="hero-title">{hero.title}</h1>
            <div className="hero-stars" aria-hidden="true">★ ★ ★</div>
            <Link to={`/comics/${hero.id}`} className="hero-btn">Read Now</Link>
          </div>

          <div className="hero-cover-wrap">
            <img
              src={`/comic${hero.id}.png`}
              alt={hero.title}
              className="hero-cover"
            />
          </div>
        </div>

        {/* wavy bottom edge */}
        <svg className="hero-wave" viewBox="0 0 1440 54" preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 0 C180 54 360 54 540 27 C720 0 900 0 1080 27 C1260 54 1350 54 1440 27 L1440 54 L0 54 Z"
            fill="#fdf6e3"
          />
        </svg>
      </section>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <main className="home-main">

        {/* Timeless Best-Sellers */}
        <div className="section-badge">Timeless Best-Sellers</div>

        <div className="comics-grid">
          {STATIC_COMICS.map(({ id, title, publisher }) => (
            <ComicCard
              key={id}
              id={id}
              title={title}
              publisher={publisher}
              imageUrl={`/comic${id}.png`}
            />
          ))}
        </div>

        {/* Random comics from backend */}
        {!loading && !error && randomComics.length > 0 && (
          <>
            <div className="section-divider">
              <span className="section-badge" style={{ margin: 0 }}>More To Explore</span>
            </div>
            <div className="comics-grid">
              {randomComics.map((comic) => (
                <ComicCard
                  key={comic.id}
                  id={comic.id}
                  title={comic.title}
                  publisher={comic.publisher || "Unknown"}
                  imageUrl={comic.imageUrl}
                />
              ))}
            </div>
          </>
        )}

        {loading && <p className="home-loading">Loading</p>}
        {error   && <p className="home-error">{error}</p>}

      </main>
    </div>
  );
};

export default Home;