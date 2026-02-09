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

const CameraModal = ({ cameraName, videoUrl, onClose }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && videoUrl) {
      videoRef.current.load();
    }
  }, [videoUrl]);

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
          <video ref={videoRef} controls autoPlay>
            <source src={videoUrl} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        </VideoContainer>

        <CameraTitle>{cameraName}</CameraTitle>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CameraModal;