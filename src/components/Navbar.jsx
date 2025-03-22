import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar() {
    return (
      <div className="navbar">
        <div className="navbar-left">
          <h1 className="zundo">Zundo-Retail</h1>
          <NavLink to="/build" className={({ isActive }) => isActive ? "navbar-btn active" : "navbar-btn"}>
            Build Scenarios
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "navbar-btn active" : "navbar-btn"}>
            Dashboard
          </NavLink>
        </div>
        <div className="navbar-right">
          <NavLink to="/saved" className={({ isActive }) => isActive ? "navbar-btn saved-scenarios active" : "navbar-btn saved-scenarios"}>
            Saved Scenarios
          </NavLink>
        </div>
      </div>
    );
  }
