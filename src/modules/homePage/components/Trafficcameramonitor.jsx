import React, { useEffect, useState } from 'react';
import CameraModal from '../../giamSatGiaoThong/components/CameraModal';
import '../styles/Trafficcameramonitor.css';

const API_BASE_URL = '';
const API_HEADERS = {
  accept: 'application/json',
};
const API_HIGHWAYS_URL = `${API_BASE_URL}/o/c/highways/`;
const CAMERA_API_URL = 'https://portal.tctvec.vn/o/its/api/cameras';
const CAMERA_HIGHWAY_ID = 44147;
const INITIAL_VISIBLE_COUNT = 9;
const THUMBNAIL_FALLBACK_URL =
  'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original';

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
    return Array.isArray(data.items) ? data.items : [];
  } catch (error) {
    console.error('Error fetching highways data:', error);
    return [];
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

function mapApiRoutesToOptions(items) {
  return items
    .filter((item) => item?.id && item?.name)
    .map((item) => ({
      id: item.id,
      title: item.name,
    }));
}

const TrafficCameraMonitor = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [cameraModalData, setCameraModalData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const initializeRoutes = async () => {
      const routeData = mapApiRoutesToOptions(await fetchHighwaysData());
      const nextRoutes = routeData;
      const defaultRoute =
        nextRoutes.find((route) => Number(route.id) === CAMERA_HIGHWAY_ID) || nextRoutes[0];

      if (!isMounted) return;

      setRoutes(nextRoutes);
      setSelectedRoute(String(defaultRoute?.id ?? ''));
    };

    initializeRoutes();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCameraData = async () => {
      if (!selectedRoute) {
        setCameras([]);
        return;
      }

      setLoading(true);
      setError('');
      setVisibleCount(INITIAL_VISIBLE_COUNT);

      try {
        const shouldLoadRealCameras = Number(selectedRoute) === CAMERA_HIGHWAY_ID;
        const cameraData = shouldLoadRealCameras ? await fetchCameras() : [];

        if (isMounted) {
          setCameras(cameraData);
        }
      } catch (fetchError) {
        console.error('Error fetching camera data:', fetchError);
        if (isMounted) {
          setCameras([]);
          setError('Không tải được dữ liệu camera');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCameraData();

    return () => {
      isMounted = false;
    };
  }, [selectedRoute]);

  const handleRouteChange = (e) => {
    setSelectedRoute(e.target.value);
  };

  const displayedCameras = cameras.slice(0, visibleCount);

  return (
    <>
      <div className="traffic-camera-monitor doc-card">
        <div className="doc-card-header d-flex align-items-center">
          <span>Camera giao thông</span>
        </div>

        <div className="d-flex align-items-center p-8 flex-column traffic-search-div flex-sm-row" style={{ gap: '8px' }}>
          <div className="traffic-select-input">
            <select
              className="custom-select-1"
              value={selectedRoute}
              onChange={handleRouteChange}
              disabled={routes.length === 0}
            >
              {routes.length === 0 ? (
                <option value="">Không có tuyến đường</option>
              ) : null}
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error ? (
          <div className="traffic-camera-monitor__error">
            <span>{error}</span>
          </div>
        ) : null}

        <div className="traffic-camera-inner-div">
          <div className="traffic-camera-monitor__grid">
            {loading ? (
              <div className="traffic-camera-monitor__loading">
                <div className="traffic-camera-monitor__loading-spinner"></div>
                <p>Đang tải...</p>
              </div>
            ) : displayedCameras.length > 0 ? (
              displayedCameras.map((camera) => (
                <div
                  key={camera.camera_id || camera.id}
                  className="traffic-camera-monitor__camera-card"
                  onClick={() => setCameraModalData(camera)}
                >
                  <div className="traffic-camera-monitor__camera-card-image-wrapper">
                    <div className="traffic-camera-monitor__camera-card-label">
                      {camera.name || 'Camera'}
                    </div>
                    <img
                      src={camera.thumbnail_url || THUMBNAIL_FALLBACK_URL}
                      alt={camera.name || 'Camera'}
                      className="traffic-camera-monitor__camera-card-image"
                      onError={(event) => {
                        event.currentTarget.src = THUMBNAIL_FALLBACK_URL;
                      }}
                    />
                    <div className="traffic-camera-monitor__camera-card-overlay">
                      <button type="button" className="traffic-camera-monitor__camera-card-play-button">
                        <img
                          src="/documents/d/intranet/link"
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
            ) : (
              <div className="traffic-camera-monitor__empty">
                <p>Không có camera trực tuyến</p>
              </div>
            )}
          </div>
        </div>

        {!loading && visibleCount < cameras.length ? (
          <div className="extra-load-btn">
            <div className="load">
              <button
                type="button"
                className="load-button"
                onClick={() => setVisibleCount((prevCount) => prevCount + INITIAL_VISIBLE_COUNT)}
              >
                Xem thêm
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {cameraModalData ? (
        <CameraModal
          camera={cameraModalData}
          cameraName={cameraModalData.name}
          onClose={() => setCameraModalData(null)}
        />
      ) : null}
    </>
  );
};

export default TrafficCameraMonitor;
