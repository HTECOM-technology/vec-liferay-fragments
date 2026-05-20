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

// ============ MOCK DATA ============

const MOCK_ROUTES = [
  {
    id: 1,
    title: "Cao tốc TP. Hồ Chí Minh - Long Thành - Dầu Giây",
    location: "TP. Hồ Chí Minh - Long Thành - Dầu Giây",
    img: "https://res.cloudinary.com/dvaoj8ssp/image/upload/v1770623000/cao-toc-hcm.jpg",
    description: "Tuyến cao tốc kết nối TP.HCM với Long Thành và Dầu Giây",
    startLat: 10.8231,
    startLng: 106.6297,
    endLat: 10.9500,
    endLng: 107.0800,
    mapData: {
      origin: { lat: 10.8231, lng: 106.6297, name: "TP. Hồ Chí Minh" },
      destination: { lat: 10.9500, lng: 107.0800, name: "Dầu Giây" },
      waypoints: [],
      intersectionLocations: [],
      tollLocations: [
        {
          lat: 10.870,
          lng: 106.750,
          name: "Trạm thu phí Long Thành",
          id: "toll_001",
        },
        {
          lat: 10.920,
          lng: 106.950,
          name: "Trạm thu phí Dầu Giây",
          id: "toll_002",
        }
      ],
      restLocations: [],
      cameraLocations: [],
      incidentLocations: [],
    },
  },
  {
    id: 2,
    title: "Cao tốc Hà Nội - Hải Phòng",
    location: "Hà Nội - Hưng Yên - Hải Dương - Hải Phòng",
    img: "https://placehold.co/400x165",
    description: "Tuyến cao tốc kết nối Hà Nội với Hải Phòng",
    startLat: 21.0285,
    startLng: 105.8542,
    endLat: 20.8449,
    endLng: 106.6881,
    mapData: {
      origin: { lat: 21.0285, lng: 105.8542, name: "Hà Nội" },
      destination: { lat: 20.8449, lng: 106.6881, name: "Hải Phòng" },
      waypoints: [],
      intersectionLocations: [],
      tollLocations: [],
      restLocations: [],
      cameraLocations: [],
      incidentLocations: [],
    },
  },
  {
    id: 3,
    title: "Cao tốc Đà Nẵng - Quảng Ngãi",
    location: "Đà Nẵng - Quảng Nam - Quảng Ngãi",
    img: "https://placehold.co/400x165",
    description: "Tuyến cao tốc kết nối Đà Nẵng với Quảng Ngãi",
    startLat: 16.0544,
    startLng: 108.2022,
    endLat: 15.1214,
    endLng: 108.8045,
    mapData: {
      origin: { lat: 16.0544, lng: 108.2022, name: "Đà Nẵng" },
      destination: { lat: 15.1214, lng: 108.8045, name: "Quảng Ngãi" },
      waypoints: [],
      intersectionLocations: [],
      tollLocations: [],
      restLocations: [],
      cameraLocations: [],
      incidentLocations: [],
    },
  },
];

const MOCK_VIOLATIONS = [
  {
    id: "violation_001",
    highway_id: 1,
    title: "Xe ô tô vượt quá tốc độ cho phép 20km/h",
    type: "Vượt tốc độ",
    image: "https://placehold.co/280x180",
    severity: "high",
    timestamp: "10 phút trước",
    location: "Km 15+200",
    speed: 140,
    maxSpeed: 120,
    licensePlate: "51A-12345",
  },
  {
    id: "violation_002",
    highway_id: 1,
    title: "Xe tải chạy sai làn đường",
    type: "Sai làn",
    image: "https://placehold.co/280x180",
    severity: "medium",
    timestamp: "25 phút trước",
    location: "Km 18+500",
    licensePlate: "50C-67890",
  },
  {
    id: "violation_003",
    highway_id: 1,
    title: "Xe máy đi vào cao tốc",
    type: "Phương tiện không phép",
    image: "https://placehold.co/280x180",
    severity: "high",
    timestamp: "1 giờ trước",
    location: "Km 20+100",
    licensePlate: "59H1-23456",
  },
  {
    id: "violation_004",
    highway_id: 1,
    title: "Xe container vượt quá tải trọng",
    type: "Quá tải",
    image: "https://placehold.co/280x180",
    severity: "medium",
    timestamp: "2 giờ trước",
    location: "Km 22+800",
    licensePlate: "79B-98765",
  },
  {
    id: "violation_005",
    highway_id: 1,
    title: "Xe ô tô không giữ khoảng cách an toàn",
    type: "Khoảng cách",
    image: "https://placehold.co/280x180",
    severity: "low",
    timestamp: "3 giờ trước",
    location: "Km 25+600",
    licensePlate: "51F-11111",
  },
];

const MOCK_INCIDENTS = [
  {
    id: "incident_001",
    highway_id: 1,
    title: "Ôtô 5 chỗ bị vỡ nát sau tai nạn liên hoàn trên đường cao tốc",
    description: "Ôtô 5 chỗ do anh N.Q.D lái trên quốc lộ 1 bị hai xe tải chạy cùng chiều đâm va liên tiếp, tạm nắt vùn, sáng 8/11. Khoảng 6h30, tài ôtô Kia 5 chỗ chạy trên quốc lộ 1, khi đến phương Tam Điệp, ôtô va chạm với xe tải do anh N.V.S điều khiển. Cùng thời điểm, xe dầu kéo do anh Nguyễn Văn Quân lái lao tới, đâm trúng khiến chiếc Kia 5 chỗ bị chèn ép mạnh, bánh sau gãy rời, nhiều bộ phận vỡ vụn rơi vãi trên đường.",
    image: "https://i.vietgiaitri.com/2024/11/8/o-to-5-cho-bi-vo-nat-sau-tai-nan-lien-hoan-tren-duong-cao-toc-0ad-7203535.jpg",
    lat: 10.865,
    lng: 106.780,
    severity: "high",
    timestamp: "2 giờ trước",
    source: "ATGT"
  },
];

const MOCK_ANALYTICS = {
  1: {
    violations: 24,
    avgSpeed: 120,
    animals: 0,
    brokenCameras: 0,
  },
  2: {
    violations: 15,
    avgSpeed: 110,
    animals: 2,
    brokenCameras: 1,
  },
  3: {
    violations: 8,
    avgSpeed: 105,
    animals: 0,
    brokenCameras: 0,
  },
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
          : 'https://placehold.co/104x104',
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
      img: item.image?.link?.href ? `${API_BASE_URL}${item.image.link.href}` : 'https://placehold.co/400x165',
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

// ============ MAIN COMPONENT ============

const GiamSatGiaoThong = () => {
  // State management
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [cameras, setCameras] = useState([]);
  const [violations, setViolations] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [cameraModalData, setCameraModalData] = useState(null);
  const [incidentModalData, setIncidentModalData] = useState(null);
  const [violationModalData, setViolationModalData] = useState(null);

  // Default map options - camera and incident visible
  const [mapOptions] = useState({
    route: true,
    toll: true,
    stop: false,
    construction: false,
    incident: true,
    camera: true,
  });

  /**
   * Load cameras, violations, incidents, and analytics for selected route
   */
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

    // Load violations
    const violationsData = MOCK_VIOLATIONS.filter(v => v.highway_id === numericRouteId);
    setViolations(violationsData);

    // Load incidents
    const incidentsData = MOCK_INCIDENTS.filter(inc => inc.highway_id === numericRouteId);
    setIncidents(incidentsData);

    // Load analytics
    const analyticsData = MOCK_ANALYTICS[numericRouteId] || DEFAULT_ANALYTICS;
    setAnalytics(analyticsData);

    // Update route with camera and incident locations
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
  }, []);

  /**
   * Initialize data on mount
   */
  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);

      const apiItems = await fetchHighwaysData();
      const routeData = mapApiDataToRouteData(apiItems);
      const sourceRoutes = routeData.length ? routeData : MOCK_ROUTES;

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
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, [loadDataForRoute]);

  /**
   * Handle filter changes
   */
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
    } else if (filterType === 'date') {
      setSelectedDate(value);
    } else if (filterType === 'search') {
      setSearchKeyword(value);

      if (value.trim() === '') {
        if (routes.length > 0) {
          setSelectedRoute(routes[0]);
          loadDataForRoute(routes[0].id, routes);
        }
      } else {
        const filtered = routes.filter(route =>
          route.title.toLowerCase().includes(value.toLowerCase()) ||
          route.location.toLowerCase().includes(value.toLowerCase()) ||
          (route.intro || '').toLowerCase().includes(value.toLowerCase())
        );

        if (filtered.length > 0) {
          setSelectedRoute(filtered[0]);
          loadDataForRoute(filtered[0].id, routes);
        } else {
          setSelectedRoute(null);
          setCameras([]);
          setViolations([]);
          setIncidents([]);
          setAnalytics(null);
        }
      }
    }
  };

  /**
   * Handle search button click
   */
  const handleSearch = () => {
    console.log('Search triggered with:', {
      route: selectedRouteFilter,
      date: selectedDate,
      keyword: searchKeyword,
    });

    // TODO: Add API call here when ready
  };

  return (
    <Container>
      <TabContainer>
        {/* Analytics cards */}
        <AnalyticsSection
          routeId={selectedRoute?.id}
          analytics={analytics}
        />

        {/* Header with search and filters */}
        <HeaderSection
          routes={routes}
          selectedRoute={selectedRouteFilter}
          selectedDate={selectedDate}
          searchKeyword={searchKeyword}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

        {/* Map and Detail sections */}
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

      {/* Camera Modal */}
      {cameraModalData && (
        <CameraModal
          camera={cameraModalData}
          cameraName={cameraModalData.name}
          onClose={() => setCameraModalData(null)}
        />
      )}

      {/* Incident Modal */}
      {incidentModalData && (
        <IncidentModal
          incident={incidentModalData}
          onClose={() => setIncidentModalData(null)}
        />
      )}

      {/* Violation Modal */}
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
