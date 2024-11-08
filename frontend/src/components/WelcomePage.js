// src/components/WelcomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import '/home/silent/Desktop/services/frontend/src/App.css'; // Import shared CSS for styling

const WelcomePage = () => {
  return (
    <div className="welcome-page">
      <h1>Welcome to Services</h1>
      <p>Click below to explore our services!</p>
      <Link to="/services">
        <button className="list-services-btn">List Services</button>
      </Link>
    </div>
  );
};

export default WelcomePage;
