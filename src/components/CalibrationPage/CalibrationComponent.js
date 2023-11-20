import React, { Component } from 'react';
import webgazer from 'webgazer';
import AnimatedCalibrationPoint from './AnimatedCalibrationPoint';
import AnimatedTestPoint from './AnimatedTestPoint';
import { Link } from 'react-router-dom';
import ErrorVisualization from './ErrorVisualization';
import numeric from 'numeric'

class CalibrationComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPointIndex: 0,
      calibrationComplete: false,
      webgazerInitialized: false,
      calibrationPoints: this.getInitializationPoints(),
      testingComplete: false,
			testing: false,
      recordedGazeLocations: [], // To store recorded gaze locations
      recordedPointLocations: [], // To store recorded point locations
      rootMeanSquaredError: null, // To store the computed MSE
			semimajorAxisLength: null,
			semiminorAxisLength: null,
			rotationAngleDegrees: null
    };

		if(!this.state.webgazerInitialized) {
			webgazer.showVideo(false);
			webgazer.showPredictionPoints(false);
			webgazer.clearData();
			webgazer.begin();
		}
  }

  componentWillUnmount() {
    // webgazer.end();
  }

	getInitializationPoints() {
		const calibrationPoints = [
			{ x: '10%', y: '10%' }, // top-left
			{ x: '50%', y: '10%' }, // middle-top
			{ x: '90%', y: '10%' }, // top-right
			{ x: '10%', y: '50%' }, // middle-left
			{ x: '50%', y: '50%' },  // center
			{ x: '90%', y: '50%' }, // middle-right
			{ x: '10%', y: '90%' }, // bottom-left
			{ x: '50%', y: '90%' }, // middle-bottom
			{ x: '90%', y: '90%' } // bottom-right
			];

			return calibrationPoints;
  }

  componentDidMount() {
		if(this.state.testing) {
			this.setState({calibrationComplete: true})
		}
		if(!this.state.calibrationComplete) {
			console.log("Starting calibration...")
			setTimeout(() => {
				this.showPointsInterval = setInterval(() => {
					this.setState({ currentPointIndex: this.state.currentPointIndex+1 });
					if (this.state.currentPointIndex === this.state.calibrationPoints.length) {
						this.setState({calibrationComplete: true});
						clearInterval(this.showPointsInterval);
					}
				}, 5000);
			}, 4000);
		}
	}

  // Function to record gaze and point locations
  recordLocations = async () => {
    const { calibrationPoints, currentPointIndex } = this.state;
    const currentPoint = calibrationPoints[currentPointIndex];
    const recordedGazeLocations = [...this.state.recordedGazeLocations];
    const recordedPointLocations = [...this.state.recordedPointLocations];

		try {

			// Simulate getting the predicted gaze location
			// Simulate getting the predicted gaze location
			const predictedGazeLocation = await webgazer.getCurrentPrediction();

			// Get the height of the calibration-instructions element
			const calibrationInstructionsElement = document.getElementById('calibration-instructions');
			const calibrationInstructionsHeight = calibrationInstructionsElement ? calibrationInstructionsElement.clientHeight : 0;

			// Get the height of the app-header element
			const appHeaderElement = document.getElementById('app-header');
			const appHeaderHeight = appHeaderElement ? appHeaderElement.clientHeight : 0;

			// Calculate the total vertical offset
			const verticalOffset = calibrationInstructionsHeight + appHeaderHeight;

			const currentPointAbsolute = [parseInt(parseFloat(currentPoint.x)/100 * window.innerWidth),
																		parseInt(parseFloat(currentPoint.y)/100 * window.innerHeight + verticalOffset)];
			
			recordedGazeLocations.push([parseInt(predictedGazeLocation.x), parseInt(predictedGazeLocation.y)]);
			recordedPointLocations.push(currentPointAbsolute);

			this.setState({
				recordedGazeLocations,
				recordedPointLocations,
			});
		} catch (error) {
			console.error("Error fetching predicted gaze location: ", error)
		}
  };

  // Function to compute mean squared error
  computeRootMeanSquaredError = () => {
		const { recordedGazeLocations, recordedPointLocations } = this.state;
		let mse = 0;
		let varianceX = 0;
		let varianceY = 0;
	
		// Calculate the mean squared error and variances
		for (let i = 0; i < recordedGazeLocations.length; i++) {
			const gazeLocation = recordedGazeLocations[i];
			const pointLocation = recordedPointLocations[i];
			const dx = gazeLocation[0] - pointLocation[0];
			const dy = gazeLocation[1] - pointLocation[1];
			mse += dx * dx + dy * dy;
			varianceX += dx * dx;
			varianceY += dy * dy;
		}
	
		mse /= recordedGazeLocations.length;
		const rmse = Math.sqrt(mse);
	
		// Calculate standard deviation for both X and Y
		const stdDevX = Math.sqrt(varianceX / recordedGazeLocations.length);
		const stdDevY = Math.sqrt(varianceY / recordedGazeLocations.length);
	
		// Calculate variance for both X and Y
		const varX = varianceX / recordedGazeLocations.length;
		const varY = varianceY / recordedGazeLocations.length;
	
		this.setState({
			rootMeanSquaredError: rmse,
			standardDeviationX: stdDevX,
			standardDeviationY: stdDevY,
			varianceX: varX,
			varianceY: varY,
		});
	};

	compute95ConfidenceEllipse = () => {
		const { recordedGazeLocations, recordedPointLocations } = this.state;

		// const recordedGazeLocationsDummy = [[-6, 248], [723, 390], [1213, 328], [-162, 924], [569, 843], [1243, 842], [122, 1272], [790, 1197], [1181, 1229]];
		// const recordedPointLocationsDummy = [[127, 258], [639, 258], [1150, 258], [127, 774], [639, 774], [1150, 774], [127, 1290], [639, 1290], [1150, 1290]];

		let errors = recordedGazeLocations.map((gazeLocation, i) => {
				return [
						gazeLocation[0] - recordedPointLocations[i][0],
						gazeLocation[1] - recordedPointLocations[i][1]
				];
		});

		// Calculate mean of errors
		let meanErrorX = errors.reduce((sum, error) => sum + error[0], 0) / errors.length;
		let meanErrorY = errors.reduce((sum, error) => sum + error[1], 0) / errors.length;

		// Calculate covariance of errors
		let covarianceXX = 0, covarianceYY = 0, covarianceXY = 0;
		errors.forEach(error => {
				covarianceXX += (error[0] - meanErrorX) ** 2;
				covarianceYY += (error[1] - meanErrorY) ** 2;
				covarianceXY += (error[0] - meanErrorX) * (error[1] - meanErrorY);
		});

		let n = errors.length;
		covarianceXX /= n;
		covarianceYY /= n;
		covarianceXY /= n;

		// Compute covariance matrix
		const covarianceMatrix = [
				[covarianceXX, covarianceXY],
				[covarianceXY, covarianceYY]
		];

		// Compute eigenvalues and eigenvectors
		const eigenDecomposition = numeric.eig(covarianceMatrix);
		const eigenvalues = eigenDecomposition.lambda.x;
		const eigenvectors = eigenDecomposition.E.x;

		// Scale factors for 95% confidence interval (Chi-square distribution)
		const scaleFactor = Math.sqrt(5.991); // Approx value for 95% confidence

		const axisLengthsSquared = eigenvalues.map(lambda => lambda * scaleFactor * scaleFactor);
		const sortedAxisLengths = axisLengthsSquared.sort((a, b) => b - a);
		const semimajorAxisLength = Math.sqrt(sortedAxisLengths[0]);
		const semiminorAxisLength = Math.sqrt(sortedAxisLengths[1]);

		// Calculate rotation angle from eigenvectors
		const rotationAngleRadians = Math.atan2(eigenvectors[0][1], eigenvectors[0][0]);
		const rotationAngleDegrees = rotationAngleRadians * (180 / Math.PI);

		this.setState({ semimajorAxisLength, semiminorAxisLength, rotationAngleDegrees });
	};


	
  // Function to run the calibrated test with intervals
  runCalibratedTest = () => {
		console.log("Running test with calibrated eye tracker...")

    webgazer.showPredictionPoints(true);
    this.setState({ currentPointIndex: 0 });
    this.showPointsInterval = setInterval(() => {
      this.setState({ currentPointIndex: this.state.currentPointIndex + 1 });

      // Record gaze and point locations at the end of the interval
      this.recordLocations();

      if (this.state.currentPointIndex === this.state.calibrationPoints.length) {
        clearInterval(this.showPointsInterval);
				this.setState({testingComplete: true})

				console.log("Test complete! Computing RMSE and 95% Confidence Ellipse")
        // All intervals are complete, compute MSE
        this.computeRootMeanSquaredError();
				this.compute95ConfidenceEllipse();
				webgazer.pause()
      }
    }, 4000); // Adjust the delay time as needed
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.calibrationComplete && !prevState.calibrationComplete) {
      this.runCalibratedTest();
    }
  }

  render() {
    return (
      <div id='calibration-container' style={{ backgroundImage: this.state.calibrationComplete ? '' : '' }}>
        {this.state.calibrationPoints.map((point, index) => (
					this.state.calibrationComplete ? 
						<AnimatedTestPoint 
							x={point.x}
							y={point.y}
							visibility={(this.state.currentPointIndex === index && this.state.calibrationComplete) 
								? 'visible' : 'hidden'}
						/> :
						<AnimatedCalibrationPoint 
						x={point.x}
						y={point.y}
						visibility={(this.state.currentPointIndex === index && !this.state.calibrationComplete) 
							? 'visible' : 'hidden'}
					/> 
				))}
				<> {this.state.testingComplete ? (
					<>
						<h2> Calibration complete! </h2>
						<p> Click below to proceed to the next step </p>
						<Link to="/media-view">Click here to proceed</Link>
						<br/><br/>
						<h2>Calibration Statistics</h2>
						<ErrorVisualization semiMaj={this.state.semimajorAxisLength} 
																semiMin={this.state.semiminorAxisLength} 
																rotationDeg={this.state.rotationAngleDegrees}/>
						<table className='table-centered'>
							<tbody>
								<tr>
									<td>Root Mean Squared Error (RMSE):</td>
									<td>{this.state.rootMeanSquaredError}</td>
								</tr>
								<tr>
									<td>Standard Deviation X:</td>
									<td>{this.state.standardDeviationX}</td>
								</tr>
								<tr>
									<td>Standard Deviation Y:</td>
									<td>{this.state.standardDeviationY}</td>
								</tr>
								<tr>
									<td>95% Confidence Ellipse Semimajor Length:</td>
									<td>{this.state.semimajorAxisLength}</td>
								</tr>
								<tr>
									<td>95% Confidence Ellipse Semiminor Length:</td>
									<td>{this.state.semiminorAxisLength}</td>
								</tr>
								<tr>
									<td>95% Confidence Ellipse Rotation (Degrees):</td>
									<td>{this.state.rotationAngleDegrees}</td>
								</tr>
								<tr>
									<td>Gaze Predictions:</td>
									<td>{JSON.stringify(this.state.recordedGazeLocations)}</td>
								</tr>
								<tr>
									<td>Point Locations:</td>
									<td>{JSON.stringify(this.state.recordedPointLocations)}</td>
								</tr>
							</tbody>
						</table>
					</>
					) : (
						<br />
					)}
				</>
					
      </div>
    );
  }
}

export default CalibrationComponent;
