// src/components/InformedConsent.js
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { getSessionId } from '../util/UserSession';

const InformedConsent = ({ onConsent }) => {
  const [agreed, setAgreed] = useState(false);
  const [consentText, setConsentText] = useState('');

  useEffect(() => {
    const fetchedSessionId = getSessionId();
    console.log(fetchedSessionId);

    fetch('/markdown/consent-form.md') // Update the path to your markdown file
      .then(response => response.text())
      .then(markdown => setConsentText(marked.parse(markdown)))
      .catch(error => console.error('Error loading consent form:', error));
  }, []);

  const handleAgreeChange = (event) => {
    setAgreed(event.target.checked);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (agreed) {
      onConsent();
    } else {
      alert("Please agree to the informed consent to proceed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div dangerouslySetInnerHTML={{ __html: consentText || 'Loading consent form...' }} />
      <label>
        <input type="checkbox" checked={agreed} onChange={handleAgreeChange} />
        I agree to the terms and conditions.
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default InformedConsent;
