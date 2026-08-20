# 🌤️ Codeverse Weather Portal & Location DBMS (React + Vite Edition)

A modern, feature-rich weather monitoring dashboard and location **Database Management System (DBMS)** rebuilt from the ground up with **React 18**, **Vite**, **Leaflet.js**, **OpenWeatherMap API**, and a custom **Node.js REST API backend**.

---

## ✨ Features

### ⚛️ Modern React 18 Architecture
- **Componentized Design System**: Clean, modular structure (`Navbar`, `InteractiveMap`, `WeatherHeroCard`, `AqiCard`, `ForecastGrid`, `DbmsModal`, `QuickSearch`, `LoginView`, `WelcomeView`).
- **React Context API**: Powered by `AuthContext` (session management) and `WeatherContext` (telemetry state, DBMS operations, toasts, unit toggling).

### 🗺️ Interactive Map & Coordinate Picker
- **Leaflet Dark Vector Map**: Smooth panning, zooming, and location markers across India and worldwide coordinates.
- **Satellite Imagery Toggle**: Toggle between CartoDB dark vector basemap and Esri high-resolution satellite imagery.
- **Map Click Coordinate Picker**: Click anywhere on the map to auto-capture latitude and longitude for custom locations.

### 🌤️ Weather & Environmental Intelligence
- **Real-Time Weather Metrics**: Live temperature, feels-like temperature, humidity, wind speed, and atmospheric pressure.
- **📅 5-Day Weather Forecast**: Daily forecast summaries with weather condition icons and temperatures.
- **🍃 Air Quality Index (AQI)**: Color-coded air quality status badges (Good 🟢, Fair 🟡, Moderate 🟧, Poor 🔴, Very Poor 🟣) with PM2.5, PM10, NO2, and O3 pollutant breakdown.
- **🌡️ Temperature Unit Switcher**: Toggle dynamically between Celsius (°C) and Fahrenheit (°F).

### 🗄️ Location DBMS (Database Management System)
- **Full CRUD Operations**:
  - **Create**: Add custom monitoring locations with category tags.
  - **Read**: Search, filter, and load telemetry for saved locations.
  - **Update (`PUT`)**: Edit existing location details in real-time.
  - **Delete (`DELETE`)**: Remove location records from persistent storage.
- **🔍 Auto-Geocode City Lookup**: Search any city worldwide (e.g. *Manali, Tokyo, London*) to auto-fetch coordinates using OpenWeather Geocoding API.
- **📥 JSON Database Export & Import**: One-click JSON backup file export and import.
- **🔔 Toast Notification System**: Glassmorphism toast alerts giving real-time feedback for DBMS actions.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, CSS3 Glassmorphic Design System, Outfit Google Font
- **Mapping Library**: Leaflet.js, OpenStreetMap / CARTO Basemaps / Esri Satellite
- **Weather API**: OpenWeatherMap API (Current Weather, 5-Day Forecast, Air Pollution, Direct Geocoding)
- **Backend API**: Node.js HTTP Server (`server.js`) with REST API endpoints & static SPA serving
- **Data Storage**: Persistent `locations_db.json` storage + LocalStorage fallback

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended) installed on your system.

### Running the Application

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Build the Production Bundle**:
   ```bash
   npm run build
   ```

3. **Start the REST Backend & Production App**:
   ```bash
   npm start
   ```
   Open `http://localhost:3000` in your web browser.

4. **Development Mode (Vite Dev Server)**:
   ```bash
   npm run dev
   ```

5. **Default Login Credentials**:
   - **Username**: `admin`
   - **Password**: `password`
   *(Or click "Sign Up" to create a new user account)*.

---

## 📡 REST API Endpoints

The Node.js server exposes the following endpoints at `http://localhost:3000`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/locations` | Retrieve all stored location records |
| `POST` | `/api/locations` | Add a new location record |
| `PUT` | `/api/locations/:id` | Update an existing location record by ID |
| `DELETE` | `/api/locations/:id` | Delete a location record by ID |

---

## 📝 License

This project is open-source and available under the MIT License.