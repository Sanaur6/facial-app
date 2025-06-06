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
      <button
        className="styled-btn"
        onClick={onToggleExpressions}
        disabled={!detecting}
      >
        {showExpressions ? 'Hide Expressions' : 'Show Expressions'}
      </button>
      <button
        className="styled-btn"
        onClick={onSnapshot}
        disabled={!detecting}
      >
        Take Snapshot
      </button>
      <label
        htmlFor="upload-snapshot"
        className={`styled-btn${!detecting ? ' disabled' : ''}`}
        style={{ cursor: detecting ? 'pointer' : 'not-allowed', marginBottom: 0 }}
      >
        Upload Snapshot
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          id="upload-snapshot"
          onChange={onUpload}
          disabled={!detecting}
        />
      </label>
      <div className="face-count">
        Faces detected: {faceCount}
      </div>
    </div>
  );
}

export default Controls;