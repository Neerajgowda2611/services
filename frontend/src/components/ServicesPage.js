import React from 'react';
import { Link } from 'react-router-dom';  // Import Link for navigation
import '/home/silent/Desktop/services/frontend/src/App.css'; // Ensure CSS is imported
import AboutPage from './AboutPage';
import CredentialsPage from './CredentialsPage';

function ServicePage() {
  const services = [
    { name: 'Ciaos', description: 'Cloud Storage Service for your files and data.', id: 1 },
    { name: 'Compute', description: 'Compute Service for powerful workloads and data processing.', id: 2 },
    { name: 'Saramsha', description: 'AI-powered analytics service for insightful business decisions.', id: 3 },
    { name: 'Service4', description: 'Service 4 Description', id: 4 },
    { name: 'Service5', description: 'Service 5 Description', id: 5 },
    { name: 'Service6', description: 'Service 6 Description', id: 6 },
    { name: 'Service7', description: 'Service 7 Description', id: 7 },
    { name: 'Service8', description: 'Service 8 Description', id: 8 },
    { name: 'Service9', description: 'Service 9 Description', id: 9 },
  ];

  return (
    <div className="services-container">
      <h2>Our Services</h2>
      <div className="service-list">
        {services.map(service => (
          <div className="service-card" key={service.id}>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <Link to="/about">
              <button>About</button> {AboutPage}
            </Link>
            <Link to="/credentials">
              <button>Credentials</button> {CredentialsPage}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServicePage;
