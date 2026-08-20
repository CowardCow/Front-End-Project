import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useWeather } from '../context/WeatherContext';

export default function InteractiveMap() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersGroupRef = useRef(L.layerGroup());
  
  const [mapMode, setMapMode] = useState('leaflet'); // 'leaflet' (dark vector) or 'satellite'
  
  const {
    locations,
    currentLocation,
    selectLocation,
    isMapPickerActive,
    setIsMapPickerActive,
    setPickedCoords,
    setIsDbmsModalOpen,
    showToast
  } = useWeather();

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, { zoomControl: false }).setView([20.5937, 78.9629], 5);
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const darkTile = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19
      });
      darkTile.addTo(map);
      tileLayerRef.current = darkTile;

      markersGroupRef.current.addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Map Tile Layer based on mode (Dark Vector vs Satellite)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    if (mapMode === 'leaflet') {
      tileLayerRef.current = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19
      }).addTo(map);
    } else {
      // High resolution Satellite Basemap
      tileLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri World Imagery',
        maxZoom: 19
      }).addTo(map);
    }
  }, [mapMode]);

  // Handle Click-to-pick coordinates listener
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    const handleMapClick = (e) => {
      if (isMapPickerActive) {
        const lat = parseFloat(e.latlng.lat.toFixed(4));
        const lon = parseFloat(e.latlng.lng.toFixed(4));
        setPickedCoords({ lat, lon });
        setIsMapPickerActive(false);
        setIsDbmsModalOpen(true);
        showToast(`Selected map coordinates: ${lat}, ${lon}`);
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isMapPickerActive, setIsMapPickerActive, setPickedCoords, setIsDbmsModalOpen, showToast]);

  // Update Markers when locations change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    markersGroupRef.current.clearLayers();

    locations.forEach(loc => {
      const isCustom = loc.id > 100 || isNaN(Number(loc.id));
      const customIcon = L.divIcon({
        className: 'custom-pin-container',
        html: `<div class="custom-keyframe-pin ${isCustom ? 'user-added' : ''}"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });

      const marker = L.marker([loc.lat, loc.lon], { icon: customIcon });
      marker.bindTooltip(`<b>${loc.name}</b><br><small>${loc.state || 'Location'}</small>`, {
        direction: 'top',
        offset: [0, -10]
      });
      marker.on('click', () => selectLocation(loc));
      markersGroupRef.current.addLayer(marker);
    });
  }, [locations, selectLocation]);

  // Fly To active location
  useEffect(() => {
    if (mapInstanceRef.current && currentLocation) {
      mapInstanceRef.current.flyTo([currentLocation.lat, currentLocation.lon], 7, {
        animate: true,
        duration: 1.2
      });
    }
  }, [currentLocation]);

  return (
    <div style={{
      background: 'var(--card-bg)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--card-border)',
      borderRadius: '24px',
      padding: '18px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
      position: 'relative'
    }}>
      {/* Map Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          🗺️ Interactive Map & Location Telemetry
        </h3>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setMapMode('leaflet')}
            style={{
              background: mapMode === 'leaflet' ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.06)',
              color: mapMode === 'leaflet' ? '#000' : 'var(--text-sub)',
              border: '1px solid var(--card-border)',
              padding: '5px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: mapMode === 'leaflet' ? 700 : 500
            }}
          >
            Dark Vector Map
          </button>
          <button
            onClick={() => setMapMode('satellite')}
            style={{
              background: mapMode === 'satellite' ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.06)',
              color: mapMode === 'satellite' ? '#000' : 'var(--text-sub)',
              border: '1px solid var(--card-border)',
              padding: '5px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: mapMode === 'satellite' ? 700 : 500
            }}
          >
            Satellite Imagery
          </button>
        </div>
      </div>

      {/* Map Element Wrapper */}
      <div style={{
        width: '100%',
        height: '420px',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        position: 'relative'
      }}>
        {isMapPickerActive && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 112, 67, 0.95)',
            color: '#fff',
            padding: '8px 18px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            zIndex: 1000,
            boxShadow: '0 4px 20px rgba(255, 112, 67, 0.5)',
            animation: 'bounceBanner 0.6s infinite alternate ease-in-out'
          }}>
            📍 Click anywhere on the map to select coordinates!
          </div>
        )}
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}
