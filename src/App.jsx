import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useWeather } from './context/WeatherContext';
import Navbar from './components/Navbar';
import InteractiveMap from './components/InteractiveMap';
import WeatherHeroCard from './components/WeatherHeroCard';
import AqiCard from './components/AqiCard';
import ForecastGrid from './components/ForecastGrid';
import DbmsModal from './components/DbmsModal';
import QuickSearch from './components/QuickSearch';
import LoginView from './components/LoginView';
import WelcomeView from './components/WelcomeView';
import ToastContainer from './components/ToastContainer';

export default function App() {
  const { isLoggedIn } = useAuth();
  const { locations, currentLocation, selectLocation, searchQuery, setSearchQuery } = useWeather();
  const [activeView, setActiveView] = useState('portal'); // 'portal', 'quickSearch', 'welcome', 'login'

  // Filter sidebar locations
  const filteredLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (loc.state && loc.state.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (loc.category && loc.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // If user is not logged in, enforce Login screen
  if (!isLoggedIn && activeView !== 'quickSearch') {
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <div className="circle1"></div>
        <div className="circle2"></div>
        <Navbar activeView="login" setActiveView={setActiveView} />
        <LoginView setActiveView={setActiveView} />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="circle1"></div>
      <div className="circle2"></div>

      <Navbar activeView={activeView} setActiveView={setActiveView} />

      {activeView === 'quickSearch' && <QuickSearch setActiveView={setActiveView} />}
      {activeView === 'welcome' && <WelcomeView setActiveView={setActiveView} />}

      {activeView === 'portal' && (
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '24px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '340px 1fr',
          gap: '24px',
          flex: 1
        }}>
          {/* Sidebar */}
          <div style={{
            background: 'var(--card-bg)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--card-border)',
            borderRadius: '24px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 110px)',
            position: 'sticky',
            top: '90px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{
              marginBottom: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Saved Locations</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                {locations.length} Locations
              </span>
            </div>

            {/* Search Box */}
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Search saved location..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '12px',
                  padding: '10px 14px 10px 36px',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              />
              <span style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '0.85rem',
                opacity: 0.6
              }}>
                🔍
              </span>
            </div>

            {/* Locations List */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              paddingRight: '4px'
            }}>
              {filteredLocations.map(loc => {
                const isActive = currentLocation && currentLocation.id === loc.id;
                return (
                  <div
                    key={loc.id}
                    onClick={() => selectLocation(loc)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      background: isActive 
                        ? 'linear-gradient(90deg, rgba(255, 112, 67, 0.25), rgba(56, 189, 248, 0.25))' 
                        : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${isActive ? 'var(--accent-cyan)' : 'transparent'}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-main)' }}>
                        {loc.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>
                        {loc.state || 'India'}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: 'var(--accent-cyan)'
                    }}>
                      {loc.category || 'Base'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Dashboard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <InteractiveMap />
            <WeatherHeroCard />
            <AqiCard />
            <ForecastGrid />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        color: 'var(--text-sub)',
        fontSize: '0.85rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        marginTop: 'auto'
      }}>
        © 2026 Codeverse. Built with React, Vite & OpenWeather API. All rights reserved.
      </footer>

      <DbmsModal />
      <ToastContainer />
    </div>
  );
}
