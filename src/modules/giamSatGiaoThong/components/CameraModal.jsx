import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalContent = styled.div`
  position: relative;
  background: white;
  border-radius: 8px;
  max-width: 1000px;
  width: 100%;
  padding: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #e31c2a;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: background 0.2s;

  &:hover {
    background: #c71824;
  }
`;

const VideoContainer = styled.div`
  position: relative;
  background: black;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 16/9;
  margin-bottom: 20px;

  video {
    width: 100%;
    height: 100%;
  }
`;

const CameraTitle = styled.h3`
  margin: 0;
  padding: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const CameraStatus = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: white;
  background: rgba(0, 0, 0, 0.35);
  font-size: 14px;
  text-align: center;
`;

const CAMERA_API_URL = 'https://portal.tctvec.vn/o/its/api/cameras';
const HLS_JS_URL = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js';
const HLS_ATTACH_RETRY_COUNT = 3;
const HLS_ATTACH_RETRY_DELAY_MS = 1200;

let hlsScriptPromise = null;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withCacheBust(url) {
  const value = Date.now().toString();

  try {
    const parsedUrl = new URL(url, window.location.href);
    parsedUrl.searchParams.set('_', value);
    return parsedUrl.href;
  } catch (error) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}_=${encodeURIComponent(value)}`;
  }
}

function loadHlsScript() {
  if (window.Hls) return Promise.resolve();
  if (hlsScriptPromise) return hlsScriptPromise;

  hlsScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = HLS_JS_URL;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Không tải được HLS.js'));
    document.head.appendChild(script);
  });

  return hlsScriptPromise;
}

function createCacheBustingHlsLoader() {
  const BaseLoader = window.Hls?.DefaultConfig?.loader;
  if (!BaseLoader) return undefined;

  return class CacheBustingHlsLoader extends BaseLoader {
    load(context, config, callbacks) {
      if (context && (context.type === 'manifest' || context.type === 'level')) {
        context.url = withCacheBust(context.url);
      }

      super.load(context, config, callbacks);
    }
  };
}

async function startCameraWatch(camera) {
  const cameraId = camera.camera_id || camera.id;
  const response = await fetch(withCacheBust(`${CAMERA_API_URL}/${encodeURIComponent(cameraId)}/watch/start`), {
    method: 'POST',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    throw new Error(`Watch start error: ${response.status}`);
  }

  const data = await response.json();
  if (!data.hls_url) {
    throw new Error('Camera chưa có luồng HLS');
  }

  return data;
}

function startCameraHeartbeat(cameraId, sessionId) {
  return setInterval(() => {
    fetch(`${CAMERA_API_URL}/${encodeURIComponent(cameraId)}/watch/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    }).catch((error) => {
      console.error('Camera heartbeat failed:', error);
    });
  }, 30000);
}

async function attachHlsStream(video, hlsUrl) {
  await loadHlsScript();

  if (window.Hls?.isSupported()) {
    const CacheBustingHlsLoader = createCacheBustingHlsLoader();
    const hls = new window.Hls({
      loader: CacheBustingHlsLoader,
      lowLatencyMode: true,
      liveSyncDurationCount: 2,
      manifestLoadingMaxRetry: 6,
      manifestLoadingRetryDelay: 500,
      levelLoadingMaxRetry: 6,
      levelLoadingRetryDelay: 500,
      fragLoadingMaxRetry: 6,
      fragLoadingRetryDelay: 500,
      xhrSetup(xhr) {
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('Pragma', 'no-cache');
      },
    });

    hls.loadSource(hlsUrl);
    hls.attachMedia(video);
    hls.on(window.Hls.Events.ERROR, function (_, data) {
      if (!data.fatal) return;

      if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
        hls.startLoad();
        return;
      }

      if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
        hls.recoverMediaError();
        return;
      }

      hls.destroy();
    });

    return hls;
  }

  video.src = withCacheBust(hlsUrl);
  return null;
}

async function attachHlsStreamWithRetry(video, hlsUrl) {
  let lastError;

  for (let attempt = 1; attempt <= HLS_ATTACH_RETRY_COUNT; attempt += 1) {
    try {
      return await attachHlsStream(video, hlsUrl);
    } catch (error) {
      lastError = error;
      video.pause();
      video.removeAttribute('src');
      video.load();
      if (attempt < HLS_ATTACH_RETRY_COUNT) {
        await delay(HLS_ATTACH_RETRY_DELAY_MS);
      }
    }
  }

  throw lastError;
}

const CameraModal = ({ camera, cameraName, onClose }) => {
  const videoRef = useRef(null);
  const sessionRef = useRef(null);
  const [status, setStatus] = React.useState('Đang tải luồng camera...');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    let isCurrent = true;
    const video = videoRef.current;

    const releaseSession = () => {
      const session = sessionRef.current;
      sessionRef.current = null;

      if (session?.heartbeatTimer) {
        clearInterval(session.heartbeatTimer);
      }

      if (session?.hls) {
        session.hls.destroy();
      }

      if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
    };

    const openStream = async () => {
      if (!video || !camera) return;

      releaseSession();
      setStatus('Đang tải luồng camera...');

      try {
        const watchData = await startCameraWatch(camera);
        if (!isCurrent) return;

        setStatus('Đang mở luồng camera...');
        const hls = await attachHlsStreamWithRetry(video, watchData.hls_url);
        if (!isCurrent) {
          if (hls) hls.destroy();
          return;
        }

        const cameraId = camera.camera_id || camera.id;
        const heartbeatTimer = startCameraHeartbeat(cameraId, watchData.session_id);
        sessionRef.current = {
          heartbeatTimer,
          hls,
        };

        setStatus('');
        video.play().catch(() => {});
      } catch (error) {
        console.error('Error opening camera:', error);
        if (isCurrent) {
          setStatus('Không mở được luồng camera');
        }
      }
    };

    openStream();

    return () => {
      isCurrent = false;
      releaseSession();
    };
  }, [camera]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>

        <VideoContainer>
          <video ref={videoRef} controls autoPlay muted playsInline>
            Trình duyệt của bạn không hỗ trợ video.
          </video>
          {status && <CameraStatus>{status}</CameraStatus>}
        </VideoContainer>

        <CameraTitle>{cameraName || camera?.name || 'Camera'}</CameraTitle>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CameraModal;
