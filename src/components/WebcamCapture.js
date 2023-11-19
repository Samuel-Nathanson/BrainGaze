import React, { useState, useEffect, useRef } from 'react';

const WebcamCapture = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      });
  }, []);

  useEffect(() => {
    if (selectedDeviceId) {
      const constraints = {
        video: { deviceId: { exact: selectedDeviceId } }
      };

      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          // Setup media recorder
          mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
          mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
        })
        .catch(error => {
          console.error("Error accessing the webcam:", error);
        });
    }
  }, [selectedDeviceId]);

  const handleDeviceChange = (event) => {
    setSelectedDeviceId(event.target.value);
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordedChunks(prev => prev.concat(event.data));
    }
  };

  const startRecording = () => {
    setRecordedChunks([]);
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const downloadRecording = () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.webm";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <select onChange={handleDeviceChange} value={selectedDeviceId}>
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Camera ${device.deviceId}`}
          </option>
        ))}
      </select>
      <br/>
      <video ref={videoRef} autoPlay style={{ width: '720px', height: '480px' }}></video>
      <br/>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <button onClick={downloadRecording} disabled={!recordedChunks.length}>
        Download Recording
      </button>
    </div>
  );
};

export default WebcamCapture;
