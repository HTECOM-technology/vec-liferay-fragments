import React from 'react';
import GoogleMap from './GoogleMap';
import { MapContainer } from '../style';

const MapSection = ({ route, options, onCameraClick }) => {
  return (
    <MapContainer>
      <GoogleMap
        route={route}
        options={options}
        onCameraClick={onCameraClick}
      />
    </MapContainer>
  );
};

export default MapSection;
