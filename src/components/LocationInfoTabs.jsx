import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';

const tabs = [
  { id: 'history', label: 'History', icon: '🏛️' },
  { id: 'weather', label: 'Weather', icon: '🌤️' },
  { id: 'news', label: 'News', icon: '📰' },
  { id: 'culture', label: 'Culture', icon: '🎭' }
];

export default function LocationInfoTabs() {
  const [activeTab, setActiveTab] = useState('weather');
  const { currentLocation, weatherData, formatTemp } = useWeather();

  if (!currentLocation) return null;

  const city = currentLocation.name;
  const state = currentLocation.state || 'India';
  const condition = weatherData?.weather?.[0]?.description || 'Weather data is loading...';

  const content = {
    history: {
      title: `${city} — History`,
      body: `${city} is a location in ${state}. Explore the city's historical landmarks, important events and local heritage.`
    },
    weather: {
      title: `${city} — Current Weather`,
      body: `${condition}. Temperature: ${formatTemp(weatherData?.main?.temp)}. Humidity: ${weatherData?.main?.humidity ?? '--'}%. Wind: ${weatherData?.wind?.speed ?? '--'} m/s.`
    },
    news: {
      title: `${city} — News`,
      body: `This section is ready for location-specific news. Select another location on the map to switch the context automatically.`
    },
    culture: {
      title: `${city} — Culture`,
      body: `${city} has its own local food, festivals, languages, arts and traditions. Use this panel as the dedicated cultural information area.`
    }
  };

  return (
    <section className="location-info-card">
      <div className="info-tabs" role="tablist" aria-label="Location information">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`info-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="info-tab-content">
        <div>
          <p className="info-eyebrow">LOCATION INSIGHT</p>
          <h3>{content[activeTab].title}</h3>
          <p>{content[activeTab].body}</p>
        </div>
        <div className="info-location-badge">
          <strong>{city}</strong>
          <span>{state}</span>
        </div>
      </div>
    </section>
  );
}
