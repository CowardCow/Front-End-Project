import React, { useState, useEffect } from 'react';
import { useWeather } from '../context/WeatherContext';

const API_KEY = 'eb54a61865a9338c289d39b7cc5e19f0';

export default function QuickSearch({ setActiveView }) {
  const [cityInput, setCityInput] = useState('London');
  const [weather, setWeather] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { formatTemp } = useWeather();

  const handleSearch = async () => {
    if (!cityInput.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityInput.trim())}&appid=${API_KEY}&units=metric`;
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
    handleSearch();
  }, []);

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '0 20px',
      width: '100%'
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
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>⚡ Quick Weather Search</h2>
          <button
            onClick={() => setActiveView('portal')}
            style={{
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '10px',
              padding: '6px 12px',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            Interactive Map & DBMS &rarr;
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Enter city name (e.g. Manali, Tokyo, London)..."
            value={cityInput}
            onChange={e => setCityInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            style={{
              flex: 1,
              padding: '14px 18px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--card-border)',
              borderRadius: '14px',
              color: '#fff',
              fontSize: '1rem'
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
              border: 'none',
              color: '#fff',
              padding: '0 24px',
              borderRadius: '14px',
              fontWeight: 700
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '16px',
            borderRadius: '14px',
            fontSize: '0.9rem',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            ⚠️ <strong>Error:</strong> {errorMsg}
          </div>
        )}

        {weather && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.4s ease forwards' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>
              {weather.name}, {weather.sys?.country}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              {weather.weather?.[0]?.icon && (
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  style={{ width: '70px', height: '70px' }}
                />
              )}
              <div style={{ fontSize: '4rem', fontWeight: 800, color: '#38bdf8' }}>
                {formatTemp(weather.main?.temp)}
              </div>
            </div>

            <div style={{ fontSize: '1.1rem', textTransform: 'capitalize', color: '#cbd5e1', marginBottom: '24px' }}>
              {weather.weather?.[0]?.description}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '18px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>Feels Like</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                  {formatTemp(weather.main?.feels_like)}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>Humidity</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                  {weather.main?.humidity}%
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>Wind Speed</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                  {weather.wind?.speed} m/s
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
