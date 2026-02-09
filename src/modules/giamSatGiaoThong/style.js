import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
`;

export const TabContainer = styled.div`
  max-width: 1400px;
  width: 100%;
  border: 1px solid #e4e4e4;
  border-radius: 6px;
  background: white;

  @media (max-width: 1366px) {
    max-width: 1200px;
  }

  @media (max-width: 1024px) {
    max-width: 100vw;
    border-radius: 0;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 16px 20px;
  border-bottom: 1px solid #e4e4e4;
  background: white;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;
  }
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e1e1e;
  white-space: nowrap;
`;

export const Filters = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 1024px) {
    width: 100%;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    flex-direction: column;

    > * {
      width: 100% !important;
    }
  }
`;

export const ContentTable = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  height: calc(100vh - 180px);
  padding: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    height: auto;
  }
`;

export const MapContainer = styled.div`
  background: #f0f0f0;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  min-height: 500px;
  height: 100%;
`;

// ... rest of the styles remain the same
export const DetailContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 5px;
  border: 1px solid #e4e4e4;
  max-height: calc(100vh - 250px);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const DetailImage = styled.img`
  width: 100%;
  height: 165px;
  min-height: 165px;
  border-radius: 8px;
  margin-bottom: 12px;
  object-fit: cover;

  @media (max-width: 768px) {
    height: 110px;
    min-height: 110px;
  }
`;

export const DetailTitle = styled.h3`
  margin: 5px 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1e1e1e;
`;

export const DetailLocation = styled.p`
  color: #666;
  font-size: 13px;
  margin: 5px 8px;
`;

export const Divider = styled.div`
  height: 1px;
  background: #e4e4e4;
  margin: 15px 0;
`;

export const CameraContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
  max-height: calc(100vh - 450px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export const CameraBox = styled.div`
  position: relative;
  width: calc(50% - 5px);
  aspect-ratio: 1.43939393939;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const CameraLabel = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  background: #0090cf;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  z-index: 2;
`;

export const PlayButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: none;
  border: none;
  cursor: pointer;
  z-index: 2;
  width: 45px;
  height: 45px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
  }

  img {
    width: 45px;
    height: 45px;
  }
`;