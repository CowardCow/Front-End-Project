import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './favoritesSlice';
import comparisonReducer from './comparisonSlice';

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    comparison: comparisonReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;
