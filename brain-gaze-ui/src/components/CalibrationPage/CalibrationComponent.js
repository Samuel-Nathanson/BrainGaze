import React, { Component } from 'react';
import webgazer from 'webgazer';
import AnimatedCalibrationPoint from './AnimatedCalibrationPoint';
import AnimatedTestPoint from './AnimatedTestPoint';
import { Link } from 'react-router-dom';
import ErrorVisualization from './ErrorVisualization';
import numeric from 'numeric'
import { marked } from 'marked';
import config from '../../debugConfig';
import {sendCalibrationData, sendMediaData, sendWebcamSnapshot } from '../../api/requests'
import { getSessionId } from '../../util/UserSession';

class CalibrationComponent extends Component {
	constructor(props) {
		super(props);

		const savedStateJSON = sessionStorage.getItem('calibrationComponentState');

		const initialState = {
			/* State signals */
			sessionId: getSessionId(), // Session ID for the user browser.
			calibrationStarted: false, // Needed to show instructions first before starting calibration
			currentPointIndex: 0, // Needed to iterate through calibration / test points
			calibrationComplete: false, // Needed to signal that calibration (training) is complete
			webgazerInitialized: false, // Avoid initializing webgazer twice
			testingComplete: false, // Signals that test is complete and statistics should be shown
			testing: false, // Developer flag, skips some of the initial instructions (experimental)
			testingCompleteTime: -1, // Used to discern newer calibrations after user restarts 
			showTestInstructions: false, // Signals display of instructions for testing calibration
			showCalibrationStats: false, // Signals display of calibration stats
			calibrationPoints: [], // Points to iterate over
			testPoints: [], // for testing
			recordedGazeLocations: [], // To store recorded gaze locations
			recordedPointLocations: [], // To store recorded point locations
			windowInnerHeight: null,
			windowInnerWidth: null,
			/* Statistics */
			maxRSE: null,
			minRSE: null,
			rootMeanSquaredError: null, // To store the computed MSE
			semimajorAxisLength95: null,
			semiminorAxisLength95: null,
			semimajorAxisLength90: null,
			semiminorAxisLength90: null,
			semimajorAxisLength75: null,
			semiminorAxisLength75: null,
			rotationAngleDegrees: null,
			/* Instructions Markdown */
			calibrationInstructionsMd: '',
			calibratedTestInstructionsMd: '',
		};

		if (savedStateJSON) {
			const savedState = JSON.parse(savedStateJSON);
			if (savedState.testingComplete) {
				this.state = savedState;
				return;
			}
		}

		this.state = initialState;

		if (!this.state.webgazerInitialized) {
			/* Don't show subject video, could be distracting */
			webgazer.showVideo(false);
			/* Don't show prediction points, could also be distracting */
			webgazer.showPredictionPoints(false);
			/* Clears previous cached data for a fresh calibration */
			webgazer.clearData();
			/* Starts webgazer data collection */
			webgazer.begin();
			this.state.webgazerInitialized = true;
		}

		const NUM_TEST_POINTS = config["NUM_TEST_POINTS"];
		this.state.calibrationPoints = this.getInitializationPoints();
		this.state.testPoints = this.getTestPoints(NUM_TEST_POINTS);

	}

	componentWillUnmount() {
		/* This ends webgazer data collection. It's sometimes buggy, and we also don't want to turn it off yet */
		// webgazer.end();

		if(this.state.testingComplete) {
			sendCalibrationData({'state': this.state})
		}

	}

	getInitializationPoints() {
		let points = [];
		/* x, y percentages of viewport size */
		points = [
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
		return points;
	}

	getTestPoints(n) {
		const points = [];
		for (let i = 0; i < n; i++) {
			// Generate random x and y percentages
			const x = `${Math.floor(Math.random() * 80 + 10)}%`;
			const y = `${Math.floor(Math.random() * 80 + 10)}%`;

			// Add the point to the array
			points.push({ x, y });
		}
		return points;
	}

	componentDidMount() {
		/* Runs when the page is successfully loaded */
		const DISPLAY_TIME_CALIBRATION_POINT = config["DISPLAY_TIME_CALIBRATION_POINT"];
		const DISPLAY_TIME_CALIBRATION_INSTRUCTIONS = config["DISPLAY_TIME_CALIBRATION_INSTRUCTIONS"];

		/* Fetches the markdown instructions */
		fetch('/markdown/calibration-instructions.md') // Update with your markdown file path
			.then(response => response.text())
			.then(text => this.setState({ calibrationInstructionsMd: marked.parse(text) }))
			.catch(error => console.error('Error loading markdown:', error));

		fetch('/markdown/calibrated-test-instructions.md') // Update with your markdown file path
			.then(response => response.text())
			.then(text => this.setState({ calibratedTestInstructionsMd: marked.parse(text) }))
			.catch(error => console.error('Error loading markdown:', error));

		console.log("Starting instruction timeout")

		/* Give the user time before starting the calibration training */
		setTimeout(() => {
			this.setState({ calibrationStarted: true });
			/* Start calibration */
			console.log("Starting calibration...")
			/* Required to iterate over calibration points */
			this.showPointsInterval = setInterval(() => {
				this.setState({ currentPointIndex: this.state.currentPointIndex + 1 });
				if (this.state.currentPointIndex === this.state.calibrationPoints.length) {
					this.setState({ calibrationComplete: true });
					clearInterval(this.showPointsInterval);
				}
			}, DISPLAY_TIME_CALIBRATION_POINT);
		}, DISPLAY_TIME_CALIBRATION_INSTRUCTIONS)
	}

	// Function to record gaze and point locations
	recordLocations = async () => {
		/* Records user clicks and corresponding calibration points, data stored for evaluation */
		const { calibrationPoints, currentPointIndex } = this.state;
		const currentPoint = calibrationPoints[currentPointIndex];
		const recordedGazeLocations = [...this.state.recordedGazeLocations];
		const recordedPointLocations = [...this.state.recordedPointLocations];

		try {

			// Simulate getting the predicted gaze location
			const predictedGazeLocation = await webgazer.getCurrentPrediction();

			/* Computations to get a good estimate of calibration points in pixel space */
			// Get the height of the calibration-instructions element
			const calibrationInstructionsElement = document.getElementById('calibration-instructions');
			const calibrationInstructionsHeight = calibrationInstructionsElement ? calibrationInstructionsElement.clientHeight : 0;

			// Get the height of the app-header element
			const appHeaderElement = document.getElementById('app-header');
			const appHeaderHeight = appHeaderElement ? appHeaderElement.clientHeight : 0;

			// Calculate the total vertical offset
			const verticalOffset = calibrationInstructionsHeight + appHeaderHeight;

			const currentPointAbsolute = [parseInt(parseFloat(currentPoint.x) / 100 * window.innerWidth),
			parseInt(parseFloat(currentPoint.y) / 100 * window.innerHeight + verticalOffset)];

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

	/* Function to compute mean squared error (statistic to display) */
	/* Also computes other statistics, e.g. minRSE, maxRSE, stdDevX, stdDevY */
	/* TODO: AI-Generated Code by GPT-4, need to double check */
	computeRootMeanSquaredError = () => {
		const { recordedGazeLocations, recordedPointLocations } = this.state;
		let mse = 0;
		let varianceX = 0;
		let varianceY = 0;
		let maxSE = 0;
		let minSE = Infinity;

		// Calculate the mean squared error and variances
		for (let i = 0; i < recordedGazeLocations.length; i++) {
			const gazeLocation = recordedGazeLocations[i];
			const pointLocation = recordedPointLocations[i];
			const dx = gazeLocation[0] - pointLocation[0];
			const dy = gazeLocation[1] - pointLocation[1];
			const se = dx * dx + dy * dy;
			if (se < minSE) {
				minSE = se;
			}
			if (se > maxSE) {
				maxSE = se;
			}
			mse += se
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
			maxRSE: Math.sqrt(maxSE),
			minRSE: Math.sqrt(minSE)
		});
	};

	compute95ConfidenceEllipse = () => {
		/* Computes 95% confidence ellipse semimajor axis length, semiminor axis length */
		/* TODO: AI-Generated Code by GPT-4, need to double check */
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

		// Calculate rotation angle from eigenvectors
		const rotationAngleRadians = Math.atan2(eigenvectors[0][1], eigenvectors[0][0]);
		const rotationAngleDegrees = rotationAngleRadians * (180 / Math.PI);

		// Scale factors for 95% confidence interval (Chi-square distribution)
		const scaleFactor95 = Math.sqrt(5.991); // Approx value for 95% confidence
		const scaleFactor90 = Math.sqrt(4.605); // Approx value for 90% confidence
		const scaleFactor75 = Math.sqrt(2.773); // Approx value for 75% confidence

		let axisLengthsSquared = eigenvalues.map(lambda => lambda * scaleFactor95 * scaleFactor95);
		let sortedAxisLengths = axisLengthsSquared.sort((a, b) => b - a);
		const semimajorAxisLength95 = Math.sqrt(sortedAxisLengths[0]);
		const semiminorAxisLength95 = Math.sqrt(sortedAxisLengths[1]);

		axisLengthsSquared = eigenvalues.map(lambda => lambda * scaleFactor90 * scaleFactor90);
		sortedAxisLengths = axisLengthsSquared.sort((a, b) => b - a);
		const semimajorAxisLength90 = Math.sqrt(sortedAxisLengths[0]);
		const semiminorAxisLength90 = Math.sqrt(sortedAxisLengths[1]);

		axisLengthsSquared = eigenvalues.map(lambda => lambda * scaleFactor75 * scaleFactor75);
		sortedAxisLengths = axisLengthsSquared.sort((a, b) => b - a);
		const semimajorAxisLength75 = Math.sqrt(sortedAxisLengths[0]);
		const semiminorAxisLength75 = Math.sqrt(sortedAxisLengths[1]);

		this.setState({ semimajorAxisLength95, semiminorAxisLength95, rotationAngleDegrees });
		this.setState({ semimajorAxisLength90, semiminorAxisLength90, rotationAngleDegrees });
		this.setState({ semimajorAxisLength75, semiminorAxisLength75, rotationAngleDegrees });

	};

	// Function to run the calibrated test with intervals
	runCalibratedTest = () => {

		const DISPLAY_TIME_CALIBRATION_TEST_POINT = config["DISPLAY_TIME_CALIBRATION_TEST_POINT"];
		/* Runs a performance test on the already-calibrated gaze tracker */
		console.log("Running test with calibrated eye tracker...")

		webgazer.showPredictionPoints(true);
		webgazer.removeMouseEventListeners();

		this.setState({
			currentPointIndex: 0,
			calibrationPoints: this.state.testPoints,
			showTestInstructions: false
		});
		this.showPointsInterval = setInterval(() => {
			this.setState({ currentPointIndex: this.state.currentPointIndex + 1 });

			// Record gaze and point locations at the end of the interval
			this.recordLocations();

			if (this.state.currentPointIndex === this.state.calibrationPoints.length - 1) {
				clearInterval(this.showPointsInterval);
				

				console.log("Test complete! Computing RMSE and 95% Confidence Ellipse")
				// All intervals are complete, compute MSE
				this.computeRootMeanSquaredError();
				this.compute95ConfidenceEllipse();
				webgazer.showPredictionPoints(false);
				webgazer.pause()
				this.setState({ testingComplete: true, 
												testingCompleteTime: new Date().getTime(), 
												windowInnerHeight: window.innerHeight, 
												windowInnerWidth: window.innerWidth }, () => {
					sessionStorage.setItem('calibrationComponentState', JSON.stringify(this.state));
					sendCalibrationData({'state': this.state});  
				});
				
			}
		}, DISPLAY_TIME_CALIBRATION_TEST_POINT); // Adjust the delay time as needed
	};

	componentDidUpdate(prevProps, prevState) {
		const DISPLAY_TIME_PERFORMANCE_TEST_INSTRUCTIONS = config["DISPLAY_TIME_PERFORMANCE_TEST_INSTRUCTIONS"];
		// Show the test instructions for the performance test
		if (this.state.calibrationComplete && !prevState.calibrationComplete) {
			this.setState({ showTestInstructions: true });
			setTimeout(this.runCalibratedTest, DISPLAY_TIME_PERFORMANCE_TEST_INSTRUCTIONS);
		}
	}

	// Toggle function for calibration statistics dropdown
	toggleCalibrationStats = () => {
		this.setState(prevState => ({
			showCalibrationStats: !prevState.showCalibrationStats
		}));
	};

	render() {

		if (this.state.showTestInstructions) {
			return (
				<>
					<div id='calibration-container'>
						<div id='calibration-instructions' dangerouslySetInnerHTML={{ __html: this.state.calibratedTestInstructionsMd }} />
					</div>
				</>);
		}

		if (!this.state.calibrationStarted) {
			return (
				<>
					<div id='calibration-container'>
						<div id='calibration-instructions' dangerouslySetInnerHTML={{ __html: this.state.calibrationInstructionsMd }} />
					</div>
				</>);
		}

		if (this.state.testingComplete) {
			return (
				<>
					<h2> Calibration complete! </h2>
					<p> Click below to proceed to the next step </p>
					<Link to={{
						pathname: "/media-view", state: {
							semimajorAxisLength: this.state.semimajorAxisLength95,
							semiminorAxisLength: this.state.semiminorAxisLength95,
							rotationAngleDegrees: this.state.rotationAngleDegrees,
							webgazerInitialized: this.state.webgazerInitialized
						}
					}}>Click here to proceed</Link>
					<br /><br />
					<button onClick={this.props.remountFunction}>Click here to restart calibration</button><br />
					<h2
						className={`dropdown-toggle ${this.state.showCalibrationStats ? 'open' : ''}`}
						onClick={this.toggleCalibrationStats}>
						<b>Click here</b> for Calibration Statistics
					</h2>
					<br />
					<br />
					{this.state.showCalibrationStats ?
						(<>
							<br />
							<ErrorVisualization semiMajs={[this.state.semimajorAxisLength95, this.state.semimajorAxisLength90, this.state.semimajorAxisLength75]}
								semiMins={[this.state.semiminorAxisLength95, this.state.semiminorAxisLength90, this.state.semiminorAxisLength75]}
								rotationDeg={this.state.rotationAngleDegrees} />
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
										<td>Maximum Error:</td>
										<td>{this.state.maxRSE}</td>
									</tr>
									<tr>
										<td>Minimum Error:</td>
										<td>{this.state.minRSE}</td>
									</tr>
									<tr>
										<td>95% Confidence Ellipse Semimajor Length:</td>
										<td>{this.state.semimajorAxisLength95}</td>
									</tr>
									<tr>
										<td>95% Confidence Ellipse Semiminor Length:</td>
										<td>{this.state.semiminorAxisLength95}</td>
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
						</>)
						: (<></>)
					}
				</>
			)
		}

		if (this.state.calibrationStarted && !this.state.showTestInstructions && !this.state.testingComplete) {
			return (
				<>
					<div id='calibration-container'>
						{this.state.calibrationComplete ?
							(this.state.testPoints.map((point, index) => (
								<AnimatedTestPoint
									key={index}
									x={point.x}
									y={point.y}
									visibility={(this.state.currentPointIndex === index && this.state.calibrationComplete)
										? 'visible' : 'hidden'}
								/>
							))) :
							(this.state.calibrationPoints.map((point, index) => (
								<AnimatedCalibrationPoint
									key={index}
									x={point.x}
									y={point.y}
									visibility={(this.state.currentPointIndex === index && !this.state.calibrationComplete)
										? 'visible' : 'hidden'}
								/>

							)))

						}
						{/* Calibration Phase (Green, Yellow, and Blue Circles) */}
						{ }
					</div>
				</>
			);
		}

	}
}

export default CalibrationComponent;
