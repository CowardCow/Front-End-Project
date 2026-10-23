import React from 'react';

export default function CheckboxInput({
  label,
  id,
  name,
  checked,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  disabled = false,
  style = {}
}) {
  const hasError = touched && Boolean(error);
  const inputId = id || name;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', ...style }}>
      <label
        htmlFor={inputId}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontSize: '0.88rem',
          color: hasError ? '#f87171' : 'var(--text-main)',
          userSelect: 'none'
        }}
      >
        <input
          id={inputId}
          name={name}
          type="checkbox"
          checked={Boolean(checked)}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          style={{
            width: '18px',
            height: '18px',
            accentColor: 'var(--accent-cyan)',
            cursor: 'pointer'
          }}
        />
        <span>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
        </span>
      </label>

      {hasError && (
        <span style={{ fontSize: '0.78rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '28px' }}>
          ⚠️ {error}
        </span>
      )}
    </div>
  );
}
