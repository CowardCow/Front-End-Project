// src/context/WeatherContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WeatherContext = createContext();

const API_KEY = 'eb54a61865a9338c289d39b7cc5e19f0';

const defaultSeedLocations = [
  { id: '1', name: "Mumbai", state: "Maharashtra", lat: 19.0760, lon: 72.8777, category: "Financial Hub", notes: "Maharashtra Capital" },
  { id: '2', name: "New Delhi", state: "Delhi", lat: 28.6139, lon: 77.2090, category: "Capital", notes: "National Capital" },
  { id: '3', name: "Bengaluru", state: "Karnataka", lat: 12.9716, lon: 77.5946, category: "IT Hub", notes: "Silicon Valley of India" },
  { id: '4', name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707, category: "Coastal", notes: "Tamil Nadu Capital" },
  { id: '5', name: "Kolkata", state: "West Bengal", lat: 22.5726, lon: 88.3639, category: "Cultural Hub", notes: "City of Joy" },
  { id: '6', name: "Jaipur", state: "Rajasthan", lat: 26.9124, lon: 75.7873, category: "Heritage", notes: "Pink City" },
  { id: '7', name: "Panaji", state: "Goa", lat: 15.4989, lon: 73.8278, category: "Coastal", notes: "Beach Resort" },
  { id: '8', name: "Shimla", state: "Himachal Pradesh", lat: 31.1048, lon: 77.1734, category: "Hill Station", notes: "Popular Hill Station" }
];

export function WeatherProvider({ children }) {
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDbmsModalOpen, setIsDbmsModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  // Temperature Formatter
  const formatTemp = useCallback((celsius) => {
    if (celsius === undefined || celsius === null || isNaN(celsius)) return '--';
    if (isFahrenheit) {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(celsius)}°C`;
  }, [isFahrenheit]);

  // Load Locations safely from LocalStorage (with seed fallback)
  const loadLocations = useCallback(() => {
    const localData = localStorage.getItem('weather_dbms_locations');
    let dataToLoad = defaultSeedLocations;
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          dataToLoad = parsed;
        }
      } catch (e) {
        dataToLoad = defaultSeedLocations;
      }
    } else {
      localStorage.setItem('weather_dbms_locations', JSON.stringify(defaultSeedLocations));
    }

    setLocations(dataToLoad);
    setCurrentLocation(prev => prev || dataToLoad[0]);
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  // Fetch OpenWeather Telemetry
  const fetchTelemetry = useCallback(async (lat, lon) => {
    if (lat === undefined || lon === undefined || lat === null || lon === null) return;
    setLoadingWeather(true);
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

      const [wRes, fRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl)
      ]);

      if (wRes.ok) {
        const wData = await wRes.json();
        setWeatherData(wData);
      }
      if (fRes.ok) {
        const fData = await fRes.json();
        const daily = fData.list.filter(item => item.dt_txt && item.dt_txt.includes('12:00:00'));
        setForecastData(daily.length > 0 ? daily : fData.list.slice(0, 5));
      }
    } catch (err) {
      showToast(`Error fetching weather: ${err.message}`, 'error');
    } finally {
      setLoadingWeather(false);
    }
  }, [showToast]);

  // Auto-fetch whenever active location changes
  useEffect(() => {
    if (currentLocation && currentLocation.lat !== undefined && currentLocation.lon !== undefined) {
      fetchTelemetry(currentLocation.lat, currentLocation.lon);
    }
  }, [currentLocation, fetchTelemetry]);

  // Select Location Handler
  const selectLocation = useCallback((loc) => {
    if (!loc) return;
    const formattedLoc = {
      id: loc.id || `custom-${Date.now()}`,
      name: loc.name || loc.state || 'Selected Location',
      state: loc.state || loc.name || '',
      lat: Number(loc.lat),
      lon: Number(loc.lon),
      category: loc.category || 'Map Selection',
      notes: loc.notes || 'Selected from Map'
    };
    setCurrentLocation(formattedLoc);
  }, []);

  // CRUD Helpers using LocalStorage
  const addLocation = (newLoc) => {
    const locWithId = { ...newLoc, id: Date.now().toString() };
    const updated = [locWithId, ...locations];
    setLocations(updated);
    localStorage.setItem('weather_dbms_locations', JSON.stringify(updated));
    setCurrentLocation(locWithId);
    showToast(`Saved location "${newLoc.name}"!`);
    return true;
  };

  const deleteLocation = (id) => {
    const filtered = locations.filter(l => l.id !== id);
    setLocations(filtered);
    localStorage.setItem('weather_dbms_locations', JSON.stringify(filtered));
    if (currentLocation && currentLocation.id === id && filtered.length > 0) {
      setCurrentLocation(filtered[0]);
    }
    showToast('Deleted location record!');
    return true;
  };

  return (
    <WeatherContext.Provider
      value={{
        locations,
        currentLocation,
        weatherData,
        forecastData,
        aqiData,
        loadingWeather,
        isFahrenheit,
        setIsFahrenheit,
        searchQuery,
        setSearchQuery,
        isDbmsModalOpen,
        setIsDbmsModalOpen,
        toasts,
        showToast,
        formatTemp,
        selectLocation,
        addLocation,
        deleteLocation,
        fetchTelemetry
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
