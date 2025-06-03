import { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

export function useVideoDetection({ videoRef, canvasRef, detecting, showExpressions, setFaceCount }) {
  const intervalRef = useRef();

  useEffect(() => {
    if (!detecting) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setFaceCount(0);
      return;
    }

    const detect = async () => {
      if (
        videoRef.current &&
        canvasRef.current &&
        faceapi.nets.tinyFaceDetector.params
      ) {
        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceExpressions();

        setFaceCount(detections.length);

        const displaySize = {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        };
        faceapi.matchDimensions(canvasRef.current, displaySize);

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );

        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, displaySize.width, displaySize.height);

        // Draw bounding boxes
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        // Draw landmarks
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

        if (showExpressions) {
          faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

          // Draw most likely expression above each face and all confidences below
          resizedDetections.forEach(det => {
            if (det.expressions) {
              const expressions = det.expressions;
              const maxValue = Math.max(...Object.values(expressions));
              const maxKey = Object.keys(expressions).find(
                key => expressions[key] === maxValue
              );
              const { x, y } = det.detection.box;
              ctx.font = '20px Arial';
              const label = `${maxKey} (${(maxValue * 100).toFixed(1)}%)`;
              const textWidth = ctx.measureText(label).width;
              ctx.globalAlpha = 0.6;
              ctx.fillStyle = '#222';
              ctx.fillRect(x - 2, (y > 20 ? y - 32 : y + 15) - 20, textWidth + 8, 28);
              ctx.globalAlpha = 1.0;
              ctx.fillStyle = '#00FF00';
              ctx.fillText(label, x + 2, y > 20 ? y - 10 : y + 25);

              // Draw all expressions with confidence below the face
              let offsetY = y + det.detection.box.height + 20;
              Object.entries(expressions).forEach(([exp, val], idx) => {
                const expLabel = `${exp}: ${(val * 100).toFixed(1)}%`;
                ctx.font = '14px Arial';
                const expTextWidth = ctx.measureText(expLabel).width;
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = '#fff';
                ctx.fillRect(x - 2, offsetY + idx * 18 - 14, expTextWidth + 8, 18);
                ctx.globalAlpha = 1.0;
                ctx.fillStyle = exp === maxKey ? '#0078d4' : '#444';
                ctx.fillText(expLabel, x + 2, offsetY + idx * 18);
              });
            }
          });
        }
      }
    };

    intervalRef.current = setInterval(detect, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [detecting, showExpressions, setFaceCount, videoRef, canvasRef]);
}