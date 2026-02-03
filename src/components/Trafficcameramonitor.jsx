import React, { useState, useEffect } from 'react';
import '../styles/Trafficcameramonitor.css';

const TrafficCameraMonitor = () => {
  const [selectedRoute, setSelectedRoute] = useState('cao-toc-hcm-long-thanh-dau-giay');
  const [selectedDate, setSelectedDate] = useState('2025-01-15');
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(false);

  // Static data for demonstration - Replace with API call
  const staticCameras = [
    {
      id: 1,
      name: 'Cam 1',
      thumbnail: 'http://45.77.240.85:8080/documents/d/vec/d7536992e4b7afce1e2426e1fc3475e2c45e3340',
      videoUrl: '#',
      location: 'Intersection A'
    },
    {
      id: 2,
      name: 'Cam 2',
      thumbnail: 'http://45.77.240.85:8080/documents/d/vec/b9a7340e006d955b7cbd8867d0a0d14f3fdf1c3d',
      videoUrl: '#',
      location: 'Highway Section B'
    },
    {
      id: 3,
      name: 'Cam 3',
      thumbnail: 'http://45.77.240.85:8080/documents/d/vec/b8c7ab75a5005190f0cb595450b73c8f9ee5c2b3',
      videoUrl: '#',
      location: 'City Center'
    },
    {
      id: 4,
      name: 'Cam 4',
      thumbnail: 'http://45.77.240.85:8080/documents/d/vec/9891561172b8c0bd94fdc4507a269c4e0da17bd6',
      videoUrl: '#',
      location: 'Downtown Area'
    },
    {
      id: 5,
      name: 'Cam 5',
      thumbnail: 'http://45.77.240.85:8080/documents/d/vec/429da88e8e6eb9ac9152fafe3a917cc33f216b0f',
      videoUrl: '#',
      location: 'Express Lane'
    },
    {
      id: 6,
      name: 'Cam 6',
      thumbnail: 'http://45.77.240.85:8080/documents/d/vec/83ce94347bf61926720963008c61d4a8ae570e0b',
      videoUrl: '#',
      location: 'Junction C'
    },
    {
      id: 7,
      name: 'Cam 7',
      thumbnail: 'http://45.77.240.85:8080/documents/d/vec/8e1aac44fccc3e55934ca897c7fb2be204dc6ff6',
      videoUrl: '#',
      location: 'Bridge Overpass'
    },
    {
      id: 8,
      name: 'Cam 8',
      thumbnail: 'http://45.77.240.85:8080/documents/d/vec/5b65b612e31e1a6171d3c883e8a6d818f78dfded',
      videoUrl: '#',
      location: 'Tunnel Entrance'
    },
    {
      id: 9,
      name: 'Cam 9',
      thumbnail: 'http://45.77.240.85:8080/documents/d/vec/02eedf4acdd1f86a3c48ba4c07b8241d2540e6a0',
      videoUrl: '#',
      location: 'Exit Ramp'
    }
  ];

  const routes = [
    { value: 'cao-toc-hcm-long-thanh-dau-giay', label: 'Cao tốc TP. Hồ Chí Minh - Long Thành - Dầu Giây' },
    { value: 'cao-toc-hcm-trung-luong', label: 'Cao tốc TP. Hồ Chí Minh - Trung Lương' },
    { value: 'cao-toc-hcm-bien-hoa', label: 'Cao tốc TP. Hồ Chí Minh - Biên Hòa' }
  ];

  // Simulate API call - Replace with actual API integration
  useEffect(() => {
    fetchCameraData();
  }, [selectedRoute, selectedDate]);

  const fetchCameraData = async () => {
    setLoading(true);
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/cameras?route=${selectedRoute}&date=${selectedDate}`);
      // const data = await response.json();
      // setCameras(data);
      
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setCameras(staticCameras);
    } catch (error) {
      console.error('Error fetching camera data:', error);
      setCameras(staticCameras);
    } finally {
      setLoading(false);
    }
  };

  const handleCameraClick = (camera) => {
    // TODO: Implement video player modal or navigation
    console.log('Camera clicked:', camera);
    window.open(camera.videoUrl, '_blank');
  };

  const handleRouteChange = (e) => {
    setSelectedRoute(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="traffic-camera-monitor">
      <div className="traffic-camera-monitor__header">
        <div className="traffic-camera-monitor__header-icon">
               <img 
            src="http://45.77.240.85:8080/documents/d/vec/container" 
            alt="Logo"
            className="traffic-camera-monitor__header-logo"
          />
        </div>
        <h1 className="traffic-camera-monitor__header-title">Camera giao thông</h1>
      </div>

      <div className="traffic-camera-monitor__controls">
        <div className="traffic-camera-monitor__controls-select-wrapper">
          <select 
            className="traffic-camera-monitor__controls-select"
            value={selectedRoute}
            onChange={handleRouteChange}
          >
            {routes.map(route => (
              <option key={route.value} value={route.value}>
                {route.label}
              </option>
            ))}
          </select>
          <svg className="traffic-camera-monitor__controls-select-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="traffic-camera-monitor__controls-date-wrapper">
          <input 
            type="date" 
            className="traffic-camera-monitor__controls-date-input"
            value={selectedDate}
            onChange={handleDateChange}
          />
          <svg className="traffic-camera-monitor__controls-date-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M13 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <div className="traffic-camera-monitor__grid">
        {loading ? (
          <div className="traffic-camera-monitor__loading">
            <div className="traffic-camera-monitor__loading-spinner"></div>
            <p>Đang tải...</p>
          </div>
        ) : (
          cameras.map(camera => (
            <div 
              key={camera.id} 
              className="traffic-camera-monitor__camera-card"
              onClick={() => handleCameraClick(camera)}
            >
              <div className="traffic-camera-monitor__camera-card-image-wrapper">
                <div className="traffic-camera-monitor__camera-card-label">
                  {camera.name}
                </div>
                <img 
                  src={camera.thumbnail} 
                  alt={camera.name}
                  className="traffic-camera-monitor__camera-card-image"
                />
                <div className="traffic-camera-monitor__camera-card-overlay">
                  <button className="traffic-camera-monitor__camera-card-play-button">
                       <img 
                      src="http://45.77.240.85:8080/documents/d/vec/link-1" 
                      alt="Play"
                      className="traffic-camera-monitor__camera-card-play-icon"
                      width="32"
                      height="32"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TrafficCameraMonitor;