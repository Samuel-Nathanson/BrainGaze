// src/components/CalibrationPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import CalibrationComponent from './CalibrationComponent';

const CalibrationPage = () => {
  // Add calibration logic here

  return (
    <>
      <CalibrationComponent/>
      <Link to="/media-view">Proceed to Media View</Link>
    </>
  );
};

export default CalibrationPage;
