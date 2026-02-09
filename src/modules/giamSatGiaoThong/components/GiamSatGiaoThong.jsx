// src/modules/giamSatGiaoThong/components/GiamSatGiaoThong.jsx

import React, { useState, useEffect } from 'react';
import HeaderSection from './HeaderSection';
import MapSection from './MapSection';
import CameraSection from './CameraSection';
import CameraModal from './CameraModal';
import IncidentModal from './IncidentModal';
import { Container, TabContainer, ContentTable } from '../style';

// Mock data cho testing
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
];

const MOCK_INCIDENTS = [
  {
    id: "incident_001",
    highway_id: 1,
    title: "Ôtô 5 chỗ bị vỡ nát sau tai nạn liên hoàn trên đường cao tốc",
    description: "Ôtô 5 chỗ do anh N.Q.D lái trên quốc lộ 1 bị hai xe tải chạy cùng chiều đâm va liên tiếp, tạm nắt vùn, sáng 8/11. Khoảng 6h30, tài ôtô Kia 5 chỗ chạy trên quốc lộ 1, khi đến phương Tam Điệp, ôtô va chạm với xe tải do anh N.V.S điều khiển.",
    image: "https://i.vietgiaitri.com/2024/11/8/o-to-5-cho-bi-vo-nat-sau-tai-nan-lien-hoan-tren-duong-cao-toc-0ad-7203535.jpg",
    lat: 10.865,
    lng: 106.780,
    severity: "high",
    timestamp: "2 giờ trước",
    source: "ATGT"
  },
];

const GiamSatGiaoThong = () => {
  const [routes, setRoutes] = useState(MOCK_ROUTES);
  const [filteredRoutes, setFilteredRoutes] = useState(MOCK_ROUTES);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [cameras, setCameras] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [cameraModalData, setCameraModalData] = useState(null);
  const [incidentModalData, setIncidentModalData] = useState(null);

  // Default map options - camera and incident visible
  const [mapOptions] = useState({
    route: true,
    toll: true,
    stop: false,
    construction: false,
    incident: true, // ← Default visible
    camera: true,   // ← Default visible
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
   * Load cameras and incidents for selected route
   */
  const loadDataForRoute = (routeId) => {
    const camerasData = MOCK_CAMERAS.filter(cam => cam.highway_id === routeId);
    const incidentsData = MOCK_INCIDENTS.filter(inc => inc.highway_id === routeId);

    setCameras(camerasData);
    setIncidents(incidentsData);

    // Update route with camera and incident locations
    setRoutes((prevRoutes) =>
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
      })
    );

    setFilteredRoutes((prevRoutes) =>
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
      })
    );
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
      } else {
        const filtered = routes.filter(route =>
          route.title.toLowerCase().includes(value.toLowerCase()) ||
          route.location.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredRoutes(filtered);
        
        if (filtered.length > 0) {
          setSelectedRoute(filtered[0]);
          loadDataForRoute(filtered[0].id);
        }
      }
    }
  };

  return (
    <Container>
      <TabContainer>
        <HeaderSection
          routes={filteredRoutes}
          selectedRoute={selectedRouteFilter}
          selectedDate={selectedDate}
          searchKeyword={searchKeyword}
          onFilterChange={handleFilterChange}
        />

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

          <CameraSection
            route={selectedRoute}
            cameras={cameras}
            onCameraClick={(camera) => 
              setCameraModalData({ name: camera.name, videoUrl: camera.video_url })
            }
          />
        </ContentTable>
      </TabContainer>

      {cameraModalData && (
        <CameraModal
          cameraName={cameraModalData.name}
          videoUrl={cameraModalData.videoUrl}
          onClose={() => setCameraModalData(null)}
        />
      )}

      {incidentModalData && (
        <IncidentModal
          incident={incidentModalData}
          onClose={() => setIncidentModalData(null)}
        />
      )}
    </Container>
  );
};

export default GiamSatGiaoThong;