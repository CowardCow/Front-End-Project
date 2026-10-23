import { createSlice } from '@reduxjs/toolkit';

// Helper to load favorites from localStorage
const loadFavoritesFromStorage = () => {
  try {
    const saved = localStorage.getItem('codeverse_redux_favorites');
    return saved ? JSON.parse(saved) : ['1', '2', '13']; // default seed favorites: Mumbai, New Delhi, Bengaluru
  } catch (e) {
    return ['1', '2', '13'];
  }
};

const initialState = {
  favoriteIds: loadFavoritesFromStorage(),
  lastUpdated: new Date().toISOString()
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      const id = String(action.payload);
      if (!state.favoriteIds.includes(id)) {
        state.favoriteIds.push(id);
        state.lastUpdated = new Date().toISOString();
        try {
          localStorage.setItem('codeverse_redux_favorites', JSON.stringify(state.favoriteIds));
        } catch (e) {
          console.error('Failed to persist favorites to localStorage', e);
        }
      }
    },
    removeFavorite: (state, action) => {
      const id = String(action.payload);
      state.favoriteIds = state.favoriteIds.filter(item => item !== id);
      state.lastUpdated = new Date().toISOString();
      try {
        localStorage.setItem('codeverse_redux_favorites', JSON.stringify(state.favoriteIds));
      } catch (e) {
        console.error('Failed to persist favorites to localStorage', e);
      }
    },
    toggleFavorite: (state, action) => {
      const id = String(action.payload);
      if (state.favoriteIds.includes(id)) {
        state.favoriteIds = state.favoriteIds.filter(item => item !== id);
      } else {
        state.favoriteIds.push(id);
      }
      state.lastUpdated = new Date().toISOString();
      try {
        localStorage.setItem('codeverse_redux_favorites', JSON.stringify(state.favoriteIds));
      } catch (e) {
        console.error('Failed to persist favorites to localStorage', e);
      }
    },
    clearFavorites: (state) => {
      state.favoriteIds = [];
      state.lastUpdated = new Date().toISOString();
      try {
        localStorage.removeItem('codeverse_redux_favorites');
      } catch (e) {
        console.error('Failed to clear favorites from localStorage', e);
      }
    }
  }
});

export const { addFavorite, removeFavorite, toggleFavorite, clearFavorites } = favoritesSlice.actions;

export const selectFavoriteIds = (state) => state.favorites.favoriteIds;
export const selectIsFavorite = (state, id) => state.favorites.favoriteIds.includes(String(id));
export const selectFavoritesCount = (state) => state.favorites.favoriteIds.length;

export default favoritesSlice.reducer;
