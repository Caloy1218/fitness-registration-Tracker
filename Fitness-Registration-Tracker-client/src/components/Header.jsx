import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import CSS file for styling

const Header = () => {
  return (
    <header className="header">
      <nav className="nav-menu">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/members">Members</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/qr-scanner">QR Scanner</Link></li>
          <li><Link to="/logs">Logs</Link></li> {/* Add this line */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
