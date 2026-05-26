import React, { useState, useEffect, useCallback } from 'react';
import HeaderSection from './HeaderSection';
import AnalyticsSection from './AnalyticsSection';
import MapSection from './MapSection';
import DetailSection from './DetailSection';
import CameraModal from './CameraModal';
import IncidentModal from './IncidentModal';
import ViolationModal from './ViolationModal';
import { Container, TabContainer, ContentTable } from '../style';

// ============ API CONFIG ============

const API_BASE_URL = '';
const API_HEADERS = {
  accept: 'application/json',
};
const API_HIGHWAYS_URL = `${API_BASE_URL}/o/c/highways/`;
const CAMERA_HIGHWAY_ID = 44147;
const CAMERA_API_URL = 'https://portal.tctvec.vn/o/its/api/cameras';

const DEFAULT_ANALYTICS = {
  violations: 0,
  avgSpeed: 0,
  animals: 0,
  brokenCameras: 0,
};

async function fetchHighwaysData() {
  try {
    const response = await fetch(API_HIGHWAYS_URL, {
      method: 'GET',
      headers: API_HEADERS,
    });

    if (!response.ok) {
      throw new Error(`Highways API error: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching highways data:', error);
    return [];
  }
}

async function fetchTollDetail(highwayId) {
  try {
    const response = await fetch(`${API_BASE_URL}/o/c/highways/${highwayId}/stationInfoAndHighwayFK`, {
      method: 'GET',
      headers: API_HEADERS,
    });

    if (!response.ok) {
      throw new Error(`Toll detail API error: ${response.status}`);
    }

    const data = await response.json();
    return (data.items || [])
      .map((item) => ({
        lat: Number(item.lat),
        lng: Number(item.lng),
        name: item.name,
        id: item.id,
        img: item.image?.link?.href
          ? `${API_BASE_URL}${item.image.link.href}`
          : '',
        address: item.location || item.name,
        status: 'Mở cả ngày',
        type: item.type?.key || 'tollStation',
        fees: [],
      }))
      .filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng));
  } catch (error) {
    console.error(`Error fetching toll details for highway ${highwayId}:`, error);
    return [];
  }
}

function withCacheBust(url) {
  const value = Date.now().toString();

  try {
    const parsedUrl = new URL(url, window.location.href);
    parsedUrl.searchParams.set('_', value);
    return parsedUrl.href;
  } catch (error) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}_=${encodeURIComponent(value)}`;
  }
}

async function fetchCameras() {
  const response = await fetch(withCacheBust(CAMERA_API_URL), {
    method: 'GET',
    cache: 'no-store',
    headers: API_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`Camera API error: ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data.items) ? data.items : [];
}

function getCameraCoordinate(camera, keys) {
  for (const key of keys) {
    const value = Number(camera[key]);
    if (Number.isFinite(value)) return value;
  }

  return null;
}

function mapCameraLocation(camera) {
  const lat = getCameraCoordinate(camera, ['lat', 'latitude', 'camera_lat', 'cameraLatitude']);
  const lng = getCameraCoordinate(camera, ['lng', 'long', 'lon', 'longitude', 'camera_lng', 'camera_long', 'cameraLongitude']);

  if (lat === null || lng === null) return null;

  return {
    ...camera,
    lat,
    lng,
    id: camera.camera_id,
    name: camera.name || 'Camera',
  };
}

function mapApiDataToRouteData(apiItems) {
  return apiItems.map((item) => {
    const locationParts = (item.location || '').split(' - ');
    const startName = locationParts[0] || '';
    const endName = locationParts[locationParts.length - 1] || '';
    const startLat = Number(item.startLat) || 0;
    const startLng = Number(item.startLng) || 0;
    const endLat = Number(item.endLat) || 0;
    const endLng = Number(item.endLng) || 0;
    const drivingLanes = item.drivingLaneNum || '';
    const emergencyLanes = item.emergencyLaneNum || '';
    const lanesInfo = drivingLanes
      ? `${drivingLanes} làn xe chạy${emergencyLanes ? `, ${emergencyLanes} làn dừng khẩn cấp` : ''}`
      : '';

    return {
      id: item.id,
      title: item.name || '',
      location: item.location || '',
      img: item.image?.link?.href ? `${API_BASE_URL}${item.image.link.href}` : '',
      description: item.description || '',
      intro: item.description || '',
      lanesInfo,
      startLat,
      startLng,
      endLat,
      endLng,
      mapData: {
        origin: { lat: startLat, lng: startLng, name: startName },
        destination: { lat: endLat, lng: endLng, name: endName },
        waypoints: [],
        intersectionLocations: [],
        tollLocations: [],
        restLocations: [],
        cameraLocations: [],
        incidentLocations: [],
      },
    };
  });
}

const GiamSatGiaoThong = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedRouteFilter, setSelectedRouteFilter] = useState('');
  const [cameras, setCameras] = useState([]);
  const [violations, setViolations] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [cameraModalData, setCameraModalData] = useState(null);
  const [incidentModalData, setIncidentModalData] = useState(null);
  const [violationModalData, setViolationModalData] = useState(null);

  const [mapOptions] = useState({
    route: true,
    toll: true,
    stop: false,
    construction: false,
    incident: true,
    camera: true,
  });

  const loadDataForRoute = useCallback(async (routeId, routeSource = []) => {
    const numericRouteId = Number(routeId);
    let camerasData = [];

    if (numericRouteId === CAMERA_HIGHWAY_ID) {
      try {
        camerasData = await fetchCameras();
      } catch (error) {
        console.error('Error fetching cameras:', error);
      }
    }

    setCameras(camerasData);
    const violationsData = [];
    setViolations(violationsData);

    const incidentsData = [];
    setIncidents(incidentsData);

    const analyticsData = DEFAULT_ANALYTICS;
    setAnalytics(analyticsData);

    const updatedRoutes = routeSource.map((route) => {
        if (Number(route.id) === numericRouteId) {
          return {
            ...route,
            mapData: {
              ...route.mapData,
              cameraLocations: camerasData.map(mapCameraLocation).filter(Boolean),
              incidentLocations: incidentsData.map((inc) => ({
                lat: inc.lat,
                lng: inc.lng,
                id: inc.id,
                title: inc.title,
                severity: inc.severity,
                timestamp: inc.timestamp,
              })),
            },
          };
      }
      return route;
    });

    const updatedSelectedRoute = updatedRoutes.find((route) => Number(route.id) === numericRouteId) || null;

    setRoutes(updatedRoutes);
    setSelectedRoute(updatedSelectedRoute);
    setSelectedRouteFilter(updatedSelectedRoute ? String(updatedSelectedRoute.id) : '');
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      const apiItems = await fetchHighwaysData();
      const sourceRoutes = mapApiDataToRouteData(apiItems);

      const routesWithTolls = await Promise.all(
        sourceRoutes.map(async (route) => ({
          ...route,
          mapData: {
            ...route.mapData,
            tollLocations: route.id ? await fetchTollDetail(route.id) : route.mapData.tollLocations,
          },
        }))
      );

      if (!isMounted) return;

      setRoutes(routesWithTolls);

      if (routesWithTolls.length > 0) {
        await loadDataForRoute(routesWithTolls[0].id, routesWithTolls);
      } else {
        setSelectedRoute(null);
        setSelectedRouteFilter('');
        setCameras([]);
        setViolations([]);
        setIncidents([]);
        setAnalytics(DEFAULT_ANALYTICS);
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, [loadDataForRoute]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'route') {
      setSelectedRouteFilter(value);

      if (value !== '') {
        const selectedRouteData = routes.find(r => String(r.id) === String(value));
        if (selectedRouteData) {
          setSelectedRoute(selectedRouteData);
          loadDataForRoute(selectedRouteData.id, routes);
        }
      } else {
        if (routes.length > 0) {
          setSelectedRoute(routes[0]);
          loadDataForRoute(routes[0].id, routes);
        }
      }
    }
  };

  return (
    <Container>
      <TabContainer>
        <HeaderSection
          routes={routes}
          selectedRoute={selectedRouteFilter}
          onFilterChange={handleFilterChange}
        />
        <AnalyticsSection
          analytics={analytics}
        />
        <ContentTable>
          <MapSection
            route={selectedRoute}
            options={mapOptions}
            onCameraClick={(camera) => setCameraModalData(camera)}
            onIncidentClick={(incident) => {
              const fullIncident = incidents.find(inc => inc.id === incident.id);
              setIncidentModalData(fullIncident);
            }}
          />

          <DetailSection
            route={selectedRoute}
            cameras={cameras}
            violations={violations}
            onCameraClick={(camera) => setCameraModalData(camera)}
            onViolationClick={(violation) => {
              setViolationModalData(violation);
            }}
          />
        </ContentTable>
      </TabContainer>

      {cameraModalData && (
        <CameraModal
          camera={cameraModalData}
          cameraName={cameraModalData.name}
          onClose={() => setCameraModalData(null)}
        />
      )}

      {incidentModalData && (
        <IncidentModal
          incident={incidentModalData}
          onClose={() => setIncidentModalData(null)}
        />
      )}

      {violationModalData && (
        <ViolationModal
          violation={violationModalData}
          onClose={() => setViolationModalData(null)}
        />
      )}
    </Container>
  );
};

export default GiamSatGiaoThong;
