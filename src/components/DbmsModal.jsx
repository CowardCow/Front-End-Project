import React, { useState, useEffect } from 'react';
import { useWeather } from '../context/WeatherContext';

export default function DbmsModal() {
  const {
    locations,
    isDbmsModalOpen,
    setIsDbmsModalOpen,
    addLocation,
    updateLocation,
    deleteLocation,
    selectLocation,
    exportToJson,
    importLocations,
    geocodeCity,
    setIsMapPickerActive,
    pickedCoords,
    setPickedCoords,
    showToast
  } = useWeather();

  const [formName, setFormName] = useState('');
  const [formState, setFormState] = useState('');
  const [formLat, setFormLat] = useState('');
  const [formLon, setFormLon] = useState('');
  const [formCategory, setFormCategory] = useState('Custom Base');
  const [formNotes, setFormNotes] = useState('');
  const [autoCity, setAutoCity] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [tableSearch, setTableSearch] = useState('');

  // Update lat/lon when map picker captures coordinates
  useEffect(() => {
    if (pickedCoords) {
      setFormLat(pickedCoords.lat);
      setFormLon(pickedCoords.lon);
      setPickedCoords(null);
    }
  }, [pickedCoords, setPickedCoords]);

  if (!isDbmsModalOpen) return null;

  const handleAutoGeocode = async () => {
    if (!autoCity.trim()) {
      showToast('Please enter a city name to search.', 'error');
      return;
    }
    const result = await geocodeCity(autoCity.trim());
    if (result) {
      setFormName(result.name);
      setFormState(result.state || '');
      setFormLat(result.lat);
      setFormLon(result.lon);
      showToast(`Auto-fetched coordinates for ${result.name}!`);
    } else {
      showToast(`Could not find coordinates for "${autoCity}".`, 'error');
    }
  };

  const handleStartEdit = (loc) => {
    setEditingId(loc.id);
    setFormName(loc.name);
    setFormState(loc.state || '');
    setFormLat(loc.lat);
    setFormLon(loc.lon);
    setFormCategory(loc.category || 'Custom Base');
    setFormNotes(loc.notes || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormName('');
    setFormState('');
    setFormLat('');
    setFormLon('');
    setFormCategory('Custom Base');
    setFormNotes('');
    setAutoCity('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formName.trim() || formLat === '' || formLon === '') {
      showToast('Name, Latitude, and Longitude are required.', 'error');
      return;
    }

    const payload = {
      name: formName.trim(),
      state: formState.trim(),
      lat: parseFloat(formLat),
      lon: parseFloat(formLon),
      category: formCategory,
      notes: formNotes.trim()
    };

    if (editingId) {
      await updateLocation(editingId, payload);
      setEditingId(null);
    } else {
      await addLocation(payload);
    }

    resetForm();
  };

  const handleTriggerMapPicker = () => {
    setIsDbmsModalOpen(false);
    setIsMapPickerActive(true);
    showToast('Click anywhere on the map to pick coordinates!', 'success');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        importLocations(json);
      } catch (err) {
        showToast('Invalid JSON file format.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const filteredLocations = locations.filter(l => 
    l.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
    (l.state && l.state.toLowerCase().includes(tableSearch.toLowerCase())) ||
    (l.category && l.category.toLowerCase().includes(tableSearch.toLowerCase()))
  );

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 10, 18, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div style={{
        background: '#0f172a',
        border: '1px solid var(--card-border)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '950px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid var(--card-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            🗄️ Location Database Management System (DBMS)
          </h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={exportToJson}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--card-border)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600
              }}
            >
              📥 Export JSON
            </button>
            <label style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--card-border)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              📤 Import JSON
              <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            <button
              onClick={() => setIsDbmsModalOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#fff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                fontSize: '1.1rem'
              }}
            >
              &times;
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Form Section */}
          <form onSubmit={handleSave} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid var(--card-border)'
          }}>
            <h3 style={{ gridColumn: 'span 2', fontSize: '1.05rem', color: '#fff' }}>
              {editingId ? '✏️ Edit Location Record' : '➕ Add New Custom Location Record'}
            </h3>

            {/* Auto Geocode Input */}
            <div style={{
              gridColumn: 'span 2',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', fontWeight: 500 }}>
                🔍 Auto-Fetch Coordinates by City Name
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Type any city (e.g. Manali, London, Tokyo)..."
                  value={autoCity}
                  onChange={e => setAutoCity(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                />
                <button
                  type="button"
                  onClick={handleAutoGeocode}
                  style={{
                    background: 'var(--accent-cyan)',
                    color: '#000',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontWeight: 600
                  }}
                >
                  Find Coords
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>Location / City Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Manali, Cochin Port"
                value={formName}
                onChange={e => setFormName(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>State / Region</label>
              <input
                type="text"
                placeholder="e.g. Himachal Pradesh"
                value={formState}
                onChange={e => setFormState(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>Latitude *</label>
              <input
                type="number"
                step="any"
                required
                placeholder="e.g. 32.2432"
                value={formLat}
                onChange={e => setFormLat(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>Longitude *</label>
              <input
                type="number"
                step="any"
                required
                placeholder="e.g. 77.1892"
                value={formLon}
                onChange={e => setFormLon(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <button
                type="button"
                onClick={handleTriggerMapPicker}
                style={{
                  background: 'rgba(255, 112, 67, 0.15)',
                  border: '1px solid rgba(255, 112, 67, 0.4)',
                  color: 'var(--accent-orange)',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                📍 Pick Coordinates from Map Click
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>Category</label>
              <select
                value={formCategory}
                onChange={e => setFormCategory(e.target.value)}
                style={{
                  background: '#1e293b',
                  border: '1px solid var(--card-border)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              >
                <option value="Custom Base">Custom Base</option>
                <option value="Tourist Spot">Tourist Spot</option>
                <option value="Hill Station">Hill Station</option>
                <option value="Coastal">Coastal</option>
                <option value="IT Hub">IT Hub</option>
                <option value="Capital">Capital</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>Description / Notes</label>
              <input
                type="text"
                placeholder="Optional telemetry notes..."
                value={formNotes}
                onChange={e => setFormNotes(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                gridColumn: 'span 2',
                background: editingId ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                color: 'white',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '0.95rem',
                marginTop: '8px'
              }}
            >
              {editingId ? '💾 Update Location Record' : '💾 Save Location to Database'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{
                  gridColumn: 'span 2',
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#fca5a5',
                  padding: '8px',
                  borderRadius: '10px',
                  fontWeight: 600
                }}
              >
                ✖️ Cancel Editing
              </button>
            )}
          </form>

          {/* Database Table Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>
                📊 Stored Location Records ({filteredLocations.length})
              </h3>
              <input
                type="text"
                placeholder="Filter table records..."
                value={tableSearch}
                onChange={e => setTableSearch(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  width: '220px'
                }}
              />
            </div>

            <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-sub)', borderBottom: '1px solid var(--card-border)' }}>
                    <th style={{ padding: '12px 16px' }}>Name</th>
                    <th style={{ padding: '12px 16px' }}>State</th>
                    <th style={{ padding: '12px 16px' }}>Category</th>
                    <th style={{ padding: '12px 16px' }}>Coordinates</th>
                    <th style={{ padding: '12px 16px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLocations.map(loc => (
                    <tr key={loc.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#fff' }}>{loc.name}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-sub)' }}>{loc.state || '-'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)' }}>
                          {loc.category || 'Base'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                        {parseFloat(loc.lat).toFixed(2)}, {parseFloat(loc.lon).toFixed(2)}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <button
                          onClick={() => {
                            selectLocation(loc);
                            setIsDbmsModalOpen(false);
                          }}
                          style={{
                            background: 'rgba(56, 189, 248, 0.15)',
                            border: '1px solid rgba(56, 189, 248, 0.4)',
                            color: 'var(--accent-cyan)',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            marginRight: '6px'
                          }}
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleStartEdit(loc)}
                          style={{
                            background: 'rgba(251, 191, 36, 0.15)',
                            border: '1px solid rgba(251, 191, 36, 0.4)',
                            color: 'var(--accent-amber)',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            marginRight: '6px'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteLocation(loc.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            color: '#fca5a5',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.75rem'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
