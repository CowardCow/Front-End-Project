import React, { useState } from 'react';
import TextInput from '../components/common/form/TextInput';
import SelectInput from '../components/common/form/SelectInput';
import TextAreaInput from '../components/common/form/TextAreaInput';
import CheckboxInput from '../components/common/form/CheckboxInput';
import Button from '../components/common/form/Button';
import { useFormValidation } from '../hooks/useFormValidation';
import { useWeather } from '../context/WeatherContext';

export default function FeedbackPage() {
  const { showToast } = useWeather();
  const [submittedReports, setSubmittedReports] = useState([
    {
      id: 'rep-1',
      reporterName: 'Aarav Sharma',
      email: 'aarav.sharma@chitkara.edu.in',
      city: 'Shimla',
      eventType: 'Snowfall & Frost',
      severity: 'Moderate',
      description: 'Sudden temperature drop to 2°C with light frost on highways. Travel caution advised.',
      consent: true,
      timestamp: 'Today at 09:30 AM'
    },
    {
      id: 'rep-2',
      reporterName: 'Priya Patel',
      email: 'priya.patel@example.com',
      city: 'Mumbai',
      eventType: 'High Humidity / Coastal Fog',
      severity: 'Low',
      description: 'Heavy sea fog along Marine Drive, visibility reduced to 400m in early morning hours.',
      consent: true,
      timestamp: 'Yesterday at 07:15 PM'
    }
  ]);

  const validationRules = {
    reporterName: [
      { required: true, message: 'Reporter name is required.' },
      { minLength: 3, message: 'Name must be at least 3 characters.' }
    ],
    email: [
      { required: true, message: 'Contact email is required.' },
      {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address (e.g. user@domain.com).'
      }
    ],
    city: [
      { required: true, message: 'City / Location name is required.' }
    ],
    eventType: [
      { required: true, message: 'Please select a weather event type.' }
    ],
    severity: [
      { required: true, message: 'Please specify severity level.' }
    ],
    description: [
      { required: true, message: 'Field description is required.' },
      { minLength: 15, message: 'Please provide at least 15 characters of detailed observation.' },
      { maxLength: 300, message: 'Observation cannot exceed 300 characters.' }
    ],
    consent: [
      {
        custom: (val) => (!val ? 'You must acknowledge and consent before submitting.' : '')
      }
    ]
  };

  const initialValues = {
    reporterName: '',
    email: '',
    city: '',
    eventType: 'Heatwave',
    severity: 'Moderate',
    description: '',
    consent: false
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleBlur,
    validateAll,
    resetForm
  } = useFormValidation(initialValues, validationRules);

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateAll();
    if (!isValid) {
      showToast('Form validation failed. Please check the marked fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newReport = {
        id: `rep-${Date.now()}`,
        reporterName: values.reporterName.trim(),
        email: values.email.trim(),
        city: values.city.trim(),
        eventType: values.eventType,
        severity: values.severity,
        description: values.description.trim(),
        consent: values.consent,
        timestamp: 'Just now'
      };

      setSubmittedReports(prev => [newReport, ...prev]);
      showToast('Citizen weather report submitted successfully!', 'success');
      resetForm();
    }, 600);
  };

  const eventTypeOptions = [
    { value: 'Heatwave', label: '☀️ Extreme Heatwave' },
    { value: 'Heavy Rain / Cloudburst', label: '🌧️ Heavy Rain / Cloudburst' },
    { value: 'Air Pollution / Smog Spike', label: '🌫️ Air Pollution / Smog Spike' },
    { value: 'Thunderstorm & Lightning', label: '⚡ Severe Thunderstorm' },
    { value: 'Cold Wave / Frost', label: '❄️ Cold Wave & Frost' },
    { value: 'Cyclone / Coastal Gale', label: '🌀 Cyclone / Coastal Gale' }
  ];

  const severityOptions = [
    { value: 'Low', label: '🟢 Low (Advisory only)' },
    { value: 'Moderate', label: '🟡 Moderate (Localized disturbance)' },
    { value: 'High', label: '🟠 High (Severe weather caution)' },
    { value: 'Emergency', label: '🔴 Critical Emergency (Disaster alert)' }
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px 20px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '28px'
    }}>
      {/* Header Banner */}
      <div style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--card-border)',
        borderRadius: '24px',
        padding: '28px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}>
        
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '8px' }}>
          📝 Citizen Weather Report &amp; Validation Showcase
        </h2>
        
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Form Container */}
        <div style={{
          background: 'var(--card-bg)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--card-border)',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.25)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
            Submit Ground Weather Incident
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-sub)', marginBottom: '20px' }}>
            All inputs below are modular reusable React components with live validation.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <TextInput
                label="Reporter Full Name"
                name="reporterName"
                required
                placeholder="e.g. Aarav Sharma"
                value={values.reporterName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.reporterName}
                touched={touched.reporterName}
                icon="👤"
              />

              <TextInput
                label="Email Address"
                name="email"
                type="email"
                required
                placeholder="e.g. aarav@chitkara.edu.in"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
                icon="✉️"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <TextInput
                label="City / Location Affected"
                name="city"
                required
                placeholder="e.g. Chandigarh, Shimla"
                value={values.city}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.city}
                touched={touched.city}
                icon="📍"
              />

              <SelectInput
                label="Event Classification"
                name="eventType"
                required
                value={values.eventType}
                onChange={handleChange}
                onBlur={handleBlur}
                options={eventTypeOptions}
                error={errors.eventType}
                touched={touched.eventType}
                icon="🌪️"
              />
            </div>

            <SelectInput
              label="Observed Severity Level"
              name="severity"
              required
              value={values.severity}
              onChange={handleChange}
              onBlur={handleBlur}
              options={severityOptions}
              error={errors.severity}
              touched={touched.severity}
              icon="⚠️"
            />

            <TextAreaInput
              label="Detailed Observations & Ground Conditions"
              name="description"
              required
              placeholder="Describe rainfall intensity, wind gusts, localized water logging, visibility drops, or road blockages..."
              rows={4}
              maxLength={300}
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.description}
              touched={touched.description}
              icon="📝"
              helperText="Minimum 15 characters required."
            />

            <CheckboxInput
              label="I verify that this observation is accurate and consent to telemetry alert broadcasting."
              name="consent"
              required
              checked={values.consent}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.consent}
              touched={touched.consent}
            />

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                style={{ flex: 1 }}
                icon="🚀"
              >
                Submit Weather Report
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => resetForm()}
                icon="🔄"
              >
                Reset
              </Button>
            </div>
          </form>
        </div>

        {/* Live Feed of Submitted Reports */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '20px',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
              📡 Citizen Telemetry Stream ({submittedReports.length})
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>
              Real-time feed of validated citizen submissions.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {submittedReports.map((rep) => (
              <div
                key={rep.id}
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '16px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>📍</span>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{rep.city}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>• {rep.timestamp}</span>
                  </div>

                  <span style={{
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    background: rep.severity === 'Emergency' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: rep.severity === 'Emergency' ? '#f87171' : '#fbbf24',
                    fontWeight: 700
                  }}>
                    {rep.severity}
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  {rep.eventType}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.4, margin: 0 }}>
                  "{rep.description}"
                </p>

                <div style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-sub)',
                  borderTop: '1px solid var(--card-border)',
                  paddingTop: '6px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>Reporter: {rep.reporterName}</span>
                  <span>Verified: {rep.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
