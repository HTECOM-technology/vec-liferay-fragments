import React, { useState } from 'react';
import styled from 'styled-components';

const Panel = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 231px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 16px;
  z-index: 50;
  transition: all 0.3s ease;

  &.hidden {
    display: none;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #1e1e1e;
  }
`;

const CloseBtn = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: #f5f5f5;
  }

  svg {
    width: 20px;
    height: 20px;
    color: #666;
  }
`;

const Section = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: #1e1e1e;
  }
`;

const MapLayers = styled.div`
  display: flex;
  gap: 12px;
`;

const LayerCard = styled.div`
  flex: 1;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  .layer-preview {
    width: 100%;
    height: 64px;
    border-radius: 8px;
    border: 2px solid ${props => props.active ? '#0090cf' : '#e0e0e0'};
    margin-bottom: 8px;
    overflow: hidden;
    transition: border-color 0.2s;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  span {
    font-size: 12px;
    color: ${props => props.active ? '#0090cf' : '#666'};
    font-weight: ${props => props.active ? '600' : '400'};
  }
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OptionItem = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: #f5f5f5;
  }
`;

const IconBox = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: ${props => props.checked ? '#e3f2fd' : '#f5f5f5'};
  transition: background 0.2s;

  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.checked ? '#0090cf' : '#666'};
  }
`;

const OptionLabel = styled.span`
  flex: 1;
  font-size: 14px;
  color: ${props => props.checked ? '#0090cf' : '#1e1e1e'};
  font-weight: ${props => props.checked ? '600' : '400'};
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #0090cf;
`;

const OpenButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
    transform: scale(1.05);
  }

  &.hidden {
    display: none;
  }

  svg {
    width: 24px;
    height: 24px;
    color: #666;
  }
`;

const SettingsPanel = ({ options, onOptionsChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [mapLayer, setMapLayer] = useState('street');

  const displayOptions = [
    {
      id: 'route',
      title: 'Hiển thị tuyến',
      icon: (
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M8.401 1.666C4.559 2.446 1.667 5.843 1.667 9.915C1.667 14.564 5.436 18.333 10.085 18.333C14.157 18.333 17.554 15.441 18.334 11.599" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 'toll',
      title: 'Hiển thị trạm thu phí',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      )
    },
    {
      id: 'stop',
      title: 'Hiển thị điểm dừng',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
        </svg>
      )
    },
    {
      id: 'incident',
      title: 'Sự cố giao thông',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
      )
    },
    {
      id: 'camera',
      title: 'Camera trực tuyến',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
      )
    },
  ];

  const handleOptionChange = (optionId, checked) => {
    onOptionsChange({
      ...options,
      [optionId]: checked,
    });
  };

  return (
    <>
      <Panel className={!isOpen ? 'hidden' : ''}>
        <Header>
          <HeaderTitle>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 14C12.6569 14 14 12.6569 14 11C14 9.34315 12.6569 8 11 8C9.34315 8 8 9.34315 8 11C8 12.6569 9.34315 14 11 14Z" stroke="#1E1E1E" strokeWidth="2"/>
            </svg>
            <h3>Tùy chỉnh</h3>
          </HeaderTitle>
          <CloseBtn onClick={() => setIsOpen(false)}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </CloseBtn>
        </Header>

        <Section>
          <h4>Lớp bản đồ</h4>
          <MapLayers>
            <LayerCard active={mapLayer === 'street'} onClick={() => setMapLayer('street')}>
              <div className="layer-preview">
                <img src="https://www.google.com/maps/vt/pb=!1m5!1m4!1i10!2i1624!3i901!4i128!2m2!1e0!3i761999999" alt="Street" />
              </div>
              <span>Phố</span>
            </LayerCard>
            <LayerCard active={mapLayer === 'satellite'} onClick={() => setMapLayer('satellite')}>
              <div className="layer-preview">
                <img src="https://www.google.com/maps/vt/pb=!1m5!1m4!1i10!2i1624!3i901!4i128!2m2!1e1!3i1004" alt="Satellite" />
              </div>
              <span>Vệ tinh</span>
            </LayerCard>
          </MapLayers>
        </Section>

        <Section>
          <h4>Hiển thị</h4>
          <OptionsList>
            {displayOptions.map((option) => (
              <OptionItem key={option.id}>
                <IconBox checked={options[option.id]}>
                  {option.icon}
                </IconBox>
                <OptionLabel checked={options[option.id]}>
                  {option.title}
                </OptionLabel>
                <Checkbox
                  type="checkbox"
                  checked={options[option.id]}
                  onChange={(e) => handleOptionChange(option.id, e.target.checked)}
                />
              </OptionItem>
            ))}
          </OptionsList>
        </Section>
      </Panel>

      <OpenButton className={isOpen ? 'hidden' : ''} onClick={() => setIsOpen(true)}>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      </OpenButton>
    </>
  );
};

export default SettingsPanel;