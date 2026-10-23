import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFavorite, clearFavorites } from '../redux/favoritesSlice';
import { useWeather } from '../context/WeatherContext';
import { useNavigate } from 'react-router-dom';
import Button from './common/form/Button';

export default function ReduxFavoritesTray() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favoriteIds = useSelector((state) => state.favorites.favoriteIds);
  const lastUpdated = useSelector((state) => state.favorites.lastUpdated);
  const { locations, selectLocation, showToast } = useWeather();

  const favoriteLocations = locations.filter(loc => favoriteIds.includes(String(loc.id)));

  const handleSelectFav = (loc) => {
    selectLocation(loc);
    setIsOpen(false);
    navigate('/portal');
    showToast(`Loaded favorite location: ${loc.name}`);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        style={{
          background: favoriteIds.length > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.08)',
          border: `1px solid ${favoriteIds.length > 0 ? 'rgba(239, 68, 68, 0.4)' : 'var(--card-border)'}`,
          color: favoriteIds.length > 0 ? '#fca5a5' : 'var(--text-sub)',
          padding: '6px 14px',
          borderRadius: '12px',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer'
        }}
      >
        <span>❤️ Favorites</span>
        <span style={{
          background: '#ef4444',
          color: '#fff',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.72rem',
          fontWeight: 700
        }}>
          {favoriteIds.length}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 1100 }}
          />
          <div style={{
           position: 'fixed',
top: '115px',
left: '12px',
width: '320px',
maxWidth: 'calc(100vw - 24px)',
maxHeight: 'calc(100vh - 130px)',
overflowY: 'auto',
boxSizing: 'border-box',
            background: 'var(--modal-bg)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
            zIndex: 1101,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Store Favorites
                </h4>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>
                  State managed by Redux Toolkit
                </span>
              </div>
              {favoriteIds.length > 0 && (
                <button
                  onClick={() => dispatch(clearFavorites())}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#f87171',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Clear All
                </button>
              )}
            </div>

            <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {favoriteLocations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--text-sub)', fontSize: '0.82rem' }}>
                  No locations pinned to favorites yet.<br />Click the ❤️ on any location card or map!
                </div>
              ) : (
                favoriteLocations.map(loc => (
                  <div
                    key={loc.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: '10px',
                      border: '1px solid var(--card-border)'
                    }}
                  >
                    <div
                      onClick={() => handleSelectFav(loc)}
                      style={{ cursor: 'pointer', flex: 1 }}
                    >
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {loc.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-sub)' }}>
                        {loc.state || 'India'} • {loc.category || 'Base'}
                      </div>
                    </div>
                    <button
                      onClick={() => dispatch(removeFavorite(loc.id))}
                      title="Remove from favorites"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-sub)',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>

            <div style={{
              fontSize: '0.7rem',
              color: 'var(--text-sub)',
              borderTop: '1px solid var(--card-border)',
              paddingTop: '8px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>RTK Slice: favoritesSlice</span>
              <span>Updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'N/A'}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
