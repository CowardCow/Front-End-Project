import React, { useState, useEffect } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../redux/favoritesSlice';
import { useNavigate } from 'react-router-dom';
import TextInput from '../components/common/form/TextInput';
import Button from '../components/common/form/Button';

const API_KEY = 'eb54a61865a9338c289d39b7cc5e19f0';

export default function QuickSearchPage() {
  const [cityInput, setCityInput] = useState('New Delhi');
  const [weather, setWeather] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { formatTemp, addLocation, selectLocation, showToast } = useWeather();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = async (cityToSearch = cityInput) => {
    if (!cityToSearch.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityToSearch.trim())}&appid=${API_KEY}&units=metric`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'City not found');
      }
      setWeather(data);
    } catch (err) {
      setErrorMsg(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch('New Delhi');
  }, []);

  const handleSaveToDbms = async () => {
    if (!weather) return;
    const newLoc = {
      name: weather.name,
      state: weather.sys?.country || 'Global',
      lat: weather.coord.lat,
      lon: weather.coord.lon,
      category: 'Quick Search',
      notes: `Captured via Quick Search (${weather.weather?.[0]?.description})`
    };
    await addLocation(newLoc);
    showToast(`Added ${weather.name} to DBMS Database!`);
  };

  const handleInspectOnMap = () => {
    if (!weather) return;
    selectLocation({
      id: `quick-${weather.id}`,
      name: weather.name,
      state: weather.sys?.country || 'Global',
      lat: weather.coord.lat,
      lon: weather.coord.lon,
      category: 'Quick Search'
    });
    navigate('/portal');
  };

  return (
    <div style={{
      maxWidth: '720px',
      margin: '30px auto',
      padding: '0 20px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--card-border)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              ⚡ Quick Global Weather Search
            </h2>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem', marginTop: '4px' }}>
              Query live OpenWeather telemetry for any city across the world.
            </p>
          </div>
        </div>

        {/* Search Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}
        >
          <div style={{ flex: 1 }}>
            <TextInput
              placeholder="Search any city (e.g., Tokyo, London, Sydney, Manali)..."
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              icon="🔍"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            icon="Search"
          >
            Query
          </Button>
        </form>

        {/* Quick Suggestion Pills */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
          {['Tokyo', 'London', 'Paris', 'New York', 'Dubai', 'Singapore', 'Sydney'].map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => {
                setCityInput(city);
                handleSearch(city);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--card-border)',
                color: 'var(--text-sub)',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div style={{
            marginTop: '20px',
            padding: '14px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            color: '#f87171',
            fontSize: '0.88rem'
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Weather Results */}
        {weather && (
          <div style={{
            marginTop: '24px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--card-border)',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  {weather.name}, {weather.sys?.country}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                  Lat: {weather.coord?.lat.toFixed(2)}°, Lon: {weather.coord?.lon.toFixed(2)}°
                </span>
              </div>

              <span style={{
                fontSize: '0.8rem',
                padding: '4px 10px',
                borderRadius: '12px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: 'var(--accent-cyan)',
                fontWeight: 600,
                textTransform: 'capitalize'
              }}>
                {weather.weather?.[0]?.description}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                {formatTemp(weather.main?.temp)}
              </span>
              <span style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>
                Feels like {formatTemp(weather.main?.feels_like)}
              </span>
            </div>

            {/* Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              padding: '14px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--card-border)'
            }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-sub)' }}>Humidity</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  💧 {weather.main?.humidity}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-sub)' }}>Wind</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  💨 {weather.wind?.speed} m/s
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-sub)' }}>Pressure</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  ⏱️ {weather.main?.pressure} hPa
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <Button
                variant="success"
                onClick={handleSaveToDbms}
                style={{ flex: 1 }}
                icon="💾"
              >
                Save to DBMS
              </Button>

              <Button
                variant="outline"
                onClick={handleInspectOnMap}
                style={{ flex: 1 }}
                icon="🗺️"
              >
                Inspect on Map
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
