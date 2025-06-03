import React from 'react';
import './components.css';

function UploadResult({ uploadedResult }) {
  if (!uploadedResult) return null;
  return (
    <div className="upload-result">
      <h3 className="upload-title">Uploaded Snapshot Result</h3>
      <img
        src={uploadedResult.imgSrc}
        alt="Uploaded Snapshot"
        className="upload-image"
      />
      <div>
        {uploadedResult.detections.length === 0 && <div>No faces detected.</div>}
        {uploadedResult.detections.map((det, idx) => (
          <div key={idx} className="upload-face">
            <strong>Face {idx + 1}:</strong>
            <ul>
              {Object.entries(det.expressions).map(([exp, val]) => (
                <li key={exp}>
                  {exp}: {(val * 100).toFixed(1)}%
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UploadResult;