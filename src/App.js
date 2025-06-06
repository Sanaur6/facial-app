import React, { useState } from 'react';
import './App.css';
import { useFaceApp } from './hooks/useFaceApp';
import Navbar from './components/Navbar';
import VideoFeed from './components/VideoFeed';
import Controls from './components/Controls';
import SnapshotDisplay from './components/SnapshotDisplay';
import UploadResult from './components/UploadResult';
import ExportResults from './components/ExportResults';

function App() {
  const [theme, setTheme] = useState('light');
  const {
    videoRef,
    canvasRef,
    detecting,
    faceCount,
    showExpressions,
    snapshot,
    uploadedResult,
    latestDetections,
    setFaceCount,
    handleToggleDetection,
    handleToggleExpressions,
    handleSnapshot,
    handleUploadSnapshot
  } = useFaceApp();

  // Toggle theme handler
  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.body.setAttribute('data-theme', theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`app-center ${theme}`}>
      <Navbar theme={theme} onThemeToggle={handleThemeToggle} />
      <header>
        <h2 className="main-heading">
          Real-time Face & Expression Recognition
        </h2>
        <VideoFeed
          videoRef={videoRef}
          canvasRef={canvasRef}
          detecting={detecting}
          showExpressions={showExpressions}
          setFaceCount={setFaceCount}
        />
        <Controls
          detecting={detecting}
          showExpressions={showExpressions}
          faceCount={faceCount}
          onToggleDetection={handleToggleDetection}
          onToggleExpressions={handleToggleExpressions}
          onSnapshot={handleSnapshot}
          onUpload={handleUploadSnapshot}
        />
        <ExportResults
  detections={latestDetections}
  disabled={!latestDetections || !latestDetections.length}
/>
        <SnapshotDisplay snapshot={snapshot} />
        <UploadResult uploadedResult={uploadedResult} />
      </header>
    </div>
  );
}

export default App;