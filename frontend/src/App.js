import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import ServicesPage from './components/ServicesPage';
import AboutPage from './components/AboutPage';
import CredentialsPage from './components/CredentialsPage';
import Callback from './components/callback';
// import OAuthHandler from './components/OauthHandler';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/service" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/credentials" element={<CredentialsPage />} />
        <Route path="/callback" element={<Callback/>} />
      
      </Routes>
    </Router>
  );
}

export default App;
