import React from 'react';
import { useWeather } from '../context/WeatherContext';

export default function ForecastGrid() {
  const { forecastData, formatTemp, loadingWeather, currentLocation } = useWeather();

  // If loading or no data yet, show a clean skeleton loader instead of popping in abruptly
  if (loadingWeather && (!forecastData || forecastData.length === 0)) {
    return (
      <div style={{ marginTop: '24px' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '14px', color: '#fff' }}>
          📅 Loading 5-Day Forecast...
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '14px'
          }}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '16px',
                height: '140px',
                animation: 'pulse 1.5s infinite ease-in-out'
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!forecastData || forecastData.length === 0) return null;

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Section Header */}
      <div
        style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#fff'
        }}
      >
        📅 5-Day Weather Forecast for {currentLocation?.name || 'Selected Area'}
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '14px'
        }}
      >
        {forecastData.map((item) => {
          const dateObj = new Date(item.dt * 1000);
          const dateStr = dateObj.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          });
          const temp = item.main?.temp;
          const condition = item.weather?.[0]?.description || 'Clear';
          const iconCode = item.weather?.[0]?.icon || '02d';
          const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

          return (
            <div
              key={item.dt}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '16px 12px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease'
              }}
            >
              {/* Day / Date */}
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--accent-cyan, #38bdf8)'
                }}
              >
                {dateStr}
              </div>

              {/* Weather Icon */}
              <img
                src={iconUrl}
                alt={condition}
                style={{
                  width: '52px',
                  height: '52px',
                  margin: '4px auto',
                  filter: 'drop-shadow(0 2px 8px rgba(56, 189, 248, 0.3))'
                }}
              />

              {/* Temperature */}
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                {temp !== undefined ? formatTemp(temp) : '--'}
              </div>

              {/* Weather Description */}
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-sub, #94a3b8)',
                  textTransform: 'capitalize',
                  marginTop: '4px',
                  lineHeight: 1.2
                }}
              >
                {condition}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
