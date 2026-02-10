import React, { useState } from 'react';
import {
  DetailContainer,
  DetailImage,
  DetailTitle,
  DetailLocation,
  Divider,
  TabSelect,
  Tab,
  TabContent,
  CameraContent,
  CameraBox,
  CameraLabel,
  PlayButton,
  ViolationList,
  ViolationItem,
  ViolationImage,
  ViolationInfo,
  ViolationTitle,
  ViolationTime,
  ViolationType,
} from '../style';

const DetailSection = ({ route, cameras, violations, onCameraClick, onViolationClick }) => {
  const [activeTab, setActiveTab] = useState('camera');

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

      {/* Tabs */}
      <TabSelect>
        <Tab 
          active={activeTab === 'camera'} 
          onClick={() => setActiveTab('camera')}
        >
          📹 Camera
        </Tab>
        <Tab 
          active={activeTab === 'violation'} 
          onClick={() => setActiveTab('violation')}
        >
          🚨 Vi phạm ATGT
        </Tab>
      </TabSelect>

      <Divider style={{ margin: '0' }} />

      {/* Tab Content */}
      <TabContent>
        {activeTab === 'camera' ? (
          <>
            <div style={{ padding: '10px 10px 0 10px' }}>
              <p style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 10px 0' }}>
                Camera trực tuyến
              </p>
            </div>

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
                <div style={{ padding: '20px', color: '#666', width: '100%', textAlign: 'center' }}>
                  Không có camera trực tuyến
                </div>
              )}
            </CameraContent>
          </>
        ) : (
          <>
            <div style={{ padding: '10px 10px 0 10px' }}>
              <p style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 10px 0' }}>
                Vi phạm giao thông
              </p>
            </div>

            <ViolationList>
              {violations && violations.length > 0 ? (
                violations.map((violation) => (
                  <ViolationItem 
                    key={violation.id} 
                    onClick={() => onViolationClick && onViolationClick(violation)}
                  >
                    <ViolationImage src={violation.image} alt={violation.title} />
                    <ViolationInfo>
                      <ViolationType severity={violation.severity}>
                        {violation.type || 'Vi phạm'}
                      </ViolationType>
                      <ViolationTitle>{violation.title}</ViolationTitle>
                      <ViolationTime>⏱ {violation.timestamp}</ViolationTime>
                    </ViolationInfo>
                  </ViolationItem>
                ))
              ) : (
                <div style={{ padding: '20px', color: '#666', width: '100%', textAlign: 'center' }}>
                  Không có vi phạm
                </div>
              )}
            </ViolationList>
          </>
        )}
      </TabContent>
    </DetailContainer>
  );
};

export default DetailSection;