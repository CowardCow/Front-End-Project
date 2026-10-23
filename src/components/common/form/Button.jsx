import React from 'react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'outline' | 'success'
  size = 'md', // 'sm' | 'md' | 'lg'
  onClick,
  disabled = false,
  isLoading = false,
  icon,
  style = {},
  className = ''
}) {
  const getStylesByVariant = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)'
        };
      case 'secondary':
        return {
          background: 'rgba(255, 255, 255, 0.08)',
          color: 'var(--text-main)',
          border: '1px solid var(--card-border)',
          boxShadow: 'none'
        };
      case 'danger':
        return {
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)'
        };
      case 'success':
        return {
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
        };
      case 'outline':
        return {
          background: 'transparent',
          color: 'var(--accent-cyan)',
          border: '1px solid var(--accent-cyan)',
          boxShadow: 'none'
        };
      default:
        return {};
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return '6px 12px';
      case 'lg':
        return '14px 24px';
      default:
        return '10px 18px';
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return '0.82rem';
      case 'lg':
        return '1.05rem';
      default:
        return '0.9rem';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        borderRadius: '12px',
        fontWeight: 600,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        padding: getPadding(),
        fontSize: getFontSize(),
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        ...getStylesByVariant(),
        ...style
      }}
    >
      {isLoading ? (
        <>
          <span
            style={{
              width: '16px',
              height: '16px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderTopColor: '#ffffff',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 0.8s linear infinite'
            }}
          />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
