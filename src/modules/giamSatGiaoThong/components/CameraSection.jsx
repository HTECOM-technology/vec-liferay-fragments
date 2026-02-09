import React from 'react';
import {
  DetailContainer,
  DetailImage,
  DetailTitle,
  DetailLocation,
  Divider,
  CameraContent,
  CameraBox,
  CameraLabel,
  PlayButton,
} from '../style';

const CameraSection = ({ route, cameras, onCameraClick }) => {
  if (!route) {
    return (
      <DetailContainer>
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          Chọn một tuyến đường để xem chi tiết
        </div>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      <DetailImage src={route.img} alt={route.title} />
      <DetailTitle>{route.title}</DetailTitle>
      <DetailLocation>📍 {route.location}</DetailLocation>

      <Divider />

      <div style={{ padding: '0 10px' }}>
        <p style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 10px 0' }}>
          Camera trực tuyến
        </p>
      </div>

      <Divider />

      <CameraContent>
        {cameras.length > 0 ? (
          cameras.map((camera) => (
            <CameraBox key={camera.live_camera_id} onClick={() => onCameraClick(camera)}>
              <CameraLabel>{camera.name}</CameraLabel>
              <video className="camera-video-thumbnail" autoPlay muted loop playsInline>
                <source src={camera.video_url} type="video/mp4" />
              </video>
              <PlayButton>
                <img
                  src="https://res.cloudinary.com/drwairjk5/image/upload/v1767609285/Variant3_e7bc0u.svg"
                  alt="Play"
                />
              </PlayButton>
            </CameraBox>
          ))
        ) : (
          <div style={{ padding: '20px', color: '#666', width: '100%' }}>
            Không có camera trực tuyến
          </div>
        )}
      </CameraContent>
    </DetailContainer>
  );
};

export default CameraSection;