import React from 'react';
import { useWeather } from '../context/WeatherContext';

export default function ToastContainer() {
  const { toasts } = useWeather();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 3000,
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: `1px solid ${toast.type === 'error' ? '#ef4444' : '#38bdf8'}`,
            color: toast.type === 'error' ? '#fca5a5' : '#fff',
            padding: '12px 20px',
            borderRadius: '14px',
            fontSize: '0.88rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'toastIn 0.3s ease forwards',
            pointerEvents: 'auto'
          }}
        >
          <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
