// src/components/ServiceCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import '/home/silent/Desktop/services/frontend/src/App.css'; // Import the shared CSS for styling

const ServiceCard = ({ serviceName }) => {
  return (
    <div className="service-card">
      <h2>{serviceName}</h2>
      <div className="button-container">
        <Link to={`/about/${serviceName}`}>
          <button className="service-btn">About</button>
        </Link>
        <Link to={`/credentials/${serviceName}`}>
          <button className="service-btn">Credentials</button>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
