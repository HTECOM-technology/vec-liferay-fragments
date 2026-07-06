import React, { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import HeaderSection from './HeaderSection';
import AnalyticsSection from './AnalyticsSection';
import MapSection from './MapSection';
import DetailSection from './DetailSection';
import CameraModal from './CameraModal';
import CameraShowStateModal from './CameraShowStateModal';
import IncidentModal from './IncidentModal';
import ViolationModal from './ViolationModal';
import { Container, TabContainer, ContentTable } from '../style';
import {
  CAMERA_SHOW_STATE_MODES,
  fetchCameraShowState,
  filterCamerasByShowState,
  saveCameraShowState,
} from '@/services/cameraShowStateService';

// ============ API CONFIG ============

const API_BASE_URL = '';
const API_HEADERS = {
  accept: 'application/json',
};
const API_HIGHWAYS_URL = `${API_BASE_URL}/o/c/highways/`;
const CAMERA_HIGHWAY_CONFIGS = {
  42753: { apiBasePath: '/o/its-hld' },
  44147: { apiBasePath: '/o/its' },
};
const cameraListCache = new Map();

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

function getCameraApiUrl(highwayId) {
  const config = CAMERA_HIGHWAY_CONFIGS[Number(highwayId)];
  if (!config?.apiBasePath) return null;
  return `https://portal.tctvec.vn${config.apiBasePath}/api/cameras`;
}

async function fetchCameras(highwayId) {
  const cameraApiUrl = getCameraApiUrl(highwayId);

  if (!cameraApiUrl) return [];

  if (cameraListCache.has(cameraApiUrl)) return cameraListCache.get(cameraApiUrl);

  const response = await fetch(withCacheBust(cameraApiUrl), {
    method: 'GET',
    cache: 'no-store',
    headers: API_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`Camera API error: ${response.status}`);
  }

  const data = await response.json();
  const cameras = Array.isArray(data.items)
    ? data.items.map((camera) => ({
        ...camera,
        __cameraApiUrl: cameraApiUrl,
        __highwayId: Number(highwayId),
      }))
    : [];

  cameraListCache.set(cameraApiUrl, cameras);

  return cameras;
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

function mapIncidentLocation(incident) {
  return {
    lat: incident.lat,
    lng: incident.lng,
    id: incident.id,
    title: incident.title,
    severity: incident.severity,
    timestamp: incident.timestamp,
  };
}

function applyRouteMapData(routeSource, routeId, visibleCameras, incidentsData) {
  return routeSource.map((route) => {
    if (Number(route.id) !== Number(routeId)) {
      return route;
    }

    return {
      ...route,
      mapData: {
        ...route.mapData,
        cameraLocations: visibleCameras.map(mapCameraLocation).filter(Boolean),
        incidentLocations: incidentsData.map(mapIncidentLocation),
      },
    };
  });
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
  const [allCameras, setAllCameras] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [cameraShowStates, setCameraShowStates] = useState([]);
  const [cameraShowStateLoading, setCameraShowStateLoading] = useState(false);
  const [cameraShowStateSaving, setCameraShowStateSaving] = useState(false);
  const [cameraSettingsOpen, setCameraSettingsOpen] = useState(false);
  const [violations, setViolations] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [cameraModalData, setCameraModalData] = useState(null);
  const [incidentModalData, setIncidentModalData] = useState(null);
  const [violationModalData, setViolationModalData] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const [mapOptions] = useState({
    route: true,
    toll: false,
    stop: false,
    construction: false,
    incident: false,
    camera: true,
  });

  const loadDataForRoute = useCallback(async (routeId, routeSource = []) => {
    const numericRouteId = Number(routeId);
    let camerasData = [];

    setCameraShowStateLoading(true);

    try {
      const [nextCamerasData, cameraShowStateResponse] = await Promise.all([
        fetchCameras(numericRouteId).catch((error) => {
          console.error('Error fetching cameras:', error);
          return [];
        }),
        fetchCameraShowState(numericRouteId),
      ]);

      camerasData = nextCamerasData;
      const nextCameraShowStates = cameraShowStateResponse?.items || [];
      const visibleCameras = filterCamerasByShowState(
        camerasData,
        nextCameraShowStates,
        CAMERA_SHOW_STATE_MODES.INTRANET
      );

      setAllCameras(camerasData);
      setCameraShowStates(nextCameraShowStates);
      setCameras(visibleCameras);

      const violationsData = [];
      setViolations(violationsData);

      const incidentsData = [];
      setIncidents(incidentsData);

      const analyticsData = DEFAULT_ANALYTICS;
      setAnalytics(analyticsData);

      const updatedRoutes = applyRouteMapData(
        routeSource,
        numericRouteId,
        visibleCameras,
        incidentsData
      );

      const updatedSelectedRoute =
        updatedRoutes.find((route) => Number(route.id) === numericRouteId) || null;

      setRoutes(updatedRoutes);
      setSelectedRoute(updatedSelectedRoute);
      setSelectedRouteFilter(updatedSelectedRoute ? String(updatedSelectedRoute.id) : '');
    } finally {
      setCameraShowStateLoading(false);
    }
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
        setAllCameras([]);
        setCameras([]);
        setCameraShowStates([]);
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

  const handleOpenCameraSettings = () => {
    setCameraSettingsOpen(true);
  };

  const handleCameraClick = useCallback((camera) => {
    setCameraModalData(camera);
  }, []);

  const handleCloseCameraSettings = () => {
    if (cameraShowStateSaving) {
      return;
    }

    setCameraSettingsOpen(false);
  };

  const handleSaveCameraSettings = async (rows) => {
    if (!selectedRoute?.id) {
      return;
    }

    setCameraShowStateSaving(true);

    try {
      const response = await saveCameraShowState(selectedRoute.id, rows);
      const nextCameraShowStates = response?.items || rows;
      const nextVisibleCameras = filterCamerasByShowState(
        allCameras,
        nextCameraShowStates,
        CAMERA_SHOW_STATE_MODES.INTRANET
      );

      setCameraShowStates(nextCameraShowStates);
      setCameras(nextVisibleCameras);

      setRoutes((currentRoutes) =>
        applyRouteMapData(
          currentRoutes,
          selectedRoute.id,
          nextVisibleCameras,
          incidents
        )
      );
      setSelectedRoute((currentRoute) => {
        if (!currentRoute) {
          return currentRoute;
        }

        const nextRoutes = applyRouteMapData(
          [currentRoute],
          selectedRoute.id,
          nextVisibleCameras,
          incidents
        );

        return nextRoutes[0];
      });

      setCameraSettingsOpen(false);
      messageApi.success('Đã lưu cấu hình hiển thị camera.');
    } catch (error) {
      console.error('Error saving camera settings:', error);
      messageApi.error(error?.message || 'Không lưu được cấu hình camera.');
    } finally {
      setCameraShowStateSaving(false);
    }
  };

  return (
    <Container>
      {contextHolder}
      <TabContainer>
        <HeaderSection
          routes={routes}
          selectedRoute={selectedRouteFilter}
          onFilterChange={handleFilterChange}
          onOpenSettings={handleOpenCameraSettings}
        />
        <AnalyticsSection
          analytics={analytics}
        />
        <ContentTable>
          <MapSection
            route={selectedRoute}
            options={mapOptions}
            onCameraClick={handleCameraClick}
          />

          <DetailSection
            route={selectedRoute}
            cameras={cameras}
            violations={violations}
            onCameraClick={handleCameraClick}
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

      <CameraShowStateModal
        open={cameraSettingsOpen}
        routeTitle={selectedRoute?.title}
        cameras={allCameras}
        settings={cameraShowStates}
        loading={cameraShowStateLoading}
        saving={cameraShowStateSaving}
        onCancel={handleCloseCameraSettings}
        onSave={handleSaveCameraSettings}
      />

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
