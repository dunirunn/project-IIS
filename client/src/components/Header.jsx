import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import * as ROUTES from "../constants/routes";

import "./Header.css";

const LOGO_IMG_SRC = "/logo.png";
const NAME_IMG_SRC = "/name.png";

const Header = () => {
  const [searchValue, setSearchValue] = useState("");

  const navigate = useNavigate();

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
          <img src={LOGO_IMG_SRC} alt="Comic Roots logo" className="logo-icon" />
          <img src={NAME_IMG_SRC} alt="Comic Roots" className="logo-name" />
        </NavLink>

        <nav className="header-nav">
          <NavLink
            to={ROUTES.PROFILE}
            className={({ isActive }) =>
              `nav-link${isActive ? " active" : ""}`
            }
          >
            PROFILE
          </NavLink>

          <form className="header-search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="header-search-input"
              placeholder="SEARCH FOR..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />

            <button
              type="submit"
              className="header-search-button"
              aria-label="Search"
            >
              <span className="search-icon" />
            </button>
          </form>

          <NavLink
            to={ROUTES.LOGIN}
            className={({ isActive }) =>
              `nav-link login-link${isActive ? " active" : ""}`
            }
          >
            REGISTER / LOGIN
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;