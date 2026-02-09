import React from 'react';
import GoogleMap from './GoogleMap';
import { MapContainer } from '../style';

const MapSection = ({ route, options, onCameraClick, onIncidentClick }) => {
  return (
    <MapContainer>
      <GoogleMap
        route={route}
        options={options}
        onCameraClick={onCameraClick}
        onIncidentClick={onIncidentClick}
      />
    </MapContainer>
  );
};

export default MapSection;