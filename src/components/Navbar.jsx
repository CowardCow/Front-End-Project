import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
// import ReduxFavoritesTray from './ReduxFavoritesTray';

export default function Navbar() {
  const { isLoggedIn, currentUser, logout } = useAuth();
  const { isFahrenheit, setIsFahrenheit, setIsDbmsModalOpen, showToast } = useWeather();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const toggleUnit = () => {
    setIsFahrenheit(prev => {
      const next = !prev;
      showToast(`Switched temperature display to ${next ? 'Fahrenheit (°F)' : 'Celsius (°C)'}`);
      return next;
    });
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 14px',
    borderRadius: '12px',
    fontSize: '0.86rem',
    fontWeight: isActive ? 700 : 500,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    color: isActive ? 'var(--accent-cyan)' : 'var(--text-sub)',
    background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
    border: `1px solid ${isActive ? 'var(--accent-cyan)' : 'transparent'}`
  });

  return (
    <header style={{
      padding: '12px 28px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--card-border)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      {/* Brand Logo & Title */}
      <div 
        onClick={() => navigate(isLoggedIn ? '/portal' : '/login')} 
        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
      >
        <span style={{ fontSize: '2rem', lineHeight: 1 }}>🇮🇳</span>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{
              fontSize: '1.3rem',
              fontWeight: 800,
              background: 'linear-gradient(90deg, #ff7043, #38bdf8, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}>
              Desh Dekho
            </h1>
            
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-sub)' }}>
            Weather Portal & Location Database
          </p>
        </div>
      </div>

      {/* React Router SPA Navigation Links */}
      {isLoggedIn && (
        <nav style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          <NavLink to="/portal" style={navLinkStyle}>
            <span>🌤️</span>
            <span>Map Portal</span>
          </NavLink>

          <NavLink to="/locations" style={navLinkStyle}>
            <span>🗄️</span>
            <span>Locations DBMS</span>
          </NavLink>

          <NavLink to="/analytics" style={navLinkStyle}>
            <span>📊</span>
            <span>Comparison & RTK</span>
          </NavLink>

          <NavLink to="/quick-search" style={navLinkStyle}>
            <span>⚡</span>
            <span>Quick Search</span>
          </NavLink>

          <NavLink to="/report" style={navLinkStyle}>
            <span>📝</span>
            <span>Citizen Report</span>
          </NavLink>
         <div style={{
           fontSize: '0.82rem',
           color: 'var(--text-main)',
           background: 'var(--input-bg)',
           padding: '6px 12px',
           borderRadius: '12px',
           border: '1px solid var(--card-border)',
           display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>👤</span>
              <strong style={{ fontWeight: 600 }}>{currentUser}</strong>
            </div>
           </nav>
      )}

      {/* Header Actions (Theme, Units, Redux, Auth) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Theme Toggle Button (Context API) */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          style={{
            background: 'var(--input-bg)',
            border: '1px solid var(--card-border)',
            color: 'var(--text-main)',
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            cursor: 'pointer'
          }}
        >
          {isDark ? '🌙' : '☀️'}
        </button>

        {/* Temperature Unit Toggle Button */}
        <button
          onClick={toggleUnit}
          title="Toggle Celsius / Fahrenheit"
          style={{
            background: 'var(--input-bg)',
            border: '1px solid var(--card-border)',
            color: 'var(--text-main)',
            padding: '6px 12px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer'
          }}
        >
          {isFahrenheit ? '°F' : '°C'}
        </button>

        {isLoggedIn ? (
          <>
            {/* Redux Favorites Tray Dropdown */}
            {/* <ReduxFavoritesTray /> */}

            {/* Quick DBMS Manager Modal Trigger */}
            <button
              onClick={() => setIsDbmsModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                border: 'none',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)'
              }}
            >
              ➕ Add / Manage
            </button>

            {/* User Badge */}
           

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'var(--accent-cyan)',
              color: '#000',
              border: 'none',
              padding: '7px 16px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer'
            }}
          >
            Login / Sign Up
          </button>
        )}
      </div>
    </header>
  );
}
