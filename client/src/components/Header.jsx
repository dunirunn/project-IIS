import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import * as ROUTES from "../constants/routes";

import "./Header.css";

const LOGO_IMG_SRC = "https://placehold.co/36x36/ff6b00/ffffff?text=C";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const navigate = useNavigate();

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchValue.trim();
    if (!query) return;
    navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink to={ROUTES.HOME} className="logo-link" aria-label="Home">
          <img src={LOGO_IMG_SRC} alt="ComicNest logo" className="logo-img" />
          <span className="logo-text">
            <span className="bracket">[</span>ComicNest<span className="bracket">]</span>
          </span>
        </NavLink>

        <nav className="header-nav">
          <NavLink
            to={ROUTES.PROFILE}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            <span>Profile</span>
          </NavLink>

          {!isSearchOpen ? (
            <button
              type="button"
              className="nav-link search-toggle"
              onClick={handleSearchOpen}
            >
              <span>Search</span>
            </button>
          ) : (
            <form className="header-search-form" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                className="header-search-input"
                placeholder="Search comics..."
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                autoFocus
              />

              <button type="submit" className="header-search-button">
                Search
              </button>
            </form>
          )}

          <div className="nav-divider" />

          <NavLink to={ROUTES.LOGIN} className="nav-link cta">
            <span>Login | Register</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;