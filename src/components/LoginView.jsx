import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWeather } from '../context/WeatherContext';

export default function LoginView({ setActiveView }) {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, signup } = useAuth();
  const { showToast } = useWeather();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      showToast('Please enter both username and password.', 'error');
      return;
    }

    if (isSignUpMode) {
      const res = signup(username.trim(), password.trim());
      if (res.success) {
        showToast(res.message, 'success');
        setIsSignUpMode(false);
        setPassword('');
      } else {
        showToast(res.message, 'error');
      }
    } else {
      const res = login(username.trim(), password.trim());
      if (res.success) {
        showToast(res.message, 'success');
        setActiveView('portal');
      } else {
        showToast(res.message, 'error');
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 90px)',
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--card-border)',
        borderRadius: '24px',
        padding: '36px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        position: 'relative'
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, textAlign: 'center', color: '#fff' }}>
          {isSignUpMode ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-sub)', fontSize: '0.9rem', marginBottom: '24px' }}>
          {isSignUpMode ? 'Sign up to access Codeverse Weather Portal' : 'Login to access Weather DBMS'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <input
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 18px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--card-border)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 44px 14px 18px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--card-border)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '0.95rem'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-sub)',
                cursor: 'pointer',
                fontSize: '1.1rem'
              }}
            >
              {showPassword ? '👁️' : '🙈'}
            </button>
          </div>

          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
              border: 'none',
              color: '#fff',
              padding: '14px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '1rem',
              marginTop: '8px',
              boxShadow: '0 8px 20px rgba(56, 189, 248, 0.3)'
            }}
          >
            {isSignUpMode ? 'Sign Up' : 'Login'}
          </button>
        </form>

        {!isSignUpMode && (
          <p
            onClick={() => showToast('Default Credentials: Username: admin | Password: password', 'success')}
            style={{
              textAlign: 'center',
              color: 'var(--accent-cyan)',
              fontSize: '0.85rem',
              marginTop: '16px',
              cursor: 'pointer'
            }}
          >
            Forgot Password? (Click for hint)
          </p>
        )}

        <p style={{ textAlign: 'center', color: 'var(--text-sub)', fontSize: '0.88rem', marginTop: '20px' }}>
          {isSignUpMode ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            onClick={() => {
              setIsSignUpMode(prev => !prev);
              setPassword('');
            }}
            style={{ color: 'var(--accent-cyan)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isSignUpMode ? 'Login' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
}
