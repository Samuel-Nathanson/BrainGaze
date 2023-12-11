# Brain Gaze

<img src="https://github.com/Samuel-Nathanson/BrainGaze/blob/master/brain-gaze-ui/public/media/images/BrainGaze.png" width="400" />

## Overview
Brain Gaze is a web-based eye-tracking application designed for crowdsourcing data gathering. It leverages webcam technology for tracking eye movements and facial expressions, with the primary goal of enhancing research and analysis in fields like neuromarketing and behavioral analysis. The application is built using JavaScript React and AWS Amplify, with a focus on user privacy and data security and scalability for large-scale crowdsourcing and human computing.

## Features Checklist
- [x] **Webcam-Based Eye Tracking**: Implement eye tracking using the user's webcam.
- [ ] **Facial Expression Recognition**: Capability to recognize and analyze facial expressions.
- [x] **Crowdsourced Data Collection**: Facilitate large-scale data collection from various users.
- [x] **Data Analysis and Visualization**: Tools for analyzing the collected data and visualizing results.
- [x] **User Experience Design**: Intuitive navigation and clear instructions for users.
- [x] **Security Measures**: Ensure data encryption and user privacy.
- [x] **Informed Consent Protocol**: Flexible consent mechanism adaptable to different IRB requirements.
- [ ] **Administrator and User Roles**: Distinct access and control for administrators and users.
- [x] **Eye Tracking Calibration**: Accurate calibration process for each user session.
- [x] **Performance Evaluation**: Post-calibration accuracy evaluation feature.
- [x] **React Web Application**: Front-end development with React.js.
- [x] **AWS Hosting**: Deployment on Amazon Web Services.
- [x] **Google CoLab Integration**: Initial data analysis and visualization in Google CoLab notebooks.
- [x] **Documentation**: Comprehensive documentation for different roles.
- [ ] **Data Deletion Option (Right to be Forgotten)**: Allow users to request data deletion.

## Development Notes
- The repository is set up into brain-gaze-ui and brain-gaze-server; 
- The brain-gaze-ui contains the client-side user interface which participants will interact with.  
- The application utilizes `webgazer.js` for eye tracking and calibration.
- We handle the back-end database and media storage with AWS Amplify, S3, and DynamoDb.
- Calibration points and gaze locations are dynamically managed and stored in the component's state.
- Additional features and improvements are marked with "TODO" comments for future implementation.


# React UI Information

The user interface was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). To run user interface locally, in the brain-gaze-ui directory, you can run:

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

### Learn More about React
You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
To learn React, check out the [React documentation](https://reactjs.org/).

# AWS Amplify Information
- The application assumes access to AWS Amplify back-end. Notably, the application assumes video media and user data are stored securely in AWS Amplify and S3.    
- This GitHub project was also set up with AWS Amplify - Whenever a new commit is made to master and pushed to the origin, AWS will attemept to build and deploy the newest commit to brain-gaze.com.  


## Setting up REST API to Securely Collect User Data 
Instructions for setting up the AWS REST API and Storage which handle receiving user data can be found here: https://docs.amplify.aws/javascript/build-a-backend/restapi/configure-rest-api/

## Setting up a Server to Serve Media Files (e.g. for participants to view)
Instructions for setting up an AWS server to serve objects/media can be found here: https://docs.aws.amazon.com/AmazonS3/latest/userguide/creating-bucket.html

There is one relevant configuration setting when creating "Block Public Access settings for this bucket" - Do *NOT* block public access to the media bucket since the application needs to acces the media. Once the bucket is created, set the bucket policy to the following: 
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::brain-gaze-video-bucket/*"
        }
    ]
}
```

## Configuring BrainGaze to connect to AWS 
To set this project up with AWS, one needs to update the config.js file in brain-gaze-ui/config.js  
```
"VIDEO_URL": "https://<your-bucket-name>.s3.<your-aws-region>.amazonaws.com/<video-name>",
"API_NAME": "<your_api_name>"
```

Additionally, in the brain-gaze-analysis/BrainGazeAnalysis.ipynb notebook, the `bucket_name` and `table_name` variables need to be updated to reflect setup. 

# Conclusion
Brain Gaze aims to be a versatile and powerful tool for collecting and analyzing eye-tracking and facial expression data. Its development focuses on creating an intuitive user experience while adhering to high standards of data security and privacy.
