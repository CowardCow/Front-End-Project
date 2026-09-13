import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WeatherContext = createContext();

const API_KEY = 'eb54a61865a9338c289d39b7cc5e19f0';

const defaultSeedLocations = [
  { id: '1', name: "Mumbai", state: "Maharashtra", lat: 19.0760, lon: 72.8777, category: "Financial Hub", notes: "Maharashtra Capital" },
  { id: '2', name: "New Delhi", state: "Delhi", lat: 28.6139, lon: 77.2090, category: "Capital", notes: "National Capital Territory" },
  { id: '3', name: "Bengaluru", state: "Karnataka", lat: 12.9716, lon: 77.5946, category: "IT Hub", notes: "Silicon Valley of India" },
  { id: '4', name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707, category: "Coastal", notes: "Tamil Nadu Capital" },
  { id: '5', name: "Kolkata", state: "West Bengal", lat: 22.5726, lon: 88.3639, category: "Cultural Hub", notes: "City of Joy" },
  { id: '6', name: "Jaipur", state: "Rajasthan", lat: 26.9124, lon: 75.7873, category: "Heritage", notes: "Pink City of India" },
  { id: '7', name: "Panaji", state: "Goa", lat: 15.4989, lon: 73.8278, category: "Coastal", notes: "Goa Capital & Beach Resort" },
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
  const [isMapPickerActive, setIsMapPickerActive] = useState(false);
  const [pickedCoords, setPickedCoords] = useState(null);
  const [isDbmsModalOpen, setIsDbmsModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast Notification Trigger
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  // Temperature Formatter Helper
  const formatTemp = useCallback((celsius) => {
    if (celsius === undefined || celsius === null || isNaN(celsius)) return '--';
    if (isFahrenheit) {
      return `${Math.round((celsius * 9 / 5) + 32)}°F`;
    }
    return `${Math.round(celsius)}°C`;
  }, [isFahrenheit]);

  // Load Locations from API or LocalStorage
  const loadLocations = useCallback(async () => {
    try {
      const res = await fetch('/api/locations');
      if (res.ok) {
        const data = await res.json();
        setLocations(data);
        if (data.length > 0 && !currentLocation) {
          setCurrentLocation(data[0]);
        }
        return;
      }
      throw new Error('API unavailable');
    } catch (err) {
      const localData = localStorage.getItem('weather_dbms_locations');
      if (localData) {
        const parsed = JSON.parse(localData);
        setLocations(parsed);
        if (parsed.length > 0 && !currentLocation) {
          setCurrentLocation(parsed[0]);
        }
      } else {
        setLocations(defaultSeedLocations);
        localStorage.setItem('weather_dbms_locations', JSON.stringify(defaultSeedLocations));
        if (!currentLocation) {
          setCurrentLocation(defaultSeedLocations[0]);
        }
      }
    }
  }, [currentLocation]);

  useEffect(() => {
    loadLocations();
  }, []);

  // Fetch Weather, Forecast & AQI Telemetry
  const fetchTelemetry = useCallback(async (lat, lon) => {
    if (lat === undefined || lon === undefined) return;
    setLoadingWeather(true);
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

      const [wRes, fRes, aRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl),
        fetch(aqiUrl)
      ]);

      if (wRes.ok) {
        const wData = await wRes.json();
        setWeatherData(wData);
      }
      if (fRes.ok) {
        const fData = await fRes.json();
        // Filter daily 12:00:00 forecasts for 5-day summaries
        const daily = fData.list.filter(item => item.dt_txt.includes('12:00:00'));
        setForecastData(daily.length > 0 ? daily : fData.list.slice(0, 5));
      }
      if (aRes.ok) {
        const aData = await aRes.json();
        setAqiData(aData.list ? aData.list[0] : null);
      }
    } catch (err) {
      showToast(`Error fetching weather telemetry: ${err.message}`, 'error');
    } finally {
      setLoadingWeather(false);
    }
  }, [showToast]);

  // When active location changes, load its weather telemetry
  useEffect(() => {
    if (currentLocation) {
      fetchTelemetry(currentLocation.lat, currentLocation.lon);
    }
  }, [currentLocation, fetchTelemetry]);

  // Select Location
  const selectLocation = useCallback((loc) => {
    setCurrentLocation(loc);
  }, []);

  // Add Location
  const addLocation = async (newLoc) => {
    try {
      const res = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLoc)
      });
      if (res.ok) {
        const savedLoc = await res.json();
        setLocations(prev => [savedLoc, ...prev]);
        setCurrentLocation(savedLoc);
        showToast(`Saved location "${savedLoc.name}" to database!`);
        return true;
      }
    } catch (err) {
      // LocalStorage fallback
      const locWithId = { ...newLoc, id: Date.now().toString() };
      const updated = [locWithId, ...locations];
      setLocations(updated);
      localStorage.setItem('weather_dbms_locations', JSON.stringify(updated));
      setCurrentLocation(locWithId);
      showToast(`Saved location "${newLoc.name}" locally!`);
      return true;
    }
    return false;
  };

  // Update Location
  const updateLocation = async (id, updatedFields) => {
    try {
      const res = await fetch(`/api/locations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        const updated = await res.json();
        setLocations(prev => prev.map(l => l.id === id ? updated : l));
        if (currentLocation && currentLocation.id === id) {
          setCurrentLocation(updated);
        }
        showToast(`Updated record for "${updated.name}"!`);
        return true;
      }
    } catch (err) {
      const updated = locations.map(l => l.id === id ? { ...l, ...updatedFields } : l);
      setLocations(updated);
      localStorage.setItem('weather_dbms_locations', JSON.stringify(updated));
      if (currentLocation && currentLocation.id === id) {
        setCurrentLocation(locations.find(l => l.id === id));
      }
      showToast(`Updated record locally!`);
      return true;
    }
    return false;
  };

  // Delete Location
  const deleteLocation = async (id) => {
    const target = locations.find(l => l.id === id);
    try {
      const res = await fetch(`/api/locations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const filtered = locations.filter(l => l.id !== id);
        setLocations(filtered);
        if (currentLocation && currentLocation.id === id && filtered.length > 0) {
          setCurrentLocation(filtered[0]);
        }
        showToast(`Deleted record "${target?.name || id}"!`);
        return true;
      }
    } catch (err) {
      const filtered = locations.filter(l => l.id !== id);
      setLocations(filtered);
      localStorage.setItem('weather_dbms_locations', JSON.stringify(filtered));
      if (currentLocation && currentLocation.id === id && filtered.length > 0) {
        setCurrentLocation(filtered[0]);
      }
      showToast(`Deleted record locally!`);
      return true;
    }
    return false;
  };

  // Export JSON Database
  const exportToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(locations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `weather_locations_db_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Exported database to JSON file!");
  };

  // Import JSON Database
  const importLocations = (importedArray) => {
    if (!Array.isArray(importedArray)) {
      showToast("Invalid JSON file format. Expected an array of locations.", "error");
      return;
    }
    setLocations(importedArray);
    localStorage.setItem('weather_dbms_locations', JSON.stringify(importedArray));
    if (importedArray.length > 0) {
      setCurrentLocation(importedArray[0]);
    }
    showToast(`Successfully imported ${importedArray.length} location records!`);
  };

  // Auto-Geocode lookup helper
  const geocodeCity = async (cityQuery) => {
    if (!cityQuery) return null;
    try {
      const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityQuery)}&limit=1&appid=${API_KEY}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          return {
            name: data[0].name,
            state: data[0].state || data[0].country,
            lat: data[0].lat,
            lon: data[0].lon
          };
        }
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  return (
    <WeatherContext.Provider value={{
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
      isMapPickerActive,
      setIsMapPickerActive,
      pickedCoords,
      setPickedCoords,
      isDbmsModalOpen,
      setIsDbmsModalOpen,
      toasts,
      showToast,
      formatTemp,
      selectLocation,
      addLocation,
      updateLocation,
      deleteLocation,
      exportToJson,
      importLocations,
      geocodeCity,
      fetchTelemetry
    }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  return useContext(WeatherContext);
}
