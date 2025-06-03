import { useRef, useEffect, useState } from 'react';
import { loadModels } from '../utils/faceDetection';

export function useFaceApp() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [detecting, setDetecting] = useState(false);
  const [faceCount, setFaceCount] = useState(0);
  const [showExpressions, setShowExpressions] = useState(true);
  const [snapshot, setSnapshot] = useState(null);
  const [uploadedResult, setUploadedResult] = useState(null);

  useEffect(() => {
    const MODEL_URL = process.env.PUBLIC_URL + '/models';
    loadModels(MODEL_URL).then(() => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current.srcObject = stream;
        })
        .catch(err => {
          console.error('Error accessing webcam:', err);
        });
    });

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleToggleDetection = () => setDetecting(prev => !prev);
  const handleToggleExpressions = () => setShowExpressions(prev => !prev);

  const handleSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
    const dataUrl = tempCanvas.toDataURL('image/png');
    setSnapshot(dataUrl);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'snapshot.png';
    link.click();
  };

  const handleUploadSnapshot = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const img = new window.Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      const ctx = tempCanvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const { loadModels } = await import('../utils/faceDetection');
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      await loadModels(MODEL_URL);
      const faceapi = await import('face-api.js');
      const detections = await faceapi.detectAllFaces(tempCanvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      setUploadedResult({ imgSrc: img.src, detections });
    };
  };

  return {
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
  };
}