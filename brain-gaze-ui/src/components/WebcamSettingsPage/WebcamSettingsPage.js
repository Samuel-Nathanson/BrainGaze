// src/components/WebcamSettingsPage/WebcamSettingsPage.js
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam';
import { sendWebcamSnapshot } from '../../api/requests';
import { getSessionId } from '../../util/UserSession';

class WebcamSettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markdown: '',
      webcamActive: false,
    };
    this.webcamRef = React.createRef(); // Create a ref for the Webcam component

  }

  componentDidMount() {
    // Get (or create) session ID
    const fetchedSessionId = getSessionId();
    console.log(fetchedSessionId);

    // Fetch and parse markdown instructions
    fetch('/markdown/webcam-settings-instructions.md') // Update with your markdown file path
      .then(response => response.text())
      .then(text => this.setState({ markdown: text }))
      .catch(error => console.error('Error loading markdown:', error));

    // Setup webcam
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          this.setState({ webcamActive: true }, () => {
            setTimeout(() => {
              const webcam = this.webcamRef;
              if (webcam) {
                const screenshot = webcam.getScreenshot();
                if (screenshot) {
                  sendWebcamSnapshot({"img": screenshot, "sessionId": fetchedSessionId});
                }
              }
            }, 500);
          });
        })
        .catch(err => {
          console.error("Error accessing the webcam:", err);
          this.setState({ webcamActive: false });
        });
    } else {
      console.error("getUserMedia not supported");
      this.setState({ webcamActive: false });
    }
  }

  render() {
    const { markdown, webcamActive } = this.state;

    return (
      <div>
        {/* <Link to="/">Back</Link> Update the href with your desired route */}
        <div dangerouslySetInnerHTML={{ __html: markdown }} />
        <br/>
        {webcamActive ? (
          <>
            <Link to="/calibration">Start Calibration</Link>
            <br/>
            <br/>
            <Webcam
              id='webcam-test'
              audio={false}
              screenshotFormat="image/jpeg"
              ref={(webcamRef) => (this.webcamRef = webcamRef)} // Assign the ref
            />
          </>
        ) : (
          <p>Unable to access webcam..</p>
        )}
      </div>
    );
  }
}

export default WebcamSettingsPage;
