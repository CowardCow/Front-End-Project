import React from 'react';

export default function TextInput({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  required = false,
  disabled = false,
  helperText,
  icon,
  rightElement,
  min,
  max,
  step,
  style = {}
}) {
  const hasError = touched && Boolean(error);
  const inputId = id || name;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', ...style }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '0.86rem',
            fontWeight: 600,
            color: hasError ? '#f87171' : 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {icon && <span style={{ opacity: 0.8 }}>{icon}</span>}
          {label}
          {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          id={inputId}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          style={{
            width: '100%',
            padding: rightElement ? '12px 42px 12px 14px' : '12px 14px',
            background: 'var(--input-bg)',
            border: `1.5px solid ${hasError ? '#ef4444' : 'var(--input-border)'}`,
            borderRadius: '12px',
            color: 'var(--text-main)',
            fontSize: '0.92rem',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: hasError ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : 'none'
          }}
        />
        {rightElement && (
          <div style={{ position: 'absolute', right: '12px', display: 'flex', alignItems: 'center' }}>
            {rightElement}
          </div>
        )}
      </div>

      {/* Error / Helper text */}
      {hasError ? (
        <span
          id={`${inputId}-error`}
          role="alert"
          style={{
            fontSize: '0.78rem',
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '2px'
          }}
        >
          ⚠️ {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: '0.78rem', color: 'var(--text-sub)', marginTop: '2px' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
}
