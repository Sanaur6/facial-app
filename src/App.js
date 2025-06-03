import React from 'react';
import './App.css';
import { useFaceApp } from './hooks/useFaceApp';
import VideoFeed from './components/VideoFeed';
import Controls from './components/Controls';
import SnapshotDisplay from './components/SnapshotDisplay';
import UploadResult from './components/UploadResult';

function App() {
  const {
    videoRef,
    canvasRef,
    detecting,
    faceCount,
    showExpressions,
    snapshot,
    uploadedResult,
    setFaceCount,
    handleToggleDetection,
    handleToggleExpressions,
    handleSnapshot,
    handleUploadSnapshot
  } = useFaceApp();

  return (
    <div className="app-center">
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
        <SnapshotDisplay snapshot={snapshot} />
        <UploadResult uploadedResult={uploadedResult} />
      </header>
    </div>
  );
}

export default App;