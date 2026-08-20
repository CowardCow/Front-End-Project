import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useWeather } from '../context/WeatherContext';

export default function Navbar({ activeView, setActiveView }) {
  const { isLoggedIn, currentUser, logout } = useAuth();
  const { isFahrenheit, setIsFahrenheit, setIsDbmsModalOpen, showToast } = useWeather();

  const toggleUnit = () => {
    setIsFahrenheit(prev => {
      const next = !prev;
      showToast(`Switched temperature display to ${next ? 'Fahrenheit (°F)' : 'Celsius (°C)'}`);
      return next;
    });
  };

  return (
    <header style={{
      padding: '16px 36px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'rgba(7, 10, 18, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--card-border)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Brand Logo & Title */}
      <div 
        onClick={() => setActiveView(isLoggedIn ? 'portal' : 'login')} 
        style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
      >
        <span style={{ fontSize: '2.2rem', lineHeight: 1 }}>🇮🇳</span>
        <div>
          <h1 style={{
            fontSize: '1.4rem',
            fontWeight: 700,
            background: 'linear-gradient(90deg, #ff7043, #38bdf8, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Codeverse Weather Portal
          </h1>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>
            Interactive Vector Map & Location DBMS
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      {isLoggedIn && (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => setActiveView('portal')}
            style={{
              background: activeView === 'portal' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
              border: `1px solid ${activeView === 'portal' ? 'var(--accent-cyan)' : 'transparent'}`,
              color: activeView === 'portal' ? 'var(--accent-cyan)' : 'var(--text-sub)',
              padding: '6px 14px',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: 600
            }}
          >
            🇮🇳 Weather DBMS & Map
          </button>
          <button
            onClick={() => setActiveView('quickSearch')}
            style={{
              background: activeView === 'quickSearch' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
              border: `1px solid ${activeView === 'quickSearch' ? 'var(--accent-cyan)' : 'transparent'}`,
              color: activeView === 'quickSearch' ? 'var(--accent-cyan)' : 'var(--text-sub)',
              padding: '6px 14px',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: 600
            }}
          >
            ⚡ Quick Search
          </button>
          <button
            onClick={() => setActiveView('welcome')}
            style={{
              background: activeView === 'welcome' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
              border: `1px solid ${activeView === 'welcome' ? 'var(--accent-cyan)' : 'transparent'}`,
              color: activeView === 'welcome' ? 'var(--accent-cyan)' : 'var(--text-sub)',
              padding: '6px 14px',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: 600
            }}
          >
            👤 Dashboard
          </button>
        </div>
      )}

      {/* Header Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={toggleUnit}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid var(--card-border)',
            color: '#fff',
            padding: '6px 14px',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '0.85rem'
          }}
        >
          {isFahrenheit ? '°F Units' : '°C Units'}
        </button>

        {isLoggedIn ? (
          <>
            <div style={{
              fontSize: '0.85rem',
              color: '#cbd5e1',
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '6px 12px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              👤 {currentUser}
            </div>

            <button
              onClick={() => setIsDbmsModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                border: 'none',
                color: 'white',
                padding: '8px 18px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '0.88rem',
                boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)'
              }}
            >
              🗄️ DBMS Manager
            </button>

            <button
              onClick={() => {
                logout();
                setActiveView('login');
              }}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#fca5a5',
                padding: '6px 14px',
                borderRadius: '12px',
                fontSize: '0.82rem'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => setActiveView('login')}
            style={{
              background: 'var(--accent-cyan)',
              color: '#000',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.88rem'
            }}
          >
            Login / Sign Up
          </button>
        )}

        <div style={{
          background: 'rgba(52, 211, 153, 0.12)',
          border: '1px solid rgba(52, 211, 153, 0.35)',
          color: '#34d399',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '0.82rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            background: '#34d399',
            borderRadius: '50%',
            animation: 'keyframePulseDot 1.6s infinite'
          }}></span>
          Live API Active
        </div>
      </div>
    </header>
  );
}
