import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>StoneStream</h1>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/inventory">Inventory</Link></li>
        <li><Link to="/sale">Sales</Link></li>
        <li><Link to="/purchase">Purchases</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/invoice">Invoice</Link></li>
      </ul>
      <div className="navbar-icons">
        <i className="icon search-icon">🔍</i>
        <i className="icon profile-icon">👤</i>
        <i className="icon favorites-icon">❤️</i>
      </div>
    </nav>
  );
};

export default Navbar;