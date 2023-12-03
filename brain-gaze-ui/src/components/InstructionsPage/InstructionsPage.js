// src/components/InstructionsPage.js
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { Link } from 'react-router-dom';
import { getSessionId } from '../../util/UserSession';
import { get, put } from 'aws-amplify/api';


const InstructionsPage = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {

    // declare the data fetching function

    async function putData() {
      try {
        const todo = { name: 'My first todo', message: 'Hello world!' };
        const restOperation = put({
          apiName: 'braingazeAPI',
          path: '/calibrationData',
          options: {
            body: todo
          }
        });
        const response = await restOperation.response;
        console.log('PUT call succeeded: ', response);
      } catch (err) {
        console.log('PUT call failed: ', err);
      }
    }

    // async function getData() {
    //   try {
    //     const restOperation = get({
    //       apiName: 'braingazeAPI',
    //       path: '/calibrationSession'
    //     });
    //     const response = await restOperation.response;
    //     console.log('GET call succeeded: ', response);
    //   } catch (error) {
    //     console.log('GET call failed: ', error);
    //   }
    // }

    // // call the function
    // getData();

    putData();

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
