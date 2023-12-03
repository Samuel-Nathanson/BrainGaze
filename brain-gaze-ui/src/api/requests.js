import config from "../config";
import { put } from 'aws-amplify/api'

const apiName = 'braingazeAPI'

const sendCalibrationData = (sessionId, dataType, sessionData) => {

  try {
    const msgBody = {
      sessionId: sessionId,
      sessionData: sessionData,
      dataType: dataType
    };

    const restOperation = put({
      apiName: apiName,
      path: '/calibrationData',
      options: {
        body: msgBody
      }
    });

    restOperation.response.then(
      response => {
        console.log('PUT call succeeded: ', response);
      },
      err => {
        console.log('PUT call failed: ', err);
      }
    );
  } catch (err) {
    console.log('Error during PUT call setup: ', err);
  }

};

const sendMediaViewData = (sessionId, dataType, sessionData) => {
  try {
    const msgBody = {
      sessionId: sessionId,
      sessionData: sessionData,
      dataType: dataType
    };

    const restOperation = put({
      apiName: apiName,
      path: '/mediaViewData',
      options: {
        body: msgBody
      }
    });

    restOperation.response.then(
      response => {
        console.log('PUT call succeeded: ', response);
      },
      err => {
        console.log('PUT call failed: ', err);
      }
    );
  } catch (err) {
    console.log('Error during PUT call setup: ', err);
  }
};

const sendWebcamData = (sessionId, dataType, sessionData) => {
  try {
    const msgBody = {
      sessionId: sessionId,
      sessionData: sessionData,
      dataType: dataType
    };

    const restOperation = put({
      apiName: apiName,
      path: '/webcamData',
      options: {
        body: msgBody
      }
    });

    restOperation.response.then(
      response => {
        console.log('PUT call succeeded: ', response);
      },
      err => {
        console.log('PUT call failed: ', err);
      }
    );
  } catch (err) {
    console.log('Error during PUT call setup: ', err);
  }
};

export { sendCalibrationData, sendMediaViewData, sendWebcamData }