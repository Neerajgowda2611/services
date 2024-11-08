// src/components/AboutPage.js
import React from 'react';
import { useParams } from 'react-router-dom';  // Import useParams hook
import '/home/silent/Desktop/services/frontend/src/App.css'; // Import shared CSS for styling

const AboutPage = () => {
  const { service } = useParams();  // Get the service name from the URL

  return (
    <div className="about-page">
      <h2>About {service}</h2>
      <p>This is a placeholder for {service} information. Add details here.</p>
    </div>
  );
};

export default AboutPage;
