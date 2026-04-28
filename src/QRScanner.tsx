import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import './QRScanner.css';

interface QRScannerProps {
  courseName: string;
  onClose: () => void;
}

export function QRScanner({ courseName, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [status, setStatus] = useState<'scanning' | 'detected' | 'error'>('scanning');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let stream: MediaStream | null = null;

    function scan() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(video, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code?.data) {
          setStatus('detected');
          window.open(code.data, '_blank', 'noopener,noreferrer');
          // カメラ停止
          stream?.getTracks().forEach((t) => t.stop());
          setTimeout(onClose, 1200);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(scan);
    }

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          rafRef.current = requestAnimationFrame(scan);
        }
      } catch {
        setStatus('error');
        setErrorMsg('カメラへのアクセスを許可してください');
      }
    }

    startCamera();

    return () => {
      cancelAnimationFrame(rafRef.current);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [onClose]);

  return (
    <div className="qr-overlay" onClick={onClose}>
      <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="qr-header">
          <span className="qr-title">{courseName.split('\n')[0]}</span>
          <button className="qr-close" onClick={onClose}>✕</button>
        </div>

        {status === 'scanning' && (
          <>
            <p className="qr-hint">出席QRコードをかざしてください</p>
            <div className="qr-viewfinder">
              <video ref={videoRef} className="qr-video" playsInline muted />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div className="qr-frame" />
            </div>
          </>
        )}

        {status === 'detected' && (
          <div className="qr-result">
            <span className="qr-check">✓</span>
            <p>QR読み取り完了！</p>
          </div>
        )}

        {status === 'error' && (
          <div className="qr-result qr-result--error">
            <p>{errorMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
}
