import React from 'react';
import jsPDF from 'jspdf';

function exportCSV(detections) {
  if (!detections || detections.length === 0) return;
  let csv = 'Face,Expression,Confidence\n';
  detections.forEach((det, idx) => {
    Object.entries(det.expressions).forEach(([exp, val]) => {
      csv += `${idx + 1},${exp},${(val * 100).toFixed(2)}%\n`;
    });
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'face_expressions.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function exportPDF(detections) {
  if (!detections || detections.length === 0) return;
  const doc = new jsPDF();
  doc.text('Face Expression Detection Results', 10, 10);
  let y = 20;
  detections.forEach((det, idx) => {
    doc.text(`Face ${idx + 1}:`, 10, y);
    y += 8;
    Object.entries(det.expressions).forEach(([exp, val]) => {
      doc.text(`- ${exp}: ${(val * 100).toFixed(2)}%`, 14, y);
      y += 7;
    });
    y += 3;
  });
  doc.save('face_expressions.pdf');
}

const ExportResults = ({ detections, disabled }) => (
  <div style={{ display: 'flex', gap: 12, margin: '16px 0' }}>
    <button
      className="styled-btn"
      onClick={() => exportCSV(detections)}
      disabled={disabled}
    >
      Export CSV
    </button>
    <button
      className="styled-btn"
      onClick={() => exportPDF(detections)}
      disabled={disabled}
    >
      Export PDF
    </button>
  </div>
);

export default ExportResults;