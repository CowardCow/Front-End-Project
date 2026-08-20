import React from 'react';
import { useWeather } from '../context/WeatherContext';

export default function ForecastGrid() {
  const { forecastData, formatTemp } = useWeather();

  if (!forecastData || forecastData.length === 0) return null;

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{
        fontSize: '1.1rem',
        fontWeight: 600,
        marginBottom: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        📅 5-Day Weather Forecast
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '14px'
      }}>
        {forecastData.map((item, index) => {
          const dateObj = new Date(item.dt * 1000);
          const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
          const temp = item.main?.temp;
          const condition = item.weather?.[0]?.description || '';
          const iconCode = item.weather?.[0]?.icon || '02d';
          const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

          return (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '14px',
                textAlign: 'center',
                transition: 'all 0.25s ease'
              }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                {dateStr}
              </div>
              <img
                src={iconUrl}
                alt={condition}
                style={{ width: '50px', height: '50px', margin: '4px auto' }}
              />
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                {formatTemp(temp)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', textTransform: 'capitalize', marginTop: '2px' }}>
                {condition}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
