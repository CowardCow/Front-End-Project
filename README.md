# 🌤️ Codeverse Weather Portal & Location DBMS

A modern, feature-rich weather monitoring dashboard and location **Database Management System (DBMS)** built with Vanilla HTML5, CSS3 Glassmorphism, JavaScript (ES6+), Leaflet.js, OpenWeatherMap API, and a custom native Node.js REST backend.

---

## ✨ Features

### 🗺️ Interactive Vector Map & Location Picker
- **Interactive Leaflet Dark Vector Map**: Smooth panning, zooming, and location markers across India and worldwide coordinates.
- **Map Click Coordinate Picker**: Click anywhere on the interactive map to auto-capture latitude and longitude coordinates.
- **Google Satellite View Toggle**: Easily switch between dark vector maps and satellite imagery.

### 🌤️ Weather & Environmental Intelligence
- **Real-Time Weather Metrics**: Displays temperature, feels-like temperature, humidity, wind speed, and atmospheric pressure.
- **📅 5-Day Weather Forecast**: 5-day daily forecast summaries with weather condition icons.
- **🍃 Air Quality Index (AQI)**: Color-coded air quality status badges (Good 🟢, Fair 🟡, Moderate 🟧, Poor 🔴, Very Poor 🟣) along with PM2.5, PM10, NO2, and O3 pollutant metrics.
- **🌡️ Temperature Unit Switcher**: Toggle dynamically between Celsius (°C) and Fahrenheit (°F).

### 🗄️ Location Database Management System (DBMS)
- **Full CRUD Operations**:
  - **Create**: Add custom monitoring locations with category tags (Capital, Coastal, Hill Station, IT Hub, Heritage, Custom Base).
  - **Read**: Browse, search, filter, and load weather telemetry for saved locations.
  - **Update (`PUT`)**: Pre-fill and edit location details (name, state, coordinates, category, notes) in real-time.
  - **Delete (`DELETE`)**: Remove location records from the system.
- **🔍 Auto-Geocode City Lookup**: Type any city name (e.g. *Manali, Tokyo, London*) to auto-fetch coordinates.
- **📥 JSON Database Export & Import**: Export stored location records to `.json` backup files and import database backups with one click.
- **🔔 Toast Notification System**: Floating glassmorphism notifications providing real-time feedback for DBMS operations.

### 🔐 User Authentication & Session Management
- **User Authentication**: Client-side registration, login validation, and LocalStorage session persistence.
- **Protected Portal Access**: Automatic authentication guard redirecting unauthenticated users to `login.html`.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3 (Glassmorphism, CSS Variables, Animations), JavaScript (ES6+ Async/Await, Fetch API)
- **Mapping Library**: Leaflet.js, OpenStreetMap / CARTO Basemaps
- **Weather Telemetry**: OpenWeatherMap API (Current Weather, 5-Day Forecast, Air Pollution, Direct Geocoding)
- **Backend API**: Native Node.js HTTP Server (`server.js`) with zero external runtime npm dependencies
- **Data Storage**: Local JSON file storage (`locations_db.json`) + LocalStorage fallback

---

## 📁 Repository Structure

```
Front-End-Project/
├── server.js            # Node.js HTTP server & REST API (GET, POST, PUT, DELETE)
├── india_weather.html   # Main Interactive Weather Portal & Location DBMS Manager
├── index.html           # Standalone Quick Weather Search Widget
├── login.html           # Authentication & Account Registration Interface
├── welcome.html         # User Dashboard & Hub
├── script.js            # Authentication logic & route protection
├── style.css            # Modern glassmorphism design system
├── weather.js           # CLI testing utility for OpenWeather API queries
├── locations_db.json    # Persistent JSON storage for location DBMS
├── Bell_Icon.jpeg       # Notification icon asset
├── Eye.jpeg             # Password visibility icon asset
├── .gitignore           # Git ignore rules
└── README.md            # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14+ recommended) installed on your system.

### Running the Application

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/CowardCow/Front-End-Project.git
   cd Front-End-Project
   ```

2. **Start the REST Backend Server**:
   ```bash
   node server.js
   ```

3. **Open in Browser**:
   Navigate to `http://localhost:3000/` in your web browser.

4. **Default Login Credentials**:
   - **Username**: `admin`
   - **Password**: `password`
   *(You can also register a new account on the Sign Up tab)*.

---

## 📡 REST API Endpoints

The native Node.js HTTP server exposes the following REST endpoints at `http://localhost:3000`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/locations` | Retrieve all stored location records |
| `POST` | `/api/locations` | Add a new custom location record |
| `PUT` | `/api/locations/:id` | Update an existing location record by ID |
| `DELETE` | `/api/locations/:id` | Delete a location record by ID |

---

## 📝 License

This project is open-source and available under the MIT License.