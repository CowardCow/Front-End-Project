import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function WelcomeView({ setActiveView }) {
  const { currentUser, logout } = useAuth();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 120px)',
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--card-border)',
        borderRadius: '24px',
        padding: '40px 32px',
        width: '100%',
        maxWidth: '480px',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Avatar */}
        <div style={{
          width: '70px',
          height: '70px',
          background: 'linear-gradient(135deg, #38bdf8, #a855f7)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          margin: '0 auto 16px auto',
          boxShadow: '0 8px 20px rgba(168, 85, 247, 0.4)',
          border: '2px solid rgba(255, 255, 255, 0.4)'
        }}>
          👤
        </div>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>
          Welcome Back, {currentUser || 'User'}
        </h2>

        <div style={{
          background: 'rgba(52, 211, 153, 0.15)',
          border: '1px solid rgba(52, 211, 153, 0.4)',
          color: '#34d399',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '0.82rem',
          fontWeight: 600,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          margin: '12px 0 20px 0'
        }}>
          <span style={{ width: '8px', height: '8px', background: '#34d399', borderRadius: '50%' }}></span>
          Authenticated & Connected
        </div>

        <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.95rem', marginBottom: '28px' }}>
          Access live weather telemetry, interactive dark vector maps, 5-day forecasts, air quality metrics, and persistent location database management.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => setActiveView('portal')}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              color: '#fff',
              padding: '14px',
              borderRadius: '14px',
              fontWeight: 700,
              fontSize: '1rem',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
            }}
          >
            🌤️ Open Weather DBMS Portal
          </button>

          <button
            onClick={() => setActiveView('quickSearch')}
            style={{
              background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
              border: 'none',
              color: '#fff',
              padding: '14px',
              borderRadius: '14px',
              fontWeight: 700,
              fontSize: '1rem'
            }}
          >
            ⚡ Quick City Weather Search
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
              padding: '12px',
              borderRadius: '14px',
              fontWeight: 600,
              fontSize: '0.9rem',
              marginTop: '8px'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
