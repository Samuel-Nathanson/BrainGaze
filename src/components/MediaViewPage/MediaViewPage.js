import React, { Component } from 'react';
import { marked } from 'marked';
import webgazer from 'webgazer'; // Import WebGazer

class MediaViewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markdown: '',
      videoUrl: '/media/videos/eagle-stock-video.mp4',
      isVideoPlaying: false, // Track video playing state
      isVideoEnded: false,
      gazeCollectionResolution: 100,
      webgazerInitialized: props.webgazerInitialized,
      recordedGazeLocations: [],
      recordedVideoTimestamps: []
    };
    this.gazeCollectionInterval = null; // Initialize gaze data collection interval
  }

  setupWebgazer() {

    // TODO : Need to double check that webgazer is still calibrated from the calibration step
    /* Don't show subject video, could be distracting */
    webgazer.showVideo(false);
    /* Don't show prediction points, could also be distracting */
    webgazer.showPredictionPoints(false);
    /* No other state estimation required */
    webgazer.applyKalmanFilter(false);

    /* In case we are loading in directly to media without going thru calibration */
    webgazer.clearGazeListener();
    // webgazer.resume();
  }

  componentDidMount() {
    // Load markdown content and initialize WebGazer
    fetch('/markdown/media-view-instructions.md')
      .then((response) => response.text())
      .then((text) => this.setState({ markdown: marked.parse(text) }))
      .catch((error) => console.error('Error loading markdown:', error));

    this.setupWebgazer()
  }

  // Event handler for video play
  handleVideoPlay = async () => {
    this.setState({ isVideoPlaying: true });
    webgazer.resume();

    // Start collecting gaze data at 100ms intervals when the video is playing
    this.gazeCollectionInterval = setInterval(async () => {
      if (this.state.isVideoPlaying) {
        const recordedGazeLocations = [...this.state.recordedGazeLocations];
        const recordedVideoTimestamps = [...this.state.recordedVideoTimestamps]

        try {
          // Simulate getting the predicted gaze location
          const predictedGazeLocation = await webgazer.getCurrentPrediction();
          const videoTimestamp = this.videoElement.currentTime;

          recordedGazeLocations.push([parseInt(predictedGazeLocation.x), parseInt(predictedGazeLocation.y)]);
          recordedVideoTimestamps.push(videoTimestamp);

          this.setState({
            recordedGazeLocations,
            recordedVideoTimestamps
          });

        } catch (error) {
          console.error("Error fetching predicted gaze location: ", error)
        }
      }
    }, this.state.gazeCollectionResolution);
  };

  // Event handler for video pause
  handleVideoPause = () => {

    this.setState({ isVideoPlaying: false });
    webgazer.pause(); // Save resources

    // Stop collecting gaze data when the video is paused
    clearInterval(this.gazeCollectionInterval);
  };

  handleVideoEnd = () => {

    this.setState({ isVideoEnded: true, isVideoPlaying: false })
    webgazer.pause();

  };

  renderResultsTable() {
    const { recordedVideoTimestamps, recordedGazeLocations } = this.state;

    if (recordedVideoTimestamps.length === 0 || recordedGazeLocations.length === 0) {
      return null; // Return null if there's no data
    }

    return (
      <table className='gazeTable'>
        <thead className='gazeTableHead'>
          <tr className='gazeTableTr'>
            <th className='gazeTableTh'>Timestamp</th>
            <th className='gazeTableTh'>Recorded Gaze Location (x, y)</th>
          </tr>
        </thead>
        <tbody>
          {recordedVideoTimestamps.map((timestamp, index) => (
            <tr className='gazeTableTr' key={index}>
              <td className='gazeTableTd'>{timestamp.toFixed(2)}s</td>
              <td className='gazeTableTd'>({recordedGazeLocations[index][0]}, {recordedGazeLocations[index][1]})</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  render_video_container() {
    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: this.state.markdown }} />
        <div className='video-container'>
          <video
            ref={(el) => (this.videoElement = el)} // Store a reference to the video element
            controls
            className='react-player'
            onPlay={this.handleVideoPlay}
            onPause={this.handleVideoPause}
            onEnded={this.handleVideoEnd}
          >
            <source src={this.state.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {this.state.isVideoEnded && this.renderResultsTable()} {/* Conditional rendering */}
      </div>
    );
  }

  render() {
    return this.render_video_container();
  }
}

export default MediaViewPage;
