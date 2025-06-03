import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import './App.css';

function App() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const intervalRef = useRef();
  const [detecting, setDetecting] = useState(false);
  const [faceCount, setFaceCount] = useState(0);
  const [showExpressions, setShowExpressions] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };

    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current.srcObject = stream;
        })
        .catch(err => {
          console.error('Error accessing webcam:', err);
        });
    };

    loadModels().then(startVideo);

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!detecting) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setFaceCount(0);
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      return;
    }

    const detect = async () => {
      if (
        videoRef.current &&
        canvasRef.current &&
        faceapi.nets.tinyFaceDetector.params
      ) {
        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceExpressions();

        setFaceCount(detections.length);

        const displaySize = {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        };
        faceapi.matchDimensions(canvasRef.current, displaySize);

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );

        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, displaySize.width, displaySize.height);

        // Draw bounding boxes
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        // Draw landmarks
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

        if (showExpressions) {
          // Draw all expressions as bar charts (optional)
          faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

          // Draw most likely expression above each face
          resizedDetections.forEach(det => {
            if (det.expressions) {
              const expressions = det.expressions;
              const maxValue = Math.max(...Object.values(expressions));
              const maxKey = Object.keys(expressions).find(
                key => expressions[key] === maxValue
              );
              const { x, y } = det.detection.box;
              ctx.font = '20px Arial';
              ctx.fillStyle = '#00FF00';
              ctx.fillText(
                `${maxKey} (${(maxValue * 100).toFixed(1)}%)`,
                x,
                y > 20 ? y - 10 : y + 25
              );
            }
          });
        }
      }
    };

    intervalRef.current = setInterval(detect, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [detecting, showExpressions]);

  const handleToggleDetection = () => {
    setDetecting(prev => !prev);
  };

  const handleToggleExpressions = () => {
    setShowExpressions(prev => !prev);
  };

  return (
    <div className="app-center">
      <header>
        <h2 className="main-heading">
          Real-time Face & Expression Recognition
        </h2>
        <div className="video-container">
          <video
            ref={videoRef}
            autoPlay
            muted
            width="720"
            height="560"
            style={{ position: 'absolute', left: 0, top: 0, borderRadius: '12px' }}
          />
          <canvas
            ref={canvasRef}
            width="720"
            height="560"
            style={{ position: 'absolute', left: 0, top: 0, borderRadius: '12px' }}
          />
        </div>
        <div className="controls">
          <button className="styled-btn" onClick={handleToggleDetection}>
            {detecting ? 'Stop Detection' : 'Start Detection'}
          </button>
          <button className="styled-btn" onClick={handleToggleExpressions}>
            {showExpressions ? 'Hide Expressions' : 'Show Expressions'}
          </button>
          <div className="face-count">
            Faces detected: {faceCount}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;