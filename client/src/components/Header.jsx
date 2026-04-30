import React from "react";
import { NavLink } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import "./Header.css";

const LOGO_IMG_SRC = 'https://placehold.co/36x36/ff6b00/ffffff?text=C';

const Header = () => {

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
          <NavLink to={ROUTES.PROFILE} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            {/* profile icon svg */}
            <span>Profile</span>
          </NavLink>

          <NavLink to={ROUTES.SEARCH} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            {/* search icon svg */}
            <span>Search</span>
          </NavLink>

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
