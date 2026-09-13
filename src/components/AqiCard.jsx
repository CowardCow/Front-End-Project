import React from 'react';
import { useWeather } from '../context/WeatherContext';

// CPCB-style Indian AQI breakpoints.
// OpenWeather supplies pollutant concentrations in µg/m³; CO is converted to mg/m³.
// Because the OpenWeather endpoint is current/hourly data rather than CPCB's required
// averaging windows, this is presented as an estimated India AQI.
const BREAKPOINTS = {
  pm2_5: [
    [0, 30, 0, 50], [31, 60, 51, 100], [61, 90, 101, 200],
    [91, 120, 201, 300], [121, 250, 301, 400], [251, 380, 401, 500]
  ],
  pm10: [
    [0, 50, 0, 50], [51, 100, 51, 100], [101, 250, 101, 200],
    [251, 350, 201, 300], [351, 430, 301, 400], [431, 510, 401, 500]
  ],
  no2: [
    [0, 40, 0, 50], [41, 80, 51, 100], [81, 180, 101, 200],
    [181, 280, 201, 300], [281, 400, 301, 400], [401, 520, 401, 500]
  ],
  so2: [
    [0, 40, 0, 50], [41, 80, 51, 100], [81, 380, 101, 200],
    [381, 800, 201, 300], [801, 1600, 301, 400], [1601, 2620, 401, 500]
  ],
  o3: [
    [0, 50, 0, 50], [51, 100, 51, 100], [101, 168, 101, 200],
    [169, 208, 201, 300], [209, 748, 301, 400], [749, 1000, 401, 500]
  ],
  nh3: [
    [0, 200, 0, 50], [201, 400, 51, 100], [401, 800, 101, 200],
    [801, 1200, 201, 300], [1201, 1800, 301, 400], [1801, 2400, 401, 500]
  ],
  co: [
    [0, 1, 0, 50], [1.1, 2, 51, 100], [2.1, 10, 101, 200],
    [10.1, 17, 201, 300], [17.1, 34, 301, 400], [34.1, 50, 401, 500]
  ]
};

const LABELS = [
  { min: 0, max: 50, label: 'Good', icon: '🟢', bg: '#10b981', color: '#fff' },
  { min: 51, max: 100, label: 'Satisfactory', icon: '🟡', bg: '#84cc16', color: '#000' },
  { min: 101, max: 200, label: 'Moderate', icon: '🟠', bg: '#f59e0b', color: '#000' },
  { min: 201, max: 300, label: 'Poor', icon: '🔴', bg: '#f97316', color: '#fff' },
  { min: 301, max: 400, label: 'Very Poor', icon: '🟣', bg: '#ef4444', color: '#fff' },
  { min: 401, max: 500, label: 'Severe', icon: '🟥', bg: '#991b1b', color: '#fff' }
];

function calculateSubIndex(value, ranges) {
  if (!Number.isFinite(value) || value < 0) return null;

  for (const [low, high, indexLow, indexHigh] of ranges) {
    if (value >= low && value <= high) {
      if (high === low) return indexHigh;
      return indexLow + ((value - low) * (indexHigh - indexLow)) / (high - low);
    }
  }

  // Values above the highest breakpoint are capped at the top of the AQI scale.
  return value > ranges[ranges.length - 1][1] ? 500 : null;
}

function getIndiaAqi(components) {
  const values = {
    pm2_5: Number(components.pm2_5),
    pm10: Number(components.pm10),
    no2: Number(components.no2),
    so2: Number(components.so2),
    o3: Number(components.o3),
    nh3: Number(components.nh3),
    // OpenWeather reports CO in µg/m³; CPCB breakpoints for CO are mg/m³.
    co: Number(components.co) / 1000
  };

  const subIndexes = Object.entries(values)
    .map(([pollutant, value]) => ({
      pollutant,
      value,
      index: calculateSubIndex(value, BREAKPOINTS[pollutant])
    }))
    .filter(item => item.index !== null);

  if (subIndexes.length === 0) return null;

  return subIndexes.reduce((worst, current) =>
    current.index > worst.index ? current : worst
  );
}

function getAqiDetails(index) {
  const rounded = Math.round(index);
  return LABELS.find(item => rounded >= item.min && rounded <= item.max) || LABELS[LABELS.length - 1];
}

const pollutantNames = {
  pm2_5: 'PM2.5',
  pm10: 'PM10',
  no2: 'NO₂',
  so2: 'SO₂',
  o3: 'O₃',
  nh3: 'NH₃',
  co: 'CO'
};

export default function AqiCard() {
  const { aqiData } = useWeather();

  if (!aqiData) return null;

  const components = aqiData.components || {};
  const result = getIndiaAqi(components);
  if (!result) return null;

  const aqiIndex = Math.round(result.index);
  const aqiInfo = getAqiDetails(aqiIndex);

  const pollutant = result.pollutant;
  const pollutantValue = pollutant === 'co'
    ? `${(Number(components.co) / 1000).toFixed(1)} mg/m³`
    : `${Number(components[pollutant]).toFixed(1)} µg/m³`;

  const cards = [
    ['pm2_5', 'PM2.5', 'µg/m³'],
    ['pm10', 'PM10', 'µg/m³'],
    ['no2', 'NO₂', 'µg/m³'],
    ['so2', 'SO₂', 'µg/m³'],
    ['o3', 'O₃', 'µg/m³'],
    ['nh3', 'NH₃', 'µg/m³'],
    ['co', 'CO', 'mg/m³']
  ];

  return (
    <div style={{
      marginTop: '20px',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '18px',
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <div>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--text-sub)', marginBottom: '6px' }}>
            India Air Quality Index
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '1rem',
              background: aqiInfo.bg,
              color: aqiInfo.color
            }}>
              {aqiIndex} — {aqiInfo.label} {aqiInfo.icon}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>
              Dominant pollutant: <strong>{pollutantNames[pollutant]}</strong> ({pollutantValue})
            </span>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))',
        gap: '8px'
      }}>
        {cards.map(([key, name, unit]) => {
          const raw = Number(components[key]);
          const value = key === 'co' ? raw / 1000 : raw;
          return (
            <div key={key} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '9px 10px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-sub)' }}>{name}</div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>
                {Number.isFinite(value) ? `${value.toFixed(1)} ${unit}` : '--'}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: '0.7rem', color: 'var(--text-sub)', lineHeight: 1.4 }}>
        Estimated using CPCB India AQI breakpoints. OpenWeather provides live pollutant
        concentrations, so this should be treated as an estimate rather than an official
        CPCB station reading.
      </div>
    </div>
  );
}
