# 🇮🇳 Desh Dekho — Weather Portal & Location DBMS (React 18 + Redux Toolkit + React Router)

**Department of Computer Science & Engineering, Chitkara University Institute of Engineering & Technology**  
**Course Code:** 25CSE0203 • **Course Title:** Front End Engineering-II  
**Evaluation:** Project-based Evaluation-II (Test No: 2 • Total Marks: 30)  

A production-grade, responsive geospatial weather monitoring platform and location **Database Management System (DBMS)** built with **React 18**, **Vite**, **React Router v6**, **Redux Toolkit**, **Context API**, **Leaflet.js**, **OpenWeatherMap API**, and a custom **Node.js REST API backend**.

---

## 🎯 Evaluation Rubric Breakdown (Annexure-A Aligned)

| Rubric Component | Marks | Features Implemented |
| :--- | :---: | :--- |
| **Presentation (Component 1)** | **5 Marks** | Structured presentation walkthrough, high engagement visual aids, viva preparation guide (`EXAM_VIVA_GUIDE.md`). |
| **React Navigation Layout & Page Structure** | **7-8 Marks** | Multi-page SPA navigation using `react-router-dom` v6 (`Routes`, `Route`, `NavLink`, `useNavigate`, `ProtectedRoute`, 404 fallback). Clean, modular layout with header, active links, and guards. |
| **Context API & State Architecture** | **6-8 Marks** | Clean separation of Local State (`useState`), Context API (`AuthContext`, `ThemeContext` for dynamic Dark/Light modes, `WeatherContext` for global telemetry, async loading spinners & error handling). |
| **Intro to Redux Toolkit** | **3-5 Marks** | Redux Toolkit store (`configureStore`), `favoritesSlice` (pinning & bookmarking locations with localStorage sync), `comparisonSlice` with `createAsyncThunk` (handling pending, fulfilled, rejected lifecycle), and a live floating **Redux Inspector** widget. |
| **Form Handling in React** | **3-4 Marks** | Reusable input components (`TextInput`, `SelectInput`, `TextAreaInput`, `CheckboxInput`, `Button`) with `useFormValidation` custom hook supporting real-time validation, coordinate bounds (-90 to 90, -180 to 180), email regex, and touch states. |

---

## ✨ Feature Highlights

### 🧭 Multi-Page SPA Routing (`react-router-dom`)
- **`/portal`**: Interactive Leaflet vector map with live weather metrics, air quality breakdown, 5-day forecast, and Google Maps embed.
- **`/locations`**: Master database management page with searchable/sortable table and cards, category filters, and Redux bookmarking.
- **`/analytics`**: Multi-city comparative weather telemetry powered by Redux Toolkit `createAsyncThunk`.
- **`/quick-search`**: Instant global city weather lookup with one-click DBMS saving.
- **`/report`**: Citizen weather incident reporting form demonstrating reusable form components and validation strategies.
- **`/login`**: Secure authentication gateway with login and sign-up modes.
- **`*`**: Custom 404 Not Found error page with navigation back to the portal.

### 🌐 Context API Architecture
- **`AuthContext`**: Manages user authentication, session persistence in `localStorage`, login, signup, and logout.
- **`ThemeContext`**: Dynamic Light / Dark mode toggle across the entire UI with custom CSS variables.
- **`WeatherContext`**: Global telemetry state, unit conversion (°C / °F), coordinate picker, and toast notification queues.

### ⚡ Redux Toolkit (`@reduxjs/toolkit` & `react-redux`)
- **`favoritesSlice`**: Manages favorite pinned locations with actions (`addFavorite`, `removeFavorite`, `toggleFavorite`, `clearFavorites`) and `localStorage` persistence.
- **`comparisonSlice`**: Leverages `createAsyncThunk` (`fetchCityTelemetry`) to fetch and compare multiple cities asynchronously, handling `pending`, `fulfilled`, and `rejected` states.
- **`ReduxInspector`**: Live floating widget in the application that allows examiners to inspect the Redux store state in real-time.

### 📝 Form Handling & Custom Validation Hook
- **Modular Components**: `TextInput`, `SelectInput`, `TextAreaInput`, `CheckboxInput`, `Button` with accessible error indicators (`role="alert"`).
- **`useFormValidation`**: Custom hook supporting touched field tracking, real-time validation on change & blur, email regex checking, and coordinate boundary enforcement.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router v6, Redux Toolkit, React-Redux, Vite, CSS3 Glassmorphism
- **Mapping**: Leaflet.js, OpenStreetMap, CARTO Dark Basemap, Esri Satellite Imagery
- **APIs**: OpenWeatherMap API (Current Weather, 5-Day Forecast, Air Pollution, Direct Geocoding)
- **Backend API**: Node.js HTTP Server (`server.js`) with REST endpoints and SPA fallback
- **Storage**: Persistent `locations_db.json` storage + LocalStorage synchronization

---

## 🚀 Running the Project Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Production Bundle
```bash
npm run build
```

### 3. Start the Backend Server & Web Application
```bash
npm start
```
Open your browser at: **`http://localhost:3000`**

### 4. Development Mode (Hot Reload)
```bash
npm run dev
```
Accessible at: **`http://localhost:5173`**

### Default Login Credentials:
- **Username:** `admin`
- **Password:** `password`
*(Or click "Sign Up" to register a new user account)*

---

## 📚 Viva Preparation

A complete viva preparation guide is provided in [`EXAM_VIVA_GUIDE.md`](file:///d:/ce2projfee/EXAM_VIVA_GUIDE.md). It contains:
- 3-minute presentation script for full 5/5 marks in Presentation.
- Code pointers for all 4 project rubrics.
- Model answers for anticipated viva questions on React Router, Context API vs Redux Toolkit, `createAsyncThunk`, and controlled form validation.