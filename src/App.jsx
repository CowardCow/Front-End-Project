import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PortalPage from './pages/PortalPage';
import LocationsPage from './pages/LocationsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import QuickSearchPage from './pages/QuickSearchPage';
import FeedbackPage from './pages/FeedbackPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import DbmsModal from './components/DbmsModal';
import ToastContainer from './components/ToastContainer';


export default function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="circle1"></div>
      <div className="circle2"></div>

      {/* Top Multi-Page Navigation Bar */}
      <Navbar />

      {/* React Router SPA Routes */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/portal" replace />} />
          <Route
            path="/portal"
            element={
              <ProtectedRoute>
                <PortalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/locations"
            element={
              <ProtectedRoute>
                <LocationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/quick-search" element={<QuickSearchPage />} />
          <Route path="/report" element={<FeedbackPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '20px 24px',
        color: 'var(--text-sub)',
        fontSize: '0.84rem',
        borderTop: '1px solid var(--card-border)',
        marginTop: 'auto',
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div>
          © 2026 Desh Dekho • Chitkara University (25CSE0203 - FEE-II)
        </div>
        
      </footer>

      {/* Global Overlays & Utilities */}
      <DbmsModal />
      <ToastContainer />
      
    </div>
  );
}
