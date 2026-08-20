import React from 'react';
import { useWeather } from '../context/WeatherContext';

export default function WeatherHeroCard() {
  const { currentLocation, weatherData, loadingWeather, formatTemp } = useWeather();

  if (!currentLocation) {
    return (
      <div style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--card-border)',
        borderRadius: '24px',
        padding: '28px',
        textAlign: 'center',
        color: 'var(--text-sub)'
      }}>
        Select a location from the sidebar or map to load live weather telemetry.
      </div>
    );
  }

  const temp = weatherData?.main?.temp;
  const feelsLike = weatherData?.main?.feels_like;
  const humidity = weatherData?.main?.humidity;
  const windSpeed = weatherData?.wind?.speed;
  const pressure = weatherData?.main?.pressure;
  const condition = weatherData?.weather?.[0]?.description || 'Loading weather...';
  const iconCode = weatherData?.weather?.[0]?.icon || '02d';
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return (
    <div style={{
      background: 'var(--card-bg)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--card-border)',
      borderRadius: '24px',
      padding: '28px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
      position: 'relative'
    }}>
      {loadingWeather && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '20px',
          fontSize: '0.8rem',
          color: 'var(--accent-cyan)'
        }}>
          Updating live weather telemetry...
        </div>
      )}

      {/* Main Title Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fff' }}>
            {currentLocation.name}
          </h2>
          <p style={{ color: 'var(--accent-cyan)', fontSize: '1.05rem', fontWeight: 500, marginTop: '4px' }}>
            State: {currentLocation.state || 'India'}
          </p>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginTop: '6px' }}>
            Lat: {parseFloat(currentLocation.lat).toFixed(4)} | Lon: {parseFloat(currentLocation.lon).toFixed(4)}
          </div>
        </div>

        {/* Temperature & Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img
            src={iconUrl}
            alt={condition}
            style={{
              width: '80px',
              height: '80px',
              filter: 'drop-shadow(0 4px 12px rgba(56, 189, 248, 0.4))'
            }}
          />
          <div>
            <div style={{ fontSize: '4.2rem', fontWeight: 800, lineHeight: 1, color: '#fff' }}>
              {formatTemp(temp)}
            </div>
            <div style={{
              fontSize: '1.1rem',
              color: 'var(--accent-cyan)',
              fontWeight: 500,
              textTransform: 'capitalize'
            }}>
              {condition}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '14px',
        marginTop: '24px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '6px' }}>🌡️</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', textTransform: 'uppercase' }}>Feels Like</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
            {formatTemp(feelsLike)}
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '6px' }}>💧</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', textTransform: 'uppercase' }}>Humidity</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
            {humidity !== undefined ? `${humidity}%` : '--'}
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '6px' }}>💨</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', textTransform: 'uppercase' }}>Wind Speed</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
            {windSpeed !== undefined ? `${windSpeed} m/s` : '--'}
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '6px' }}>⏲️</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', textTransform: 'uppercase' }}>Pressure</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
            {pressure !== undefined ? `${pressure} hPa` : '--'}
          </div>
        </div>
      </div>
    </div>
  );
}
