import React from 'react';
import './components.css';

function Controls({
  detecting,
  showExpressions,
  faceCount,
  onToggleDetection,
  onToggleExpressions,
  onSnapshot,
  onUpload
}) {
  return (
    <div className="controls">
      <button className="styled-btn" onClick={onToggleDetection}>
        {detecting ? 'Stop Detection' : 'Start Detection'}
      </button>
      <button className="styled-btn" onClick={onToggleExpressions}>
        {showExpressions ? 'Hide Expressions' : 'Show Expressions'}
      </button>
      <button className="styled-btn" onClick={onSnapshot}>
        Take Snapshot
      </button>
      <label htmlFor="upload-snapshot" className="styled-btn" style={{ cursor: 'pointer', marginBottom: 0 }}>
        Upload Snapshot
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          id="upload-snapshot"
          onChange={onUpload}
        />
      </label>
      <div className="face-count">
        Faces detected: {faceCount}
      </div>
    </div>
  );
}

export default Controls;