import React from 'react';
import './components.css';

function SnapshotDisplay({ snapshot }) {
  if (!snapshot) return null;
  return (
    <div className="snapshot-display">
      <h3 className="snapshot-title">Snapshot</h3>
      <img
        src={snapshot}
        alt="Snapshot"
        className="snapshot-image"
      />
    </div>
  );
}

export default SnapshotDisplay;