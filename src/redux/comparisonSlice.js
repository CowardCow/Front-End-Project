import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_KEY = 'eb54a61865a9338c289d39b7cc5e19f0';

// Async Thunk using Redux Toolkit to fetch telemetry for city comparison
export const fetchCityTelemetry = createAsyncThunk(
  'comparison/fetchCityTelemetry',
  async ({ id, name, lat, lon }, { rejectWithValue }) => {
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

      const [wRes, aqiRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(aqiUrl)
      ]);

      if (!wRes.ok) {
        throw new Error(`Weather API responded with status ${wRes.status}`);
      }

      const weather = await wRes.json();
      let aqi = null;
      if (aqiRes.ok) {
        const aqiData = await aqiRes.json();
        aqi = aqiData.list && aqiData.list.length > 0 ? aqiData.list[0] : null;
      }

      return {
        id,
        name,
        lat,
        lon,
        weather,
        aqi,
        timestamp: Date.now()
      };
    } catch (err) {
      return rejectWithValue({ id, name, error: err.message });
    }
  }
);

const initialState = {
  selectedLocationIds: ['1', '2', '6'], // Default cities for comparison: Mumbai, New Delhi, Jaipur
  telemetryData: {}, // Map of id -> telemetry object
  loadingState: {}, // Map of id -> 'idle' | 'loading' | 'succeeded' | 'failed'
  errors: {},
  lastRefreshed: null
};

export const comparisonSlice = createSlice({
  name: 'comparison',
  initialState,
  reducers: {
    addLocationToComparison: (state, action) => {
      const id = String(action.payload);
      if (!state.selectedLocationIds.includes(id)) {
        if (state.selectedLocationIds.length >= 4) {
          // Limit to max 4 locations for comparison grid
          state.selectedLocationIds.shift();
        }
        state.selectedLocationIds.push(id);
      }
    },
    removeLocationFromComparison: (state, action) => {
      const id = String(action.payload);
      state.selectedLocationIds = state.selectedLocationIds.filter(item => item !== id);
      delete state.telemetryData[id];
      delete state.loadingState[id];
      delete state.errors[id];
    },
    clearComparison: (state) => {
      state.selectedLocationIds = [];
      state.telemetryData = {};
      state.loadingState = {};
      state.errors = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCityTelemetry.pending, (state, action) => {
        const { id } = action.meta.arg;
        state.loadingState[id] = 'loading';
        delete state.errors[id];
      })
      .addCase(fetchCityTelemetry.fulfilled, (state, action) => {
        const { id } = action.payload;
        state.loadingState[id] = 'succeeded';
        state.telemetryData[id] = action.payload;
        delete state.errors[id];
        state.lastRefreshed = new Date().toISOString();
      })
      .addCase(fetchCityTelemetry.rejected, (state, action) => {
        const id = action.meta?.arg?.id;
        if (id) {
          state.loadingState[id] = 'failed';
          state.errors[id] = action.payload?.error || action.error?.message || 'Failed to fetch telemetry';
        }
      });
  }
});

export const { addLocationToComparison, removeLocationFromComparison, clearComparison } = comparisonSlice.actions;

export const selectComparisonIds = (state) => state.comparison.selectedLocationIds;
export const selectComparisonTelemetry = (state) => state.comparison.telemetryData;
export const selectComparisonLoading = (state) => state.comparison.loadingState;
export const selectComparisonErrors = (state) => state.comparison.errors;

export default comparisonSlice.reducer;
