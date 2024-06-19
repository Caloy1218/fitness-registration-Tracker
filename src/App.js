// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Members from './components/Members';
import Header from './components/Header'; // Import the Header component

const App = () => {
  return (
    <Router>
      <Header /> {/* Include the Header component */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/members" element={<Members />} />
      </Routes>
    </Router>
  );
};

export default App;
