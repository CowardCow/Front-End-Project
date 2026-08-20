import React from 'react';
import { useWeather } from '../context/WeatherContext';

export default function AqiCard() {
  const { aqiData } = useWeather();

  if (!aqiData) return null;

  const aqiIndex = aqiData.main?.aqi || 1;
  const components = aqiData.components || {};

  const getAqiDetails = (index) => {
    switch (index) {
      case 1:
        return { label: '1 - Good 🟢', desc: 'Air quality is considered satisfactory, and air pollution poses little or no risk.', bg: '#10b981', color: '#fff' };
      case 2:
        return { label: '2 - Fair 🟡', desc: 'Air quality is acceptable. Moderate health concern for very sensitive individuals.', bg: '#84cc16', color: '#000' };
      case 3:
        return { label: '3 - Moderate 🟧', desc: 'Members of sensitive groups may experience health effects.', bg: '#f59e0b', color: '#000' };
      case 4:
        return { label: '4 - Poor 🔴', desc: 'Everyone may begin to experience health effects.', bg: '#ef4444', color: '#fff' };
      case 5:
        return { label: '5 - Very Poor 🟣', desc: 'Health warnings of emergency conditions. The entire population is likely affected.', bg: '#8b5cf6', color: '#fff' };
      default:
        return { label: '1 - Good 🟢', desc: 'Air quality is satisfactory.', bg: '#10b981', color: '#fff' };
    }
  };

  const aqiInfo = getAqiDetails(aqiIndex);

  return (
    <div style={{
      marginTop: '20px',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '18px',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <div>
        <h4 style={{ fontSize: '0.95rem', color: 'var(--text-sub)', marginBottom: '4px' }}>
          Air Quality Index (AQI)
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
          <span style={{
            display: 'inline-block',
            padding: '4px 14px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.9rem',
            background: aqiInfo.bg,
            color: aqiInfo.color
          }}>
            {aqiInfo.label}
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>
            {aqiInfo.desc}
          </span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '12px',
        fontSize: '0.8rem',
        color: 'var(--text-sub)',
        flexWrap: 'wrap'
      }}>
        <span style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '4px 8px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          PM2.5: {components.pm2_5 ? `${components.pm2_5.toFixed(1)} µg/m³` : '--'}
        </span>
        <span style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '4px 8px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          PM10: {components.pm10 ? `${components.pm10.toFixed(1)} µg/m³` : '--'}
        </span>
        <span style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '4px 8px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          NO2: {components.no2 ? `${components.no2.toFixed(1)} µg/m³` : '--'}
        </span>
        <span style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '4px 8px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          O3: {components.o3 ? `${components.o3.toFixed(1)} µg/m³` : '--'}
        </span>
      </div>
    </div>
  );
}
