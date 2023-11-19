import React, {Component} from 'react';
import webgazer from 'webgazer';
import AnimatedCalibrationPoint from './AnimatedCalibrationPoint';
import AnimatedTestPoint from './AnimatedTestPoint';

class CalibrationComponent extends Component {

	constructor(props) {
		super(props)
		this.state = {
			currentPointIndex: 0,
			calibrationComplete: false,
			webgazerInitialized: false,
			calibrationPoints: this.getInitializationPoints()
		}
		webgazer.showVideo(false);
		webgazer.showPredictionPoints(false);
		webgazer.clearData()
		webgazer.begin();
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
		// webgazer.begin();
		setTimeout(() => {
			this.showPointsInterval = setInterval(() => {
				this.setState({ currentPointIndex: this.state.currentPointIndex+1 });
				if (this.state.currentPointIndex === this.state.calibrationPoints.length) {
					this.setState({calibrationComplete: true});
					clearInterval(this.showPointsInterval);
				}
			}, 4000);
		}, 10000);
	}

	runCalibratedTest() {
		webgazer.showPredictionPoints(true);
		this.setState({currentPointIndex: 0});
	}

	componentDidUpdate(prevProps, prevState) {
		if(this.state.calibrationComplete && !prevState.calibrationComplete) {
			this.runCalibratedTest();
		}
	}

	render() {
		return (
			<div id='calibration-container'>
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
			</div>
		);

	}

};

export default CalibrationComponent;
