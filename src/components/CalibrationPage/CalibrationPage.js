// src/components/CalibrationPage.js
import React, { useState, useCallback } from 'react';
import CalibrationComponent from './CalibrationComponent';

const CalibrationPage = () => {
  // Add calibration logic here
  const [calibrationComponentKey, setCalibrationComponentKey] = useState(0);

  const remountCalibrationComponent = () => {
    console.log("Remount!!")
    sessionStorage.clear();
    setCalibrationComponentKey(prevKey => prevKey + 1); // Increment the key to force remount
  };

  return (
    <>
      <CalibrationComponent key={calibrationComponentKey} remountFunction={remountCalibrationComponent} />
    </>
  );
};

export default CalibrationPage;
