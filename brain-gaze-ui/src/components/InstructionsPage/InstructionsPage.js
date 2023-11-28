// src/components/InstructionsPage.js
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { Link } from 'react-router-dom';
import { getSessionId } from '../../util/UserSession';
import { get } from 'aws-amplify/api';


const InstructionsPage = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {

    // declare the data fetching function

    async function getData() {
      try {
        const restOperation = get({
          apiName: 'braingazeapi',
          path: '/calibrationSession'
        });
        const response = await restOperation.response;
        console.log('GET call succeeded: ', response);
      } catch (error) {
        console.log('GET call failed: ', error);
      }
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
