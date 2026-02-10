import React, { useState, useEffect } from 'react';
import HeaderSection from './HeaderSection';
import AnalyticsSection from './AnalyticsSection';
import MapSection from './MapSection';
import DetailSection from './DetailSection';
import CameraModal from './CameraModal';
import IncidentModal from './IncidentModal';
import ViolationModal from './ViolationModal';
import { Container, TabContainer, ContentTable } from '../style';

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

const MOCK_CAMERAS = [
  {
    live_camera_id: "cam_001",
    highway_id: 1,
    name: "Cam 1",
    lat: 10.840,
    lng: 106.700,
    video_url: "https://res.cloudinary.com/dvaoj8ssp/video/upload/v1770092554/602445_Cities_City_3840x2160_dzefxw.mp4"
  },
  {
    live_camera_id: "cam_002",
    highway_id: 1,
    name: "Cam 2",
    lat: 10.870,
    lng: 106.800,
    video_url: "https://res.cloudinary.com/dvaoj8ssp/video/upload/v1770092554/602445_Cities_City_3840x2160_dzefxw.mp4"
  },
  {
    live_camera_id: "cam_003",
    highway_id: 1,
    name: "Cam 3",
    lat: 10.900,
    lng: 106.950,
    video_url: "https://res.cloudinary.com/dvaoj8ssp/video/upload/v1770092554/602445_Cities_City_3840x2160_dzefxw.mp4"
  },
  {
    live_camera_id: "cam_004",
    highway_id: 1,
    name: "Cam 4",
    lat: 10.920,
    lng: 107.020,
    video_url: "https://res.cloudinary.com/dvaoj8ssp/video/upload/v1770092554/602445_Cities_City_3840x2160_dzefxw.mp4"
  },
  {
    live_camera_id: "cam_005",
    highway_id: 1,
    name: "Cam 5",
    lat: 10.880,
    lng: 106.850,
    video_url: "https://res.cloudinary.com/dvaoj8ssp/video/upload/v1770092554/602445_Cities_City_3840x2160_dzefxw.mp4"
  },
  {
    live_camera_id: "cam_006",
    highway_id: 1,
    name: "Cam 6",
    lat: 10.910,
    lng: 107.000,
    video_url: "https://res.cloudinary.com/dvaoj8ssp/video/upload/v1770092554/602445_Cities_City_3840x2160_dzefxw.mp4"
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

// ============ MAIN COMPONENT ============

const GiamSatGiaoThong = () => {
  // State management
  const [routes, setRoutes] = useState(MOCK_ROUTES);
  const [filteredRoutes, setFilteredRoutes] = useState(MOCK_ROUTES);
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
   * Initialize data on mount
   */
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);

    if (MOCK_ROUTES.length > 0) {
      setSelectedRoute(MOCK_ROUTES[0]);
      loadDataForRoute(MOCK_ROUTES[0].id);
    }
  }, []);

  /**
   * Load cameras, violations, incidents, and analytics for selected route
   */
  const loadDataForRoute = (routeId) => {
    // Load cameras
    const camerasData = MOCK_CAMERAS.filter(cam => cam.highway_id === routeId);
    setCameras(camerasData);

    // Load violations
    const violationsData = MOCK_VIOLATIONS.filter(v => v.highway_id === routeId);
    setViolations(violationsData);

    // Load incidents
    const incidentsData = MOCK_INCIDENTS.filter(inc => inc.highway_id === routeId);
    setIncidents(incidentsData);

    // Load analytics
    const analyticsData = MOCK_ANALYTICS[routeId] || {
      violations: 0,
      avgSpeed: 0,
      animals: 0,
      brokenCameras: 0,
    };
    setAnalytics(analyticsData);

    // Update route with camera and incident locations
    const updateRouteData = (prevRoutes) =>
      prevRoutes.map((route) => {
        if (route.id === routeId) {
          return {
            ...route,
            mapData: {
              ...route.mapData,
              cameraLocations: camerasData.map((cam) => ({
                lat: cam.lat,
                lng: cam.lng,
                name: cam.name,
                id: cam.live_camera_id,
                videoUrl: cam.video_url,
              })),
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

    setRoutes(updateRouteData);
    setFilteredRoutes(updateRouteData);
  };

  /**
   * Handle filter changes
   */
  const handleFilterChange = (filterType, value) => {
    if (filterType === 'route') {
      setSelectedRouteFilter(value);
      
      if (value !== '') {
        const selectedRouteData = routes.find(r => r.id === parseInt(value));
        if (selectedRouteData) {
          setSelectedRoute(selectedRouteData);
          loadDataForRoute(selectedRouteData.id);
          setFilteredRoutes([selectedRouteData]);
        }
      } else {
        setFilteredRoutes(routes);
        if (routes.length > 0) {
          setSelectedRoute(routes[0]);
          loadDataForRoute(routes[0].id);
        }
      }
    } else if (filterType === 'date') {
      setSelectedDate(value);
    } else if (filterType === 'search') {
      setSearchKeyword(value);
      
      if (value.trim() === '') {
        setFilteredRoutes(routes);
        if (routes.length > 0) {
          setSelectedRoute(routes[0]);
          loadDataForRoute(routes[0].id);
        }
      } else {
        const filtered = routes.filter(route =>
          route.title.toLowerCase().includes(value.toLowerCase()) ||
          route.location.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredRoutes(filtered);
        
        if (filtered.length > 0) {
          setSelectedRoute(filtered[0]);
          loadDataForRoute(filtered[0].id);
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
        {/* Header with search and filters */}
        <HeaderSection
          routes={filteredRoutes}
          selectedRoute={selectedRouteFilter}
          selectedDate={selectedDate}
          searchKeyword={searchKeyword}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

        {/* Analytics cards */}
        <AnalyticsSection 
          routeId={selectedRoute?.id}
          analytics={analytics}
        />

        {/* Map and Detail sections */}
        <ContentTable>
          <MapSection
            route={selectedRoute}
            options={mapOptions}
            onCameraClick={(camera) => 
              setCameraModalData({ name: camera.name, videoUrl: camera.videoUrl })
            }
            onIncidentClick={(incident) => {
              const fullIncident = incidents.find(inc => inc.id === incident.id);
              setIncidentModalData(fullIncident);
            }}
          />

          <DetailSection
            route={selectedRoute}
            cameras={cameras}
            violations={violations}
            onCameraClick={(camera) => 
              setCameraModalData({ name: camera.name, videoUrl: camera.video_url })
            }
            onViolationClick={(violation) => {
              setViolationModalData(violation);
            }}
          />
        </ContentTable>
      </TabContainer>

      {/* Camera Modal */}
      {cameraModalData && (
        <CameraModal
          cameraName={cameraModalData.name}
          videoUrl={cameraModalData.videoUrl}
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