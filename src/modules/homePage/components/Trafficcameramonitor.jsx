import React, { useState, useEffect } from 'react';
import '../styles/Trafficcameramonitor.css';
// import one from "../assets/camera/1.png";
import one from "../../../assets/camera/1.png";
import two from "../../../assets/camera/2.png";
import three from "../../../assets/camera/3.png";
import four from "../../../assets/camera/4.png";
import five from "../../../assets/camera/5.png";
import six from "../../../assets/camera/6.png";
import seven from "../../../assets/camera/7.png";
import eight from "../../../assets/camera/8.png";
import nine from "../../../assets/camera/9.png";
import container from "../../../assets/camera/Container.svg";

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
      thumbnail: one ,
      videoUrl: '#',
      location: 'Intersection A'
    },
    {
      id: 2,
      name: 'Cam 2',
      thumbnail: two,
      videoUrl: '#',
      location: 'Highway Section B'
    },
    {
      id: 3,
      name: 'Cam 3',
      thumbnail: three,
      videoUrl: '#',
      location: 'City Center'
    },
    {
      id: 4,
      name: 'Cam 4',
      thumbnail: four,
      videoUrl: '#',
      location: 'Downtown Area'
    },
    {
      id: 5,
      name: 'Cam 5',
      thumbnail: five,
      videoUrl: '#',
      location: 'Express Lane'
    },
    {
      id: 6,
      name: 'Cam 6',
      thumbnail: six,
      videoUrl: '#',
      location: 'Junction C'
    },
    {
      id: 7,
      name: 'Cam 7',
      thumbnail: seven,
      videoUrl: '#',
      location: 'Bridge Overpass'
    },
    {
      id: 8,
      name: 'Cam 8',
      thumbnail: eight,
      videoUrl: '#',
      location: 'Tunnel Entrance'
    },
    {
      id: 9,
      name: 'Cam 9',
      thumbnail: nine,
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
    <div className="traffic-camera-monitor doc-card">
      <div className="doc-card-header d-flex align-items-center">
                <div className="doc-card-icon-div d-flex justify-content-center align-items-center">
                <img src={container} alt="icon" />
                </div>
                <span>Camera giao thông</span>
              </div>
    
      <div className="d-flex align-items-center p-8 flex-column traffic-search-div flex-sm-row" style={{gap:'8px'}}>
        <div className="traffic-select-input">
          <select 
            className="custom-select-1"
            value={selectedRoute}
            onChange={handleRouteChange}
          >
            {routes.map(route => (
              <option key={route.value} value={route.value}>
                {route.label}
              </option>
            ))}
          </select>
          
        </div>

        <div className="traffic-date-input">
          <input 
            type="date" 
            className="custom-date-1"
            value={selectedDate}
            onChange={handleDateChange}
          />
         
        </div>
      </div>

        <div className='traffic-camera-inner-div'>
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
      <div className="extra-load-btn">
         <div className="load">
              <a href="" className="load-button">
                Xem thêm
              </a>
              </div>
      </div>
    </div>
  );
};

export default TrafficCameraMonitor;