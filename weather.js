const apiKey = 'eb54a61865a9338c289d39b7cc5e19f0';

// ----------------------------------------------------------------------
// Option 1: Fetch by City Name (Free 2.5 API)
// ----------------------------------------------------------------------
async function fetchWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  return await getWeather(url);
}

// ----------------------------------------------------------------------
// Option 2: Fetch by Latitude & Longitude (Free 2.5 API)
// ----------------------------------------------------------------------
async function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  return await getWeather(url);
}

// Core fetch helper
async function getWeather(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`API Error (${data.cod}): ${data.message || response.statusText}`);
    }

    console.log(`\n🌤️ Weather for ${data.name}, ${data.sys.country}:`);
    console.log(`----------------------------------`);
    console.log(`🌡️ Temperature: ${data.main.temp}°C`);
    console.log(`☁️ Condition  : ${data.weather[0].description}`);
    console.log(`📍 Coordinates: ${data.coord.lat}, ${data.coord.lon}`);
    return data;
  } catch (error) {
    console.error('❌ Fetch Error:', error.message);
  }
}

// Execute tests
fetchWeatherByCity('London');
// fetchWeatherByCoords(51.5074, -0.1278); // London coordinates
