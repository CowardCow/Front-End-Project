import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../redux/favoritesSlice';
import { addLocationToComparison } from '../redux/comparisonSlice';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/form/Button';

export default function LocationsPage() {
  const { locations, selectLocation, deleteLocation, setIsDbmsModalOpen, exportToJson, showToast } = useWeather();
  const favoriteIds = useSelector((state) => state.favorites.favoriteIds);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [sortBy, setSortBy] = useState('name'); // 'name' | 'state' | 'category'

  const categories = ['All', ...new Set(locations.map(l => l.category || 'Base'))];

  // Filtering & Sorting
  const filtered = locations.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (loc.state && loc.state.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (loc.notes && loc.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || (loc.category || 'Base') === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'state') return (a.state || '').localeCompare(b.state || '');
    if (sortBy === 'category') return (a.category || '').localeCompare(b.category || '');
    return a.name.localeCompare(b.name);
  });

  const handleInspectLocation = (loc) => {
    selectLocation(loc);
    navigate('/portal');
    showToast(`Viewing telemetry for ${loc.name}`);
  };

  const handleCompare = (loc) => {
    dispatch(addLocationToComparison(loc.id));
    navigate('/analytics');
    showToast(`Added ${loc.name} to Weather Comparison!`);
  };

  return (
    <div style={{
      maxWidth: '1440px',
      margin: '0 auto',
      padding: '24px 20px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Header Banner */}
      <div style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--card-border)',
        borderRadius: '24px',
        padding: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <div>
          <span style={{
            fontSize: '0.78rem',
            padding: '3px 10px',
            borderRadius: '20px',
            background: 'rgba(56, 189, 248, 0.15)',
            color: 'var(--accent-cyan)',
            fontWeight: 700,
            letterSpacing: '0.5px'
          }}>
            DATABASE MANAGEMENT SYSTEM
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>
            🗄️ Location Master Database
          </h2>
          
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            onClick={() => setIsDbmsModalOpen(true)}
            icon="➕"
          >
            Add New Location
          </Button>

          <Button
            variant="secondary"
            onClick={exportToJson}
            icon="📥"
          >
            Export Backup
          </Button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          padding: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{ fontSize: '2rem' }}>📍</div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{locations.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>Total Locations in DBMS</div>
          </div>
        </div>

        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          padding: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{ fontSize: '2rem' }}>❤️</div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f87171' }}>{favoriteIds.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>Favorites Bookmarked</div>
          </div>
        </div>

        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          padding: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{ fontSize: '2rem' }}>🏷️</div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{categories.length - 1}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>Distinct Categories</div>
          </div>
        </div>
      </div>

      {/* Search, Filter & Controls Toolbar */}
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '16px',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            placeholder="Search by city, state, or note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }}>🔍</span>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? 'var(--accent-cyan)' : 'var(--input-bg)',
                color: selectedCategory === cat ? '#000' : 'var(--text-sub)',
                border: `1px solid ${selectedCategory === cat ? 'var(--accent-cyan)' : 'var(--card-border)'}`,
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort & View Mode */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--card-border)',
              color: 'var(--text-main)',
              padding: '8px 12px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            <option value="name">Sort by Name</option>
            <option value="state">Sort by State</option>
            <option value="category">Sort by Category</option>
          </select>

          <button
            onClick={() => setViewMode(prev => prev === 'grid' ? 'table' : 'grid')}
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--card-border)',
              color: 'var(--text-main)',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {viewMode === 'grid' ? '📄 Table View' : '🔲 Grid View'}
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          gap: '18px'
        }}>
          {filtered.map((loc) => {
            const isFav = favoriteIds.includes(String(loc.id));
            return (
              <div
                key={loc.id}
                style={{
                  background: 'var(--card-bg)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '20px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {loc.name}
                    </h3>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>
                      📍 {loc.state || 'India'}
                    </span>
                  </div>

                  <button
                    onClick={() => dispatch(toggleFavorite(loc.id))}
                    title={isFav ? 'Remove from Redux Favorites' : 'Add to Redux Favorites'}
                    style={{
                      background: isFav ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                      border: `1px solid ${isFav ? '#ef4444' : 'var(--card-border)'}`,
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      cursor: 'pointer'
                    }}
                  >
                    {isFav ? '❤️' : '🤍'}
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    background: 'var(--badge-bg)',
                    color: 'var(--accent-cyan)',
                    fontWeight: 600
                  }}>
                    {loc.category || 'Base'}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: 'var(--text-sub)',
                    fontFamily: 'monospace'
                  }}>
                    {Number(loc.lat).toFixed(2)}° N, {Number(loc.lon).toFixed(2)}° E
                  </span>
                </div>

                {loc.notes && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)', fontStyle: 'italic', margin: 0 }}>
                    "{loc.notes}"
                  </p>
                )}

                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: 'auto',
                  borderTop: '1px solid var(--card-border)',
                  paddingTop: '12px'
                }}>
                  <button
                    onClick={() => handleInspectLocation(loc)}
                    style={{
                      flex: 1,
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      color: 'var(--accent-cyan)',
                      padding: '8px',
                      borderRadius: '10px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    🗺️ View Weather
                  </button>

                  <button
                    onClick={() => handleCompare(loc)}
                    style={{
                      flex: 1,
                      background: 'rgba(168, 85, 247, 0.15)',
                      border: '1px solid rgba(168, 85, 247, 0.4)',
                      color: 'var(--accent-purple)',
                      padding: '8px',
                      borderRadius: '10px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    📊 Compare
                  </button>

                  <button
                    onClick={() => deleteLocation(loc.id)}
                    title="Delete record"
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div style={{
          background: 'var(--card-bg)',
          borderRadius: '20px',
          border: '1px solid var(--card-border)',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-sub)', borderBottom: '1px solid var(--card-border)' }}>
                <th style={{ padding: '14px 18px' }}>Fav (RTK)</th>
                <th style={{ padding: '14px 18px' }}>City Name</th>
                <th style={{ padding: '14px 18px' }}>State</th>
                <th style={{ padding: '14px 18px' }}>Category</th>
                <th style={{ padding: '14px 18px' }}>Coordinates</th>
                <th style={{ padding: '14px 18px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((loc) => {
                const isFav = favoriteIds.includes(String(loc.id));
                return (
                  <tr key={loc.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '12px 18px' }}>
                      <button
                        onClick={() => dispatch(toggleFavorite(loc.id))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                      >
                        {isFav ? '❤️' : '🤍'}
                      </button>
                    </td>
                    <td style={{ padding: '12px 18px', fontWeight: 600, color: 'var(--text-main)' }}>{loc.name}</td>
                    <td style={{ padding: '12px 18px', color: 'var(--text-sub)' }}>{loc.state || '-'}</td>
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{ fontSize: '0.74rem', padding: '2px 8px', borderRadius: '8px', background: 'var(--badge-bg)', color: 'var(--accent-cyan)' }}>
                        {loc.category || 'Base'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 18px', fontFamily: 'monospace', color: 'var(--text-sub)' }}>
                      {Number(loc.lat).toFixed(2)}, {Number(loc.lon).toFixed(2)}
                    </td>
                    <td style={{ padding: '12px 18px' }}>
                      <button
                        onClick={() => handleInspectLocation(loc)}
                        style={{
                          background: 'rgba(56, 189, 248, 0.15)',
                          border: '1px solid rgba(56, 189, 248, 0.4)',
                          color: 'var(--accent-cyan)',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          marginRight: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        Map
                      </button>
                      <button
                        onClick={() => handleCompare(loc)}
                        style={{
                          background: 'rgba(168, 85, 247, 0.15)',
                          border: '1px solid rgba(168, 85, 247, 0.4)',
                          color: 'var(--accent-purple)',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          marginRight: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        Compare
                      </button>
                      <button
                        onClick={() => deleteLocation(loc.id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#f87171',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
