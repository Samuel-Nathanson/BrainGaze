// src/components/InstructionsPage.js
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { Link } from 'react-router-dom';
import { getSessionId } from '../../util/UserSession';
import { API } from 'aws-amplify'

const InstructionsPage = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {

    // declare the data fetching function

    const getData = async () => {
      const data = await API.get('braingazeapi', '/calibrationSession')
      console.log(data)
    }

    // call the function
    getData()

    const fetchedSessionId = getSessionId();
    console.log(fetchedSessionId);

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
