// src/components/WebcamSettingsPage/WebcamSettingsPage.js
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam';

const WebcamSettingsPage = () => {
  const [markdown, setMarkdown] = useState('');
  const [webcamActive, setWebcamActive] = useState(false);

  useEffect(() => {
    // Fetch and parse markdown instructions
    fetch('/markdown/webcam-settings-instructions.md') // Update with your markdown file path
      .then(response => response.text())
      .then(text => setMarkdown(text))
      .catch(error => console.error('Error loading markdown:', error));

    // Setup webcam
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          setWebcamActive(true);
        })
        .catch(err => {
          console.error("Error accessing the webcam:", err);
          setWebcamActive(false);
        });
    } else {
      console.error("getUserMedia not supported");
      setWebcamActive(false);
    }
  }, []);

  return (
    <div>
      <Link to="/">Back</Link> {/* Update the href with your desired route */}
      <div dangerouslySetInnerHTML={{ __html: markdown }} />
      <br/>
      {webcamActive ? (
        <Webcam
          id='webcam-test'
          width="90%"
          height="80%"
          audio={false}
          screenshotFormat="image/jpeg"
        />
      ) : (
        <p>Unable to access webcam.</p>
      )}
    </div>
  );
};

export default WebcamSettingsPage;
