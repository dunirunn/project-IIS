import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";

const FILTERS = [
  { key: "all",       label: "All"       },
  { key: "read",      label: "Read"      },
  { key: "in_plans",  label: "In Plans"  },
  { key: "favourite", label: "Favourite" },
];

/* ── Profile page ─────────────────────────────────────────── */
const Profile = () => {
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem("user") || "null");

  /* view: "list" | "add" */
  const [view, setView] = useState("list");

  /* comic list state */
  const [comics,  setComics]  = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [filter,  setFilter]  = useState("all");
  const [sortAsc, setSortAsc] = useState(false);

  /* add-comic form state */
  const [formData, setFormData] = useState({
    title: "", author: "", description: "", imageUrl: "",
  });

  /* ── fetch user's comics ─────────────────────────────────── */
  useEffect(() => {
    if (!user) { setListLoading(false); return; }
    const fetchUserComics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res   = await fetch("http://localhost:5000/api/comics/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data  = await res.json();
        if (res.ok) setComics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setListLoading(false);
      }
    };
    fetchUserComics();
  }, []);

  /* ── counts per filter ───────────────────────────────────── */
  const counts = {
    all:       comics.length,
    read:      comics.filter(c => c.status === "read").length,
    in_plans:  comics.filter(c => c.status === "in_plans").length,
    favourite: comics.filter(c => c.status === "favourite").length,
  };

  /* ── filtered + sorted list ──────────────────────────────── */
  const displayed = comics
    .filter(c => filter === "all" || c.status === filter)
    .slice()
    .sort((a, b) =>
      sortAsc
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );

  /* ── add comic submit ────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token    = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/comics", {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          Authorization:   `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const created = await response.json();
      if (!response.ok) {
        alert(created.message || "Error adding comic");
        return;
      }
      navigate(`/comics/${created.id}`);
    } catch (err) {
      console.error(err);
      alert("Could not connect to server");
    }
  };

  /* ── guest state ─────────────────────────────────────────── */
  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-inner">
          <div className="profile-guest">
            You're not logged in. <Link to="/login" style={{ color:"#ffd98a" }}>Sign in</Link>
          </div>
        </div>
      </div>
    );
  }

  /* initials fallback avatar */
  const initials = user.username?.[0]?.toUpperCase() || "?";

  return (
    <div className="profile-page">
      <div className="profile-inner">

        {/* ══ PROFILE CARD ══════════════════════════════════ */}
        <div className="profile-card">
          <div className="profile-avatar-ring">
            {user.avatarUrl
              ? <img src={user.avatarUrl} alt="avatar" />
              : <span className="profile-avatar-placeholder">{initials}</span>
            }
          </div>

          <div className="profile-info">
            <p className="profile-label">Profile</p>
            <p className="profile-username">{user.username}</p>
            <p className="profile-email">{user.email}</p>
          </div>

          <div className="profile-tabs">
            <button
              className={`profile-tab-btn${view === "list" ? " active" : ""}`}
              onClick={() => setView("list")}
            >
              My List
            </button>
            <button
              className={`profile-tab-btn${view === "add" ? " active" : ""}`}
              onClick={() => setView("add")}
            >
              + Add Comic
            </button>
          </div>
        </div>

        {/* ══ STATS BAR ═════════════════════════════════════ */}
        <div className="profile-stats">
          <div className="stat-cell">
            <span className="stat-label">Total Read</span>
            <span className="stat-value">{counts.read}</span>
          </div>
          <div className="stat-cell">
            <span className="stat-label">Chapters Upload</span>
            <span className="stat-value">{comics.filter(c => c.uploadedBy === user.id).length}</span>
          </div>
          <div className="stat-cell">
            <span className="stat-label">Favourites</span>
            <span className="stat-value">{counts.favourite}</span>
          </div>
        </div>

        {/* ══ MAIN PANEL ════════════════════════════════════ */}
        {view === "list" ? (

          <div className="profile-panel">

            {/* sidebar */}
            <div className="profile-sidebar">
              <p className="sidebar-section-label">List</p>
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  className={`sidebar-filter-btn${filter === f.key ? " active" : ""}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                  <span className="count">{counts[f.key]}</span>
                </button>
              ))}

              <div className="sidebar-divider" />
              <p className="sidebar-section-label">Sort</p>
              <button
                className={`sidebar-sort-btn${!sortAsc ? " active" : ""}`}
                onClick={() => setSortAsc(false)}
              >
                Descending
              </button>
              <button
                className={`sidebar-sort-btn${sortAsc ? " active" : ""}`}
                onClick={() => setSortAsc(true)}
              >
                Ascending
              </button>
            </div>

            {/* comic list */}
            <div className="profile-list">
              {listLoading && (
                <p className="list-loading">Loading…</p>
              )}
              {!listLoading && displayed.length === 0 && (
                <p className="list-empty">Nothing here yet</p>
              )}
              {displayed.map(comic => (
                <Link
                  key={comic.id}
                  to={`/comics/${comic.id}`}
                  className="list-comic-card"
                >
                  <img
                    className="list-comic-img"
                    src={comic.imageUrl}
                    alt={comic.title}
                  />
                  <div className="list-comic-info">
                    <p className="list-comic-title">{comic.title}</p>
                    {comic.publisher && (
                      <p className="list-comic-publisher">{comic.publisher}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

          </div>

        ) : (

          /* ══ ADD COMIC FORM ═══════════════════════════════ */
          <div className="add-comic-panel">
            <div className="add-comic-header">
              <h2 className="add-comic-header-title">Add New Comic</h2>
            </div>

            <div className="add-comic-body">
              <div className="add-field">
                <label className="add-label">Title</label>
                <input
                  className="add-input"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Batman"
                />
              </div>

              <div className="add-field">
                <label className="add-label">Author</label>
                <input
                  className="add-input"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Frank Miller"
                />
              </div>

              <div className="add-field">
                <label className="add-label">Description</label>
                <textarea
                  className="add-textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Comic description..."
                />
              </div>

              <div className="add-field">
                <label className="add-label">Image URL</label>
                <input
                  className="add-input"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <button className="add-submit" onClick={handleSubmit}>
                Add Comic
              </button>
            </div>
          </div>

        )}

      </div>
    </div>
  );
};

export default Profile;