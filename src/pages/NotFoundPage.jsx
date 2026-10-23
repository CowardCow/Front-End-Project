import React from 'react';
import { NavLink } from 'react-router-dom';
import Button from '../components/common/form/Button';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--card-border)',
        borderRadius: '28px',
        padding: '48px 36px',
        maxWidth: '520px',
        width: '100%',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{ fontSize: '4.5rem', lineHeight: 1, marginBottom: '16px' }}>
          🧭
        </div>

        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 900,
          background: 'linear-gradient(90deg, #ff7043, #38bdf8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0
        }}>
          404
        </h1>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '8px' }}>
          Geospatial Coordinates Lost
        </h2>

        <p style={{ color: 'var(--text-sub)', fontSize: '0.92rem', marginTop: '10px', marginBottom: '28px', lineHeight: 1.5 }}>
          The requested route does not exist in our React Router navigation hierarchy. Please navigate back to the Weather Portal.
        </p>

        <NavLink to="/portal" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="lg" icon="🌤️">
            Return to Weather Portal
          </Button>
        </NavLink>
      </div>
    </div>
  );
}
