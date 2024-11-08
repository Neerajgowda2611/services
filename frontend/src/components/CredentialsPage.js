// src/components/CredentialsPage.js
import React from 'react';
import { useParams } from 'react-router-dom'; // Import useParams hook
import '/home/silent/Desktop/services/frontend/src/App.css'; // Import shared CSS for styling

const CredentialsPage = () => {
  const { service } = useParams(); // Get the service name from the URL

  return (
    <div className="credentials-page">
      <h2>{service} Credentials</h2>
      <div className="credentials-table">
        <div className="credentials-row">
          <span className="credentials-label">User ID:</span>
          <span className="credentials-value">qwertyuisdfghjkdfghrtyujhkj</span>
        </div>
        <div className="credentials-row">
          <span className="credentials-label">Email:</span>
          <span className="credentials-value">exampleexample@example.com</span>
        </div>
        <div className="credentials-row">
          <span className="credentials-label">Name:</span>
          <span className="credentials-value">John Doe</span>
        </div>
        <div className="credentials-row">
          <span className="credentials-label">Created Time:</span>
          <span className="credentials-value">2024-11-08 12:34:56</span>
        </div>
        <div className="credentials-row">
          <span className="credentials-label">Access Key:</span>
          <span className="credentials-value">-</span>
        </div>
        <div className="credentials-row">
          <span className="credentials-label">Access Secret:</span>
          <span className="credentials-value">-</span>
        </div>
      </div>
      <button className="generate-btn">Generate Key and Secret</button>
    </div>
  );
};

export default CredentialsPage;
