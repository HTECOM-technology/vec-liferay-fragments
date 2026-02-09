import React, { useEffect, useRef, useState } from 'react';
import IncidentInfoCard from './IncidentInfoCard';

const GoogleMap = ({ route, options, onCameraClick, onIncidentClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowsRef = useRef([]);
  const [hoveredIncident, setHoveredIncident] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  /**
   * Load Google Maps script
   */
  useEffect(() => {
    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB1hMVFgbfsjv4AMtE0T3eoQds-TuZQkrY';
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    script.onerror = () => console.error('Failed to load Google Maps');

    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  /**
   * Initialize Google Map
   */
  const initMap = () => {
    if (!mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 10,
      center: { lat: 10.8231, lng: 106.6297 },
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: 'poi',
          stylers: [{ visibility: 'off' }],
        },
      ],
    });

    mapInstanceRef.current = map;
    directionsServiceRef.current = new window.google.maps.DirectionsService();
    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#E31C2A',
        strokeWeight: 5,
        strokeOpacity: 0.8,
      },
    });
  };

  /**
   * Update map when route changes
   */
  useEffect(() => {
    if (!route || !mapInstanceRef.current) return;

    displayRoute(route);
  }, [route]);

  /**
   * Update markers when options change
   */
  useEffect(() => {
    if (!route || !mapInstanceRef.current) return;

    updateMarkers(route);
  }, [options, route]);

  /**
   * Display route on map
   */
  const displayRoute = (routeData) => {
    if (!routeData || !routeData.mapData || !directionsServiceRef.current) return;

    const { origin, destination, waypoints } = routeData.mapData;

    const googleWaypoints = waypoints
      ? waypoints.map((wp) => ({
          location: new window.google.maps.LatLng(wp.lat, wp.lng),
          stopover: true,
        }))
      : [];

    const request = {
      origin: new window.google.maps.LatLng(origin.lat, origin.lng),
      destination: new window.google.maps.LatLng(destination.lat, destination.lng),
      waypoints: googleWaypoints,
      travelMode: window.google.maps.TravelMode.DRIVING,
      optimizeWaypoints: false,
    };

    directionsServiceRef.current.route(request, (result, status) => {
      if (status === 'OK') {
        directionsRendererRef.current.setDirections(result);
        setTimeout(() => updateMarkers(routeData), 300);
      } else {
        console.error('Directions request failed:', status);
      }
    });
  };

  /**
   * Clear all markers
   */
  const clearMarkers = () => {
    markersRef.current.forEach((markerObj) => {
      markerObj.marker.setMap(null);
    });
    markersRef.current = [];

    infoWindowsRef.current.forEach((infoWindow) => {
      infoWindow.close();
    });
    infoWindowsRef.current = [];
  };

  /**
   * Update markers based on options
   */
  const updateMarkers = (routeData) => {
    if (!routeData || !routeData.mapData) return;

    clearMarkers();

    const {
      tollLocations,
      restLocations,
      cameraLocations,
      incidentLocations,
    } = routeData.mapData;

    // Toll stations
    if (options.toll && tollLocations?.length) {
      tollLocations.forEach((toll) => {
        createMarker({
          position: { lat: toll.lat, lng: toll.lng },
          title: toll.name,
          icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          type: 'toll',
          data: toll,
        });
      });
    }

    // Rest stations
    if (options.stop && restLocations?.length) {
      restLocations.forEach((rest) => {
        createMarker({
          position: { lat: rest.lat, lng: rest.lng },
          title: rest.name,
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          type: 'rest',
          data: rest,
        });
      });
    }

    // Cameras
    if (options.camera && cameraLocations?.length) {
      cameraLocations.forEach((camera) => {
        createMarker({
          position: { lat: camera.lat, lng: camera.lng },
          title: camera.name,
          icon: {
            url: 'https://res.cloudinary.com/drwairjk5/image/upload/v1767820122/Group_1000002467_wkbbsl.svg',
            scaledSize: new window.google.maps.Size(40, 40),
          },
          type: 'camera',
          data: camera,
        });
      });
    }

    // Incidents
    if (options.incident && incidentLocations?.length) {
      incidentLocations.forEach((incident) => {
        createMarker({
          position: { lat: incident.lat, lng: incident.lng },
          title: incident.title,
          icon: {
            url: getIncidentIcon(incident.severity),
            scaledSize: new window.google.maps.Size(40, 40),
          },
          type: 'incident',
          data: incident,
        });
      });
    }
  };

  /**
   * Get incident icon based on severity
   */
  const getIncidentIcon = (severity) => {
    switch (severity) {
      case 'high':
        return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="%23d32f2f"/><text x="20" y="28" font-size="20" text-anchor="middle" fill="white">⚠</text></svg>';
      case 'medium':
        return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="%23f57c00"/><text x="20" y="28" font-size="20" text-anchor="middle" fill="white">⚠</text></svg>';
      case 'low':
        return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="%23388e3c"/><text x="20" y="28" font-size="20" text-anchor="middle" fill="white">ℹ</text></svg>';
      default:
        return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    }
  };

  /**
   * Create marker on map
   */
  const createMarker = ({ position, title, icon, type, data }) => {
    const marker = new window.google.maps.Marker({
      position,
      map: mapInstanceRef.current,
      title,
      icon,
      zIndex: type === 'incident' ? 1000 : 100,
    });

    const infoWindow = new window.google.maps.InfoWindow({
      content: getInfoWindowContent(type, data),
    });

    // Handle marker click
    marker.addListener('click', () => {
      closeAllInfoWindows();
      infoWindow.open(mapInstanceRef.current, marker);

      if (type === 'camera' && onCameraClick) {
        onCameraClick(data);
      } else if (type === 'incident' && onIncidentClick) {
        onIncidentClick(data);
      }
    });

    // Handle incident hover
    if (type === 'incident') {
      marker.addListener('mouseover', (e) => {
        const projection = mapInstanceRef.current.getProjection();
        const bounds = mapInstanceRef.current.getBounds();
        
        if (projection && bounds) {
          const point = projection.fromLatLngToPoint(position);
          const scale = Math.pow(2, mapInstanceRef.current.getZoom());
          const pixelPosition = new window.google.maps.Point(
            point.x * scale,
            point.y * scale
          );

          setHoveredIncident(data);
          setHoverPosition({
            x: e.domEvent.clientX,
            y: e.domEvent.clientY - 20,
          });
        }
      });

      marker.addListener('mouseout', () => {
        setHoveredIncident(null);
      });
    }

    markersRef.current.push({ marker, infoWindow, type });
    infoWindowsRef.current.push(infoWindow);
  };

  /**
   * Get info window content based on marker type
   */
  const getInfoWindowContent = (type, data) => {
    switch (type) {
      case 'toll':
        return `<div style="padding: 8px;"><strong>🚦 ${data.name}</strong></div>`;
      case 'rest':
        return `<div style="padding: 8px;"><strong>☕ ${data.name}</strong></div>`;
      case 'camera':
        return `
          <div style="padding: 8px; min-width: 160px;">
            <strong>📹 ${data.name}</strong><br/>
            ${data.videoUrl ? '<small style="color: #0090cf; cursor: pointer;">Click để xem trực tiếp</small>' : '<small>Không có video</small>'}
          </div>
        `;
      case 'incident':
        return `
          <div style="padding: 8px; min-width: 180px;">
            <strong style="color: #d32f2f;">🚨 Sự cố giao thông</strong><br/>
            <small>${data.title}</small><br/>
            <small style="color: #0090cf; cursor: pointer; margin-top: 4px; display: inline-block;">Xem chi tiết →</small>
          </div>
        `;
      default:
        return `<div style="padding: 8px;"><strong>${data.name || 'Marker'}</strong></div>`;
    }
  };

  /**
   * Close all info windows
   */
  const closeAllInfoWindows = () => {
    infoWindowsRef.current.forEach((infoWindow) => infoWindow.close());
  };

  return (
    <>
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '8px',
        }}
      />

      {/* Incident hover card */}
      {hoveredIncident && (
        <IncidentInfoCard incident={hoveredIncident} position={hoverPosition} />
      )}
    </>
  );
};

export default GoogleMap;