import React from 'react';
import { useWeather } from '../context/WeatherContext';

// Estimated India/CPCB-style AQI from OpenWeather pollutant concentrations.
// OpenWeather's own AQI field is a 1-5 index, so it is not displayed as a 0-500 India AQI.
const BREAKPOINTS = {
  pm2_5: [[0, 30, 0, 50], [31, 60, 51, 100], [61, 90, 101, 200], [91, 120, 201, 300], [121, 250, 301, 400], [251, Infinity, 401, 500]],
  pm10: [[0, 50, 0, 50], [51, 100, 51, 100], [101, 250, 101, 200], [251, 350, 201, 300], [351, 430, 301, 400], [431, Infinity, 401, 500]],
  no2: [[0, 40, 0, 50], [41, 80, 51, 100], [81, 180, 101, 200], [181, 280, 201, 300], [281, 400, 301, 400], [401, Infinity, 401, 500]],
  so2: [[0, 40, 0, 50], [41, 80, 51, 100], [81, 380, 101, 200], [381, 800, 201, 300], [801, 1600, 301, 400], [1601, Infinity, 401, 500]],
  o3: [[0, 50, 0, 50], [51, 100, 51, 100], [101, 168, 101, 200], [169, 208, 201, 300], [209, 748, 301, 400], [749, Infinity, 401, 500]],
  nh3: [[0, 200, 0, 50], [201, 400, 51, 100], [401, 800, 101, 200], [801, 1200, 201, 300], [1201, 1800, 301, 400], [1801, Infinity, 401, 500]],
  co: [[0, 1, 0, 50], [1.1, 2, 51, 100], [2.1, 10, 101, 200], [10.1, 17, 201, 300], [17.1, 34, 301, 400], [34.1, Infinity, 401, 500]]
};

function subIndex(value, ranges) {
  if (value === undefined || value === null || Number.isNaN(Number(value))) return null;
  const c = Number(value);
  const bp = ranges.find(([lo, hi]) => c >= lo && c <= hi) || ranges[ranges.length - 1];
  const [cLow, cHigh, iLow, iHigh] = bp;
  return Math.round(((iHigh - iLow) / (cHigh - cLow)) * (c - cLow) + iLow);
}

function getAqi(components) {
  const values = { ...components };
  // OpenWeather gives CO in µg/m³; CPCB CO breakpoints are commonly expressed in mg/m³.
  if (values.co != null) values.co = Number(values.co) / 1000;

  const indices = {};
  Object.keys(BREAKPOINTS).forEach(key => {
    const index = subIndex(values[key], BREAKPOINTS[key]);
    if (index !== null) indices[key] = Math.min(500, Math.max(0, index));
  });

  const entries = Object.entries(indices);
  if (!entries.length) return { value: null, pollutant: null };
  entries.sort((a, b) => b[1] - a[1]);
  return { value: entries[0][1], pollutant: entries[0][0] };
}

function getAqiDetails(value) {
  if (value === null) return { label: 'AQI unavailable', desc: 'Air-quality data is not available for this location.', bg: '#64748b', color: '#fff' };
  if (value <= 50) return { label: `${value} - Good 🟢`, desc: 'Air quality is satisfactory and poses little or no risk.', bg: '#10b981', color: '#fff' };
  if (value <= 100) return { label: `${value} - Satisfactory 🟡`, desc: 'Air quality is acceptable; unusually sensitive people may be affected.', bg: '#84cc16', color: '#000' };
  if (value <= 200) return { label: `${value} - Moderate 🟠`, desc: 'Sensitive groups may experience health effects.', bg: '#f59e0b', color: '#000' };
  if (value <= 300) return { label: `${value} - Poor 🔴`, desc: 'Health effects may be experienced by the general population.', bg: '#ef4444', color: '#fff' };
  if (value <= 400) return { label: `${value} - Very Poor 🟣`, desc: 'Health alert: increased likelihood of adverse effects.', bg: '#8b5cf6', color: '#fff' };
  return { label: `${value} - Severe ⚫`, desc: 'Health warning of emergency conditions.', bg: '#111827', color: '#fff' };
}

export default function AqiCard() {
  const { aqiData } = useWeather();
  if (!aqiData) return null;

  const components = aqiData.components || {};
  const { value, pollutant } = getAqi(components);
  const aqiInfo = getAqiDetails(value);
  const pollutantNames = { pm2_5: 'PM2.5', pm10: 'PM10', no2: 'NO₂', so2: 'SO₂', o3: 'O₃', nh3: 'NH₃', co: 'CO' };

  return (
    <div style={{
      marginTop: '20px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '18px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px'
    }}>
      <div>
        <h4 style={{ fontSize: '0.95rem', color: 'var(--text-sub)', marginBottom: '4px' }}>Air Quality Index (India estimate)</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', background: aqiInfo.bg, color: aqiInfo.color }}>
            {aqiInfo.label}
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>{aqiInfo.desc}</span>
        </div>
        {pollutant && <div style={{ marginTop: '6px', fontSize: '0.72rem', color: 'var(--text-sub)' }}>Dominant pollutant: {pollutantNames[pollutant]}</div>}
      </div>

      <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-sub)', flexWrap: 'wrap' }}>
        {[
          ['PM2.5', 'pm2_5', 'µg/m³'], ['PM10', 'pm10', 'µg/m³'], ['NO₂', 'no2', 'µg/m³'], ['O₃', 'o3', 'µg/m³']
        ].map(([label, key, unit]) => (
          <span key={key} style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '4px 8px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            {label}: {components[key] != null ? `${Number(components[key]).toFixed(1)} ${unit}` : '--'}
          </span>
        ))}
      </div>
    </div>
  );
}
