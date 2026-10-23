import React, { useState, useEffect } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite, selectIsFavorite } from '../redux/favoritesSlice';
import TextInput from './common/form/TextInput';
import SelectInput from './common/form/SelectInput';
import TextAreaInput from './common/form/TextAreaInput';
import Button from './common/form/Button';
import { useFormValidation } from '../hooks/useFormValidation';

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

  const dispatch = useDispatch();
  const favoriteIds = useSelector((state) => state.favorites.favoriteIds);

  const [editingId, setEditingId] = useState(null);
  const [tableSearch, setTableSearch] = useState('');
  const [autoCity, setAutoCity] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Form validation setup
  const validationRules = {
    name: [
      { required: true, message: 'Location name is required.' },
      { minLength: 2, message: 'Location name must be at least 2 characters.' }
    ],
    state: [
      { required: true, message: 'State / Region is required.' }
    ],
    lat: [
      { required: true, message: 'Latitude coordinate is required.' },
      { isNumeric: true, message: 'Latitude must be a valid decimal number.' },
      { min: -90, message: 'Latitude must be between -90 and 90.' },
      { max: 90, message: 'Latitude must be between -90 and 90.' }
    ],
    lon: [
      { required: true, message: 'Longitude coordinate is required.' },
      { isNumeric: true, message: 'Longitude must be a valid decimal number.' },
      { min: -180, message: 'Longitude must be between -180 and 180.' },
      { max: 180, message: 'Longitude must be between -180 and 180.' }
    ]
  };

  const initialFormState = {
    name: '',
    state: '',
    lat: '',
    lon: '',
    category: 'Custom Base',
    notes: ''
  };

  const {
    values,
    setValues,
    errors,
    touched,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
    validateAll,
    resetForm
  } = useFormValidation(initialFormState, validationRules);

  // Update lat/lon when map picker captures coordinates
  useEffect(() => {
    if (pickedCoords) {
      setFieldValue('lat', pickedCoords.lat);
      setFieldValue('lon', pickedCoords.lon);
      setPickedCoords(null);
    }
  }, [pickedCoords, setPickedCoords, setFieldValue]);

  if (!isDbmsModalOpen) return null;

  const handleAutoGeocode = async () => {
    if (!autoCity.trim()) {
      showToast('Please enter a city name to search.', 'error');
      return;
    }
    setIsGeocoding(true);
    try {
      const result = await geocodeCity(autoCity.trim());
      if (result) {
        setFieldValue('name', result.name);
        setFieldValue('state', result.state || '');
        setFieldValue('lat', result.lat);
        setFieldValue('lon', result.lon);
        showToast(`Auto-fetched coordinates for ${result.name}!`, 'success');
      } else {
        showToast(`Could not find coordinates for "${autoCity}".`, 'error');
      }
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleStartEdit = (loc) => {
    setEditingId(loc.id);
    setValues({
      name: loc.name || '',
      state: loc.state || '',
      lat: String(loc.lat),
      lon: String(loc.lon),
      category: loc.category || 'Custom Base',
      notes: loc.notes || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const isValid = validateAll();
    if (!isValid) {
      showToast('Please fix the highlighted validation errors.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: values.name.trim(),
        state: values.state.trim(),
        lat: parseFloat(values.lat),
        lon: parseFloat(values.lon),
        category: values.category,
        notes: values.notes.trim()
      };

      if (editingId) {
        await updateLocation(editingId, payload);
        setEditingId(null);
      } else {
        await addLocation(payload);
      }

      resetForm();
    } finally {
      setIsSubmitting(false);
    }
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

  const categoryOptions = [
    { value: 'Custom Base', label: 'Custom Base' },
    { value: 'Capital', label: 'Capital' },
    { value: 'IT Hub', label: 'IT Hub' },
    { value: 'Coastal', label: 'Coastal' },
    { value: 'Hill Station', label: 'Hill Station' },
    { value: 'Tourist Spot', label: 'Tourist Spot' },
    { value: 'Heritage', label: 'Heritage' }
  ];

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
        background: 'var(--modal-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '960px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--card-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                🗄️ Location Database Manager
              </h2>
              
            </div>
           
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Button size="sm" variant="secondary" onClick={exportToJson} icon="📥">
              Export JSON
            </Button>
            <label style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--card-border)',
              color: 'var(--text-main)',
              padding: '6px 12px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              📤 Import JSON
              <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            <button
              onClick={() => setIsDbmsModalOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: 'var(--text-main)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                fontSize: '1.1rem',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Reusable Form Section */}
          <form onSubmit={handleSave} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            background: 'var(--card-bg)',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid var(--card-border)'
          }}>
            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 600 }}>
                {editingId ? '✏️ Edit Location Record' : '➕ Add New Custom Location Record'}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--accent-orange)' }}>
                * Required Fields
              </span>
            </div>

            {/* Auto Geocode Input */}
            <div style={{
              gridColumn: 'span 2',
              background: 'rgba(56, 189, 248, 0.05)',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <label style={{ fontSize: '0.84rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                🔍 Auto-Fetch Coordinates by City Name (OpenWeather Geocoding)
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Type any city (e.g. Manali, London, Tokyo, Paris)..."
                  value={autoCity}
                  onChange={e => setAutoCity(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAutoGeocode(); } }}
                  style={{
                    flex: 1,
                    background: 'var(--input-bg)',
                    border: '1px solid var(--input-border)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem'
                  }}
                />
                <Button
                  size="sm"
                  onClick={handleAutoGeocode}
                  isLoading={isGeocoding}
                >
                  Find Coords
                </Button>
              </div>
            </div>

            {/* Reusable Form Inputs */}
            <TextInput
              label="Location / City Name"
              name="name"
              required
              placeholder="e.g. Manali, Cochin Port"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
              icon="🏙️"
            />

            <TextInput
              label="State / Region"
              name="state"
              required
              placeholder="e.g. Himachal Pradesh"
              value={values.state}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.state}
              touched={touched.state}
              icon="📍"
            />

            <TextInput
              label="Latitude"
              name="lat"
              type="number"
              step="any"
              required
              placeholder="e.g. 32.2432 (-90 to 90)"
              value={values.lat}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.lat}
              touched={touched.lat}
              icon="🌐"
              helperText="Valid latitude: -90.0 to 90.0"
            />

            <TextInput
              label="Longitude"
              name="lon"
              type="number"
              step="any"
              required
              placeholder="e.g. 77.1892 (-180 to 180)"
              value={values.lon}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.lon}
              touched={touched.lon}
              icon="🌐"
              helperText="Valid longitude: -180.0 to 180.0"
            />

            <div style={{ gridColumn: 'span 2' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTriggerMapPicker}
                icon="📍"
              >
                Pick Coordinates Directly from Map Click
              </Button>
            </div>

            <SelectInput
              label="Category"
              name="category"
              value={values.category}
              onChange={handleChange}
              onBlur={handleBlur}
              options={categoryOptions}
              icon="🏷️"
            />

            <TextInput
              label="Short Notes / Description"
              name="notes"
              placeholder="e.g. Mountain valley, major port, high-altitude outpost..."
              value={values.notes}
              onChange={handleChange}
              onBlur={handleBlur}
              icon="📝"
            />

            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px', marginTop: '8px' }}>
              <Button
                type="submit"
                variant={editingId ? 'secondary' : 'success'}
                isLoading={isSubmitting}
                style={{ flex: 1 }}
                icon="💾"
              >
                {editingId ? 'Update Location Record' : 'Save Location to Database'}
              </Button>

              {editingId && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={handleCancelEdit}
                  icon="✖️"
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>

          {/* Database Table Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 600 }}>
                📊 Stored Location Records ({filteredLocations.length})
              </h3>
              <input
                type="text"
                placeholder="Search table records..."
                value={tableSearch}
                onChange={e => setTableSearch(e.target.value)}
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  width: '240px'
                }}
              />
            </div>

            <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-sub)', borderBottom: '1px solid var(--card-border)' }}>
                    <th style={{ padding: '12px 16px' }}>Fav </th>
                    <th style={{ padding: '12px 16px' }}>Name</th>
                    <th style={{ padding: '12px 16px' }}>State</th>
                    <th style={{ padding: '12px 16px' }}>Category</th>
                    <th style={{ padding: '12px 16px' }}>Coordinates</th>
                    <th style={{ padding: '12px 16px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLocations.map(loc => {
                    const isFav = favoriteIds.includes(String(loc.id));
                    return (
                      <tr key={loc.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => {
                              dispatch(toggleFavorite(loc.id));
                              showToast(isFav ? `Removed ${loc.name} from Redux Favorites` : `Added ${loc.name} to Redux Favorites!`);
                            }}
                            title={isFav ? 'Remove from Favorites' : 'Add to Favorites'}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '1.2rem',
                              padding: '2px 6px'
                            }}
                          >
                            {isFav ? '❤️' : '🤍'}
                          </button>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-main)' }}>{loc.name}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-sub)' }}>{loc.state || '-'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', background: 'var(--badge-bg)', color: 'var(--accent-cyan)' }}>
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
                              marginRight: '6px',
                              cursor: 'pointer'
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
                              marginRight: '6px',
                              cursor: 'pointer'
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
                              fontSize: '0.75rem',
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
          </div>

        </div>
      </div>
    </div>
  );
}
