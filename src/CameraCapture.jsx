import React, { useRef, useEffect } from "react";

export const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    async function startCamera() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play().catch((error) => {
                console.error("Error al reproducir video:", error);
              });
            };
          }
        } catch (error) {
          console.error("Error al acceder a la cámara:", error);
          alert("No se pudo acceder a la cámara.");
          if (onClose) onClose();
        }
      } else {
        alert("Tu navegador no soporta acceso a cámara.");
        if (onClose) onClose();
      }
    }

    startCamera();

    // ✅ Este cleanup es correcto y necesario
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onClose]);

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");

    if (onCapture) onCapture(imageData);
    // Ya no cerramos la cámara aquí, la cierra el padre
  };

  return (
    <div className="camera-capture-container">
      <video
        ref={videoRef}
        style={{ width: "90%", maxHeight: "200px" }}
        playsInline
        muted
      />
      <div style={{ marginTop: 20, marginLeft: 120 }}>
        <button type="button" onClick={capturePhoto} className="button-foto-captura">
          Capturar Foto
        </button>
        <button type="button" onClick={onClose} style={{ marginLeft: 10 }} className="button-foto-captura">
          Cerrar Cámara
        </button>
      </div>
    </div>
  );
};