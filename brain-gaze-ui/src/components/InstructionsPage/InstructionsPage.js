// src/components/InstructionsPage.js
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { Link } from 'react-router-dom';

const InstructionsPage = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch('/markdown/instructions.md')
      .then(response => response.text())
      .then(text => setMarkdown(marked.parse(text)))
      .catch(error => console.error('Error loading markdown file:', error));
  }, []);

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: markdown }} />
      <Link to="/webcam-settings">Setup Webcam</Link>
    </div>
  );
};

export default InstructionsPage;
