import React from 'react';
import './components.css'; // Import the CSS for this component
import { useVideoDetection } from '../hooks/useVideoDetection';

function VideoFeed({ videoRef, canvasRef, detecting, showExpressions, setFaceCount }) {
  useVideoDetection({ videoRef, canvasRef, detecting, showExpressions, setFaceCount });

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        autoPlay
        muted
        width="720"
        height="560"
        className="video-element"
      />
      <canvas
        ref={canvasRef}
        width="720"
        height="560"
        className="canvas-element"
      />
    </div>
  );
}

export default VideoFeed;