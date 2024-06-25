import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Members from './components/Members';
import Header from './components/Header'; // Import the Header component
import QrScanner from './components/QrScanner'; // Import the QR Scanner component
import Logs from './components/Logs'; // Import the Logs component

const App = () => {
  return (
    <Router>
      <Header /> {/* Include the Header component */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/members" element={<Members />} />
        <Route path="/qr-scanner" element={<QrScanner />} /> {/* Add this line */}
        <Route path="/logs" element={<Logs />} /> {/* Add this line */}
      </Routes>
    </Router>
  );
};

export default App;
