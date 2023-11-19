// src/components/MediaViewPage/MediaViewPage.js
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';

const MediaViewPage = () => {
  const videoUrl = '/media/videos/eagle-stock-video.mp4';
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch('/markdown/media-view-instructions.md') // Update with your markdown file path
      .then(response => response.text())
      .then(text => setMarkdown(marked.parse(text)))
      .catch(error => console.error('Error loading markdown:', error));
  }, []);

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: markdown }} />
      <video width="100%" controls>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default MediaViewPage;


