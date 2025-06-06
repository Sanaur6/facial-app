import React from 'react';
import './components.css';
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
      {!detecting && (
        <div className="camera-overlay">
          <span>Camera is Off<br />Click "Start Detection" to enable</span>
        </div>
      )}
    </div>
  );
}

export default VideoFeed;