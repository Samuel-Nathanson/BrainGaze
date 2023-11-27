import config from "../config";

const sendCalibrationData = (data) => {
  console.log(config)
  fetch(config['SERVER_URL'] + '/api/save_calibration_data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message); // Response from the server
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

const sendMediaData = (data) => {
  console.log(config)
  fetch(config['SERVER_URL'] + '/api/save_media_data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message); // Response from the server
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

const sendWebcamSnapshot = (data) => {
  fetch(config['SERVER_URL'] + '/api/save_webcam_snapshot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message); // Response from the server
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

export { sendCalibrationData, sendMediaData, sendWebcamSnapshot}