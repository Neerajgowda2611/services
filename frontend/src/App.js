// // src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import WelcomePage from './components/WelcomePage';
// import ServicesPage from './components/ServicesPage';
// import AboutPage from './components/AboutPage';
// import CredentialsPage from './components/CredentialsPage';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<WelcomePage />} />
//         <Route path="/services" element={<ServicesPage />} />
//         <Route path="/about/:service" element={<AboutPage />} />
//         <Route path="/credentials/:service" element={<CredentialsPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import ServicesPage from './components/ServicesPage';
import AboutPage from './components/AboutPage';
import CredentialsPage from './components/CredentialsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/credentials" element={<CredentialsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
