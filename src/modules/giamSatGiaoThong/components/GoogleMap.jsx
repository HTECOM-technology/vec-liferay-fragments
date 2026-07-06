import React, { useCallback, useEffect, useRef } from 'react';

const GoogleMap = ({ route, options, onCameraClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowsRef = useRef([]);

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
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((markerObj) => {
      markerObj.marker.setMap(null);
    });
    markersRef.current = [];

    infoWindowsRef.current.forEach((infoWindow) => {
      infoWindow.close();
    });
    infoWindowsRef.current = [];
  }, []);

  const closeAllInfoWindows = useCallback(() => {
    infoWindowsRef.current.forEach((infoWindow) => infoWindow.close());
  }, []);

  const getInfoWindowContent = useCallback((type, data) => {
    switch (type) {
      case 'camera':
        const cameraButtonId = `camera-map-open-${data.id || data.camera_id}`;
        return `
          <div style="padding: 8px; min-width: 160px;">
            <strong>📹 ${data.name}</strong><br/>
            ${
              data.id || data.camera_id
                ? `<button
                    id="${cameraButtonId}"
                    type="button"
                    style="margin-top:6px;padding:6px 10px;background:#2563eb;color:white;border:none;border-radius:4px;cursor:pointer"
                  >
                    Xem trực tiếp
                  </button>`
                : '<small style="color: #0090cf;">Camera trên tuyến</small>'
            }
          </div>
        `;
      default:
        return `<div style="padding: 8px;"><strong>${data.name || 'Marker'}</strong></div>`;
    }
  }, []);

  const createMarker = useCallback(({ position, title, icon, type, data }) => {
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

    marker.addListener('click', () => {
      closeAllInfoWindows();
      infoWindow.open(mapInstanceRef.current, marker);
    });

    if (type === 'camera' && onCameraClick) {
      infoWindow.addListener('domready', () => {
        const button = document.getElementById(`camera-map-open-${data.id || data.camera_id}`);
        if (!button || button.dataset.bound === 'true') return;

        button.dataset.bound = 'true';
        button.addEventListener('click', () => {
          onCameraClick(data);
        });
      });
    }

    markersRef.current.push({ marker, infoWindow, type });
    infoWindowsRef.current.push(infoWindow);
  }, [closeAllInfoWindows, getInfoWindowContent, onCameraClick]);

  const updateMarkers = useCallback((routeData) => {
    if (!routeData || !routeData.mapData) return;

    clearMarkers();

    const { cameraLocations, origin, destination } = routeData.mapData;

    if (options.camera && cameraLocations?.length) {
      cameraLocations.forEach((camera) => {
        if (!Number.isFinite(camera.lat) || !Number.isFinite(camera.lng)) return;

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

    if (options.camera && cameraLocations?.length && mapInstanceRef.current) {
      const bounds = new window.google.maps.LatLngBounds();

      markersRef.current.forEach(({ marker }) => {
        bounds.extend(marker.getPosition());
      });

      if (origin) bounds.extend(origin);
      if (destination) bounds.extend(destination);

      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [clearMarkers, createMarker, options.camera]);

  const displayRoute = useCallback((routeData) => {
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
  }, [updateMarkers]);

  useEffect(() => {
    if (!route || !mapInstanceRef.current) return;

    displayRoute(route);
  }, [displayRoute, route]);

  useEffect(() => {
    if (!route || !mapInstanceRef.current) return;

    updateMarkers(route);
  }, [route, updateMarkers]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '8px',
      }}
    />
  );
};

export default GoogleMap;
