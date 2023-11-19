// src/components/GazeTracking.js
import React, { useEffect, useState } from 'react';
import WebGazer from 'webgazer';

const GazeTracking = () => {
  const [gazeData, setGazeData] = useState({ x: 0, y: 0 });

  useEffect(() => {
    WebGazer.setGazeListener((data, timestamp) => {
      if (data) {
        setGazeData({ x: data.x, y: data.y });
      }
    }).begin();

    WebGazer.showVideoPreview(true)
           .showPredictionPoints(false); // Display the webcam and prediction points

    return () => {
    //   WebGazer.end(); // Cleanup on component unmount
    }
  }, []);

  return (
    <div>
      <h2>Gaze Tracking Data</h2>
      <p>X Coordinate: {gazeData.x.toFixed(2)}</p>
      <p>Y Coordinate: {gazeData.y.toFixed(2)}</p>
    </div>
  );
};

export default GazeTracking;
