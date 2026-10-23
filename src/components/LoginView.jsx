import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWeather } from '../context/WeatherContext';
import { useNavigate } from 'react-router-dom';
import TextInput from './common/form/TextInput';
import Button from './common/form/Button';

export default function LoginView() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signup } = useAuth();
  const { showToast } = useWeather();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser) {
      errors.username = 'Username is required.';
    } else if (cleanUser.length < 3) {
      errors.username = 'Username must be at least 3 characters.';
    }

    if (!cleanPass) {
      errors.password = 'Password is required.';
    } else if (cleanPass.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (isSignUpMode) {
      if (!confirmPassword.trim()) {
        errors.confirmPassword = 'Please confirm your password.';
      } else if (confirmPassword !== password) {
        errors.confirmPassword = 'Passwords do not match.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix highlighted errors before continuing.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSignUpMode) {
        const res = signup(username, password);
        if (res.success) {
          showToast(res.message, 'success');
          setIsSignUpMode(false);
          setPassword('');
          setConfirmPassword('');
          setFormErrors({});
        } else {
          showToast(res.message, 'error');
        }
      } else {
        const res = login(username, password);
        if (res.success) {
          showToast(res.message, 'success');
          navigate('/portal');
        } else {
          showToast(res.message, 'error');
        }
      }
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFillAdmin = () => {
    setUsername('admin');
    setPassword('password');
    setConfirmPassword('');
    setFormErrors({});
    showToast('Auto-filled default admin credentials! Click "Login to Portal".', 'success');
  };

  const handleResetLocalStorage = () => {
    try {
      localStorage.setItem('users', JSON.stringify({ admin: 'password' }));
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
      setUsername('admin');
      setPassword('password');
      setFormErrors({});
      showToast('LocalStorage credentials reset! Default user: admin / password', 'success');
    } catch (err) {
      showToast('Failed to reset localStorage.', 'error');
    }
  };

  const toggleMode = () => {
    setIsSignUpMode(prev => !prev);
    setPassword('');
    setConfirmPassword('');
    setFormErrors({});
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 110px)',
      padding: '24px 20px'
    }}>
      <div style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--card-border)',
        borderRadius: '24px',
        padding: '36px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            fontSize: '2rem',
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            boxShadow: '0 8px 20px rgba(56, 189, 248, 0.3)'
          }}>
            🔐
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {isSignUpMode ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.88rem', marginTop: '4px' }}>
            {isSignUpMode ? 'Sign up to access Desh Dekho' : 'Login to access'}
          </p>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextInput
            label="Username"
            name="username"
            required
            placeholder="Enter username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (formErrors.username) setFormErrors(prev => ({ ...prev, username: '' }));
            }}
            error={formErrors.username}
            touched={Boolean(formErrors.username)}
            icon="👤"
            helperText="Minimum 3 characters"
          />

          <TextInput
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (formErrors.password) setFormErrors(prev => ({ ...prev, password: '' }));
            }}
            error={formErrors.password}
            touched={Boolean(formErrors.password)}
            icon="🔑"
            helperText="Minimum 6 characters"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-sub)',
                  cursor: 'pointer',
                  fontSize: '1.1rem'
                }}
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            }
          />

          {isSignUpMode && (
            <TextInput
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (formErrors.confirmPassword) setFormErrors(prev => ({ ...prev, confirmPassword: '' }));
              }}
              error={formErrors.confirmPassword}
              touched={Boolean(formErrors.confirmPassword)}
              icon="🔒"
            />
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            style={{ marginTop: '8px' }}
          >
            {isSignUpMode ? 'Create Account & Sign Up' : 'Login to Portal'}
          </Button>
        </form>

        {/* Quick Admin Fill & Reset Helpers */}
        <div style={{
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'center'
        }}>
          {!isSignUpMode && (
            <div style={{ display: 'flex', gap: '12px' }}>
              

             
            </div>
          )}

          <p style={{ textAlign: 'center', color: 'var(--text-sub)', fontSize: '0.88rem', marginTop: '12px' }}>
            {isSignUpMode ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span
              onClick={toggleMode}
              style={{ color: 'var(--accent-cyan)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isSignUpMode ? 'Login' : 'Sign Up'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
