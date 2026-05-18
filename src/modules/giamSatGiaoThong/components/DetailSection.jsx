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

const IconLocation = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.46045 13.7175C2.48746 7.95788 1.75 7.36676 1.75 5.25C1.75 2.3505 4.1005 0 7 0C9.8995 0 12.25 2.3505 12.25 5.25C12.25 7.36676 11.5125 7.95788 7.53955 13.7175C7.27882 14.0942 6.72115 14.0941 6.46045 13.7175ZM7 7.4375C8.20813 7.4375 9.1875 6.45813 9.1875 5.25C9.1875 4.04187 8.20813 3.0625 7 3.0625C5.79187 3.0625 4.8125 4.04187 4.8125 5.25C4.8125 6.45813 5.79187 7.4375 7 7.4375Z" fill="#E31C2A" />
  </svg>
);

const IconVipham = ({ color = '#0090CF' }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_10856_16058)">
      <path d="M4.13115 6.4H3.66536H3.19958C1.86028 6.4 0.957303 7.83224 1.48488 9.11975C1.55837 9.2991 1.72699 9.41539 1.91355 9.41539H2.24161C2.35219 9.41539 2.44857 9.49409 2.47539 9.60629L2.89772 11.3731C2.98578 11.7416 3.30228 12 3.66536 12C4.02845 12 4.34495 11.7416 4.43301 11.3731L4.85534 9.60629C4.88216 9.49409 4.97854 9.41539 5.08912 9.41539H5.41718C5.60374 9.41539 5.77236 9.2991 5.84585 9.11975C6.37343 7.83224 5.47045 6.4 4.13115 6.4Z" fill={color} fillOpacity="0.2" />
      <path d="M4.83203 5.2C4.83203 5.86274 4.3097 6.4 3.66536 6.4C3.02103 6.4 2.4987 5.86274 2.4987 5.2C2.4987 4.53726 3.02103 4 3.66536 4C4.3097 4 4.83203 4.53726 4.83203 5.2Z" fill={color} fillOpacity="0.2" />
      <path d="M4.83333 5.2C4.83333 5.86274 4.311 6.4 3.66667 6.4C3.02233 6.4 2.5 5.86274 2.5 5.2C2.5 4.53726 3.02233 4 3.66667 4C4.311 4 4.83333 4.53726 4.83333 5.2Z" fill="white" />
      <path d="M10.6641 3.3335C10.6641 2.39069 10.6641 1.91928 10.957 1.62639C11.2498 1.3335 11.7213 1.3335 12.6641 1.3335C13.6069 1.3335 14.0783 1.3335 14.3712 1.62639C14.6641 1.91928 14.6641 2.39069 14.6641 3.3335C14.6641 4.27631 14.6641 4.74771 14.3712 5.0406C14.0783 5.3335 13.6069 5.3335 12.6641 5.3335C11.7213 5.3335 11.2498 5.3335 10.957 5.0406C10.6641 4.74771 10.6641 4.27631 10.6641 3.3335Z" fill={color} fillOpacity="0.2" />
      <path d="M10.6641 12.6665C10.6641 11.7237 10.6641 11.2523 10.957 10.9594C11.2498 10.6665 11.7213 10.6665 12.6641 10.6665C13.6069 10.6665 14.0783 10.6665 14.3712 10.9594C14.6641 11.2523 14.6641 11.7237 14.6641 12.6665C14.6641 13.6093 14.6641 14.0807 14.3712 14.3736C14.0783 14.6665 13.6069 14.6665 12.6641 14.6665C11.7213 14.6665 11.2498 14.6665 10.957 14.3736C10.6641 14.0807 10.6641 13.6093 10.6641 12.6665Z" fill={color} fillOpacity="0.2" />
      <path d="M3.66536 6.4C4.3097 6.4 4.83203 5.86274 4.83203 5.2C4.83203 4.53726 4.3097 4 3.66536 4C3.02103 4 2.4987 4.53726 2.4987 5.2C2.4987 5.86274 3.02103 6.4 3.66536 6.4ZM3.66536 6.4H3.19958C1.86028 6.4 0.957303 7.83224 1.48488 9.11975C1.55837 9.2991 1.72699 9.41539 1.91355 9.41539H2.24161C2.35219 9.41539 2.44857 9.49409 2.47539 9.60629L2.89772 11.3731C2.98578 11.7416 3.30228 12 3.66537 12C4.02845 12 4.34495 11.7416 4.43301 11.3731L4.85534 9.60629C4.88216 9.49409 4.97854 9.41539 5.08912 9.41539H5.41718C5.60374 9.41539 5.77236 9.2991 5.84585 9.11975C6.37343 7.83224 5.47045 6.4 4.13115 6.4H3.66536Z" stroke={color} strokeWidth="1.5" />
      <path d="M10.6641 3.3335C10.6641 2.39069 10.6641 1.91928 10.957 1.62639C11.2498 1.3335 11.7213 1.3335 12.6641 1.3335C13.6069 1.3335 14.0783 1.3335 14.3712 1.62639C14.6641 1.91928 14.6641 2.39069 14.6641 3.3335C14.6641 4.27631 14.6641 4.74771 14.3712 5.0406C14.0783 5.3335 13.6069 5.3335 12.6641 5.3335C11.7213 5.3335 11.2498 5.3335 10.957 5.0406C10.6641 4.74771 10.6641 4.27631 10.6641 3.3335Z" stroke={color} strokeWidth="1.5" />
      <path d="M10.6641 12.6665C10.6641 11.7237 10.6641 11.2523 10.957 10.9594C11.2498 10.6665 11.7213 10.6665 12.6641 10.6665C13.6069 10.6665 14.0783 10.6665 14.3712 10.9594C14.6641 11.2523 14.6641 11.7237 14.6641 12.6665C14.6641 13.6093 14.6641 14.0807 14.3712 14.3736C14.0783 14.6665 13.6069 14.6665 12.6641 14.6665C11.7213 14.6665 11.2498 14.6665 10.957 14.3736C10.6641 14.0807 10.6641 13.6093 10.6641 12.6665Z" stroke={color} strokeWidth="1.5" />
      <path d="M10.6667 3.3335H10C8.36468 3.45536 8 4.1356 8 6.43535L8 9.56498C8 11.8647 8.36468 12.545 10 12.6668H10.6667" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_10856_16058">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const IconCamera = ({ color = '#0090CF' }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_10856_16055)">
      <path d="M13.6654 5.66667C13.6654 6.58714 12.9192 7.33333 11.9987 7.33333C11.0782 7.33333 10.332 6.58714 10.332 5.66667C10.332 4.74619 11.0782 4 11.9987 4C12.9192 4 13.6654 4.74619 13.6654 5.66667Z" fill={color} fillOpacity="0.2" />
      <path d="M5.66536 5.66667C5.66536 6.58714 4.91917 7.33333 3.9987 7.33333C3.07822 7.33333 2.33203 6.58714 2.33203 5.66667C2.33203 4.74619 3.07822 4 3.9987 4C4.91917 4 5.66536 4.74619 5.66536 5.66667Z" fill={color} fillOpacity="0.2" />
      <path d="M2.3905 9.28383C1.70932 9.63484 -0.0767076 10.3516 1.0111 11.2484C1.54249 11.6865 2.13432 11.9998 2.87839 11.9998H7.12422C7.86829 11.9998 8.46012 11.6865 8.9915 11.2484C10.0793 10.3516 8.29328 9.63484 7.6121 9.28383C6.01473 8.46073 3.98787 8.46073 2.3905 9.28383Z" fill={color} fillOpacity="0.2" />
      <path d="M8.3905 9.28383C7.70932 9.63484 5.92329 10.3516 7.0111 11.2484C7.54249 11.6865 8.13432 11.9998 8.87839 11.9998H13.1242C13.8683 11.9998 14.4601 11.6865 14.9915 11.2484C16.0793 10.3516 14.2933 9.63484 13.6121 9.28383C12.0147 8.46073 9.98787 8.46073 8.3905 9.28383Z" fill={color} fillOpacity="0.2" />
      <path d="M13.8494 12C14.3489 12 14.7462 11.6856 15.103 11.2461C15.8333 10.3463 14.6342 9.62723 14.1769 9.27507C13.712 8.91708 13.1929 8.71428 12.6667 8.66667M12 7.33333C12.9205 7.33333 13.6667 6.58714 13.6667 5.66667C13.6667 4.74619 12.9205 4 12 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2.15194 12C1.65241 12 1.25508 11.6856 0.898333 11.2461C0.168028 10.3463 1.36708 9.62723 1.8244 9.27507C2.28929 8.91708 2.80836 8.71428 3.33464 8.66667M3.66797 7.33333C2.74749 7.33333 2.0013 6.58714 2.0013 5.66667C2.0013 4.74619 2.74749 4 3.66797 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5.3905 10.0743C4.70932 10.4955 2.92329 11.3556 4.0111 12.4318C4.54249 12.9575 5.13432 13.3335 5.87839 13.3335H10.1242C10.8683 13.3335 11.4601 12.9575 11.9915 12.4318C13.0793 11.3556 11.2933 10.4955 10.6121 10.0743C9.01473 9.08657 6.98787 9.08657 5.3905 10.0743Z" fill={color} fillOpacity="0.2" />
      <path d="M5.3905 10.0743C4.70932 10.4955 2.92329 11.3556 4.0111 12.4318C4.54249 12.9575 5.13432 13.3335 5.87839 13.3335H10.1242C10.8683 13.3335 11.4601 12.9575 11.9915 12.4318C13.0793 11.3556 11.2933 10.4955 10.6121 10.0743C9.01473 9.08657 6.98787 9.08657 5.3905 10.0743Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.3346 4.99984C10.3346 6.2885 9.28997 7.33317 8.0013 7.33317C6.71264 7.33317 5.66797 6.2885 5.66797 4.99984C5.66797 3.71117 6.71264 2.6665 8.0013 2.6665C9.28997 2.6665 10.3346 3.71117 10.3346 4.99984Z" fill={color} fillOpacity="0.2" />
      <path d="M10.3346 4.99984C10.3346 6.2885 9.28997 7.33317 8.0013 7.33317C6.71264 7.33317 5.66797 6.2885 5.66797 4.99984C5.66797 3.71117 6.71264 2.6665 8.0013 2.6665C9.28997 2.6665 10.3346 3.71117 10.3346 4.99984Z" stroke={color} strokeWidth="1.5" />
    </g>
    <defs>
      <clipPath id="clip0_10856_16055">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

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
      <DetailLocation> <IconLocation /> {route.location}</DetailLocation>

      <Divider />

      {/* Tabs */}
      <TabSelect>
        <Tab
          active={activeTab === 'camera'}
          onClick={() => setActiveTab('camera')}
        >
          <IconCamera color={activeTab === 'camera' ? '#fff' : '#0090CF'} /> Camera
        </Tab>
        <Tab
          active={activeTab === 'violation'}
          onClick={() => setActiveTab('violation')}
        >
          <IconVipham color={activeTab === 'violation' ? '#fff' : '#0090CF'} /> Vi phạm ATGT
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