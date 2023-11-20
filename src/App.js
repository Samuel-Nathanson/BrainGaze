// src/App.js
import React, { useState } from 'react';

import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import InstructionsPage from './components/InstructionsPage/InstructionsPage';
import CalibrationPage from './components/CalibrationPage/CalibrationPage';
import MediaViewPage from './components/MediaViewPage/MediaViewPage';

import InformedConsent from './components/InformedConsent';

import './App.css';

// ... other imports

function App() {
  const [consentGiven, setConsentGiven] = useState(false);

  const handleConsent = () => {
    setConsentGiven(true);
  };

  return (
    <div className="App">
      <header className="App-header" id="App-Header">
        <h1>Eye Tracking Application</h1>
      </header>
      {!consentGiven ? (
        <InformedConsent onConsent={handleConsent} />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<InstructionsPage />} />
            <Route path="/calibration" element={<CalibrationPage />} />
            <Route path="/media-view" element={<MediaViewPage />} />
          </Routes>
        </Router>
        )}
    </div>
  );
}

export default App;