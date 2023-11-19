// src/components/CalibrationPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { marked } from 'marked';
import CalibrationComponent from './CalibrationComponent';

const CalibrationPage = () => {
  // Add calibration logic here
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch('/markdown/calibration-instructions.md') // Update with your markdown file path
      .then(response => response.text())
      .then(text => setMarkdown(marked.parse(text)))
      .catch(error => console.error('Error loading markdown:', error));
  }, []);

  return (
    <>
      <div id='calibration-instructions' dangerouslySetInnerHTML={{ __html: markdown }} />
      <CalibrationComponent/>
      <Link to="/media-view">Proceed to Media View</Link>
    </>
  );
};

export default CalibrationPage;
