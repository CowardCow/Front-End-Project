import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../redux/favoritesSlice';
import InteractiveMap from '../components/InteractiveMap';
import WeatherHeroCard from '../components/WeatherHeroCard';
import AqiCard from '../components/AqiCard';
import ForecastGrid from '../components/ForecastGrid';
import LocationInfoTabs from '../components/LocationInfoTabs';

export default function PortalPage() {
  const { locations, currentLocation, selectLocation, searchQuery, setSearchQuery, setIsDbmsModalOpen } = useWeather();
  const [showLocationPanels, setShowLocationPanels] = useState(true);
  const dispatch = useDispatch();
  const favoriteIds = useSelector((state) => state.favorites.favoriteIds);

  // Filter sidebar locations
  const filteredLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (loc.state && loc.state.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (loc.category && loc.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const isCurrentFavorite = currentLocation && favoriteIds.includes(String(currentLocation.id));

  return (
    <div className="portal-layout" style={{
      maxWidth: '1440px',
      margin: '0 auto',
      padding: '20px',
      width: '100%',
      display: 'grid',
      gridTemplateColumns: '320px minmax(0, 1fr)',
      gap: '20px',
      flex: 1
    }}>
      {/* Sidebar with Saved Locations */}
      <div style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--card-border)',
        borderRadius: '24px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 110px)',
        position: 'sticky',
        top: '90px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{
          marginBottom: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Saved Locations
            </h2>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-sub)' }}>
              {locations.length} Stored Records
            </span>
          </div>

          <button
            onClick={() => setIsDbmsModalOpen(true)}
            style={{
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: 'var(--accent-cyan)',
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            + New
          </button>
        </div>

        {/* Search Box */}
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <input
            type="text"
            placeholder="Search saved location..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--input-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '12px',
              padding: '10px 14px 10px 36px',
              color: 'var(--text-main)',
              fontSize: '0.88rem'
            }}
          />
          <span style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '0.85rem',
            opacity: 0.6
          }}>
            🔍
          </span>
        </div>

        {/* Locations List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          paddingRight: '4px'
        }}>
          {filteredLocations.map(loc => {
            const isActive = currentLocation && String(currentLocation.id) === String(loc.id);
            const isFav = favoriteIds.includes(String(loc.id));

            return (
              <div
                key={loc.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: isActive 
                    ? 'linear-gradient(90deg, rgba(255, 112, 67, 0.2), rgba(56, 189, 248, 0.2))' 
                    : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${isActive ? 'var(--accent-cyan)' : 'transparent'}`,
                  borderRadius: '12px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div
                  onClick={() => selectLocation(loc)}
                  style={{ cursor: 'pointer', flex: 1, minWidth: 0 }}
                >
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {loc.name}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-sub)' }}>
                    {loc.state || 'India'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    background: 'var(--badge-bg)',
                    color: 'var(--accent-cyan)'
                  }}>
                    {loc.category || 'Base'}
                  </span>

                  {/* Redux Favorite toggle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(toggleFavorite(loc.id));
                    }}
                    title={isFav ? 'Remove from Redux Favorites' : 'Add to Redux Favorites'}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      padding: '2px'
                    }}
                  >
                    {isFav ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="dashboard-shell" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <InteractiveMap onLocationPicked={() => setShowLocationPanels(true)} />

        {showLocationPanels ? (
          <>
            <LocationInfoTabs />
            <div className="location-panels">
              <div className="location-panel">
                <div className="panel-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="panel-kicker">LIVE TELEMETRY</span>
                    <h3>🌤️ Weather</h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="selected-pill">{currentLocation?.name || 'Selected location'}</span>
                    {currentLocation && (
                      <button
                        onClick={() => dispatch(toggleFavorite(currentLocation.id))}
                        title={isCurrentFavorite ? 'Remove from Redux Favorites' : 'Save to Redux Favorites'}
                        style={{
                          background: isCurrentFavorite ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                          border: `1px solid ${isCurrentFavorite ? '#ef4444' : 'var(--card-border)'}`,
                          color: isCurrentFavorite ? '#ef4444' : 'var(--text-main)',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {isCurrentFavorite ? '❤️ Pinned (RTK)' : '🤍 Pin (RTK)'}
                      </button>
                    )}
                  </div>
                </div>
                <WeatherHeroCard />
                <AqiCard />
              </div>

              <div className="location-panel">
                <div className="panel-heading">
                  <div>
                    <span className="panel-kicker">LOCATION VIEW</span>
                    <h3>📍 Google Maps Embed</h3>
                  </div>
                </div>
                {currentLocation && (
                  <iframe
                    title={`Google Maps - ${currentLocation.name}`}
                    className="google-map-frame"
                    src={`https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lon}&z=10&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                )}
              </div>
            </div>
            <ForecastGrid />
          </>
        ) : (
          <div className="map-selection-hint">
            <span>📍</span>
            <div>
              <strong>Select a location from the map</strong>
              <p>Click a map marker to reveal weather, Google Maps, history, news and culture information.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
