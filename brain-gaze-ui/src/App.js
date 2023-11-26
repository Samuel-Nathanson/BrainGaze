import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';

// ... other imports

import InstructionsPage from './components/InstructionsPage/InstructionsPage';
import CalibrationPage from './components/CalibrationPage/CalibrationPage';
import MediaViewPage from './components/MediaViewPage/MediaViewPage';
import WebcamSettingsPage from './components/WebcamSettingsPage/WebcamSettingsPage';
import InformedConsent from './components/InformedConsent';

import './App.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isFirstPage = location.pathname === '/';

  return (
    <header className="App-header" id="App-Header">
      {!isFirstPage && (
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      )}
      <h1>BrainGaze - Eye Tracking Application</h1>
    </header>
  );
}

function App() {
  const [consentGiven, setConsentGiven] = useState(false); // TODO: change this back in the future

  const handleConsent = () => {
    setConsentGiven(true);
  };

  return (
    <div className="App">
      <Router>
        <Header />
        {!consentGiven ? (
          <InformedConsent onConsent={handleConsent} />
        ) : (
          <Routes>
            <Route path="/" element={<InstructionsPage />} />
            <Route path="/webcam-settings" element={<WebcamSettingsPage />} />
            <Route path="/calibration" element={<CalibrationPage />} />
            <Route path="/media-view" element={<MediaViewPage />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
