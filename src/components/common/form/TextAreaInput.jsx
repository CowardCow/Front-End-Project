import React from 'react';

export default function TextAreaInput({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  rows = 3,
  maxLength,
  error,
  touched,
  required = false,
  disabled = false,
  helperText,
  icon,
  style = {}
}) {
  const hasError = touched && Boolean(error);
  const inputId = id || name;
  const currentLength = (value || '').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        {maxLength && (
          <span style={{ fontSize: '0.74rem', color: currentLength >= maxLength ? '#ef4444' : 'var(--text-sub)' }}>
            {currentLength} / {maxLength}
          </span>
        )}
      </div>

      <textarea
        id={inputId}
        name={name}
        rows={rows}
        maxLength={maxLength}
        value={value ?? ''}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={hasError ? 'true' : 'false'}
        style={{
          width: '100%',
          padding: '12px 14px',
          background: 'var(--input-bg)',
          border: `1.5px solid ${hasError ? '#ef4444' : 'var(--input-border)'}`,
          borderRadius: '12px',
          color: 'var(--text-main)',
          fontSize: '0.92rem',
          outline: 'none',
          resize: 'vertical',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: hasError ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : 'none'
        }}
      />

      {hasError ? (
        <span style={{ fontSize: '0.78rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px' }}>
          ⚠️ {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
}
