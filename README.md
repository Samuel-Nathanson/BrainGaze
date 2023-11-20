# Brain Gaze

<img src="https://github.com/Samuel-Nathanson/BrainGaze/blob/master/public/media/images/BrainGaze.png" width="400" />

## Overview
Brain Gaze is a web-based eye-tracking application designed for crowdsourcing data gathering. It leverages webcam technology for tracking eye movements and facial expressions, with the primary goal of enhancing research and analysis in fields like neuromarketing and behavioral analysis. The application is built using JavaScript React and Flask, with a focus on user privacy and data security.

## Anticipated Features Checklist
- [x] **Webcam-Based Eye Tracking**: Implement eye tracking using the user's webcam.
- [ ] **Facial Expression Recognition**: Capability to recognize and analyze facial expressions.
- [ ] **Crowdsourced Data Collection**: Facilitate large-scale data collection from various users.
- [ ] **Data Analysis and Visualization**: Tools for analyzing the collected data and visualizing results.
- [ ] **User Experience Design**: Intuitive navigation and clear instructions for users.
- [ ] **Security Measures**: Ensure data encryption and user privacy.
- [x] **Informed Consent Protocol**: Flexible consent mechanism adaptable to different IRB requirements.
- [ ] **Administrator and User Roles**: Distinct access and control for administrators and users.
- [x] **Eye Tracking Calibration**: Accurate calibration process for each user session.
- [x] **Performance Evaluation**: Post-calibration accuracy evaluation feature.
- [ ] **React Web Application**: Front-end development with React.js.
- [ ] **Flask Backend**: Server application built with Flask.
- [x] **AWS Hosting**: Deployment on Amazon Web Services.
- [ ] **Google CoLab Integration**: Initial data analysis and visualization in Google CoLab notebooks.
- [ ] **Documentation**: Comprehensive documentation for different roles.
- [ ] **Data Deletion Option (Right to be Forgotten)**: Allow users to request data deletion.

## Development Notes
- The `CalibrationComponent` class is a crucial part of the application, handling the calibration and data collection processes.
- Calibration points and gaze locations are dynamically managed and stored in the component's state.
- The application utilizes `webgazer.js` for eye tracking and calibration.
- Additional features and improvements are marked with "TODO" comments for future implementation.

## Conclusion
Brain Gaze aims to be a versatile and powerful tool for collecting and analyzing eye-tracking and facial expression data. Its development focuses on creating an intuitive user experience while adhering to high standards of data security and privacy.

# React UI Information

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the UI directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
