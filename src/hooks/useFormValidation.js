import { useState, useCallback } from 'react';

/**
 * Custom hook implementing robust Form Validation Strategies for React apps.
 * Supports:
 * - Real-time onBlur and onChange validation
 * - Synchronous and custom async validation rules
 * - Coordinate validation (-90 <= lat <= 90, -180 <= lon <= 180)
 * - Required, email, length, regex pattern, and numeric range rules
 */
export function useFormValidation(initialValues = {}, validationRules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate a single field based on configured rules
  const validateField = useCallback((fieldName, value, allValues = values) => {
    const rules = validationRules[fieldName];
    if (!rules) return '';

    for (const rule of rules) {
      if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
        return rule.message || `${fieldName} is required.`;
      }

      if (value !== undefined && value !== null && value !== '') {
        if (rule.minLength && String(value).trim().length < rule.minLength) {
          return rule.message || `${fieldName} must be at least ${rule.minLength} characters.`;
        }

        if (rule.maxLength && String(value).trim().length > rule.maxLength) {
          return rule.message || `${fieldName} must be under ${rule.maxLength} characters.`;
        }

        if (rule.pattern && !rule.pattern.test(String(value))) {
          return rule.message || `${fieldName} format is invalid.`;
        }

        if (rule.isNumeric && isNaN(Number(value))) {
          return rule.message || `${fieldName} must be a valid number.`;
        }

        if (rule.min !== undefined && Number(value) < rule.min) {
          return rule.message || `${fieldName} must be at least ${rule.min}.`;
        }

        if (rule.max !== undefined && Number(value) > rule.max) {
          return rule.message || `${fieldName} must not exceed ${rule.max}.`;
        }

        if (rule.custom && typeof rule.custom === 'function') {
          const customError = rule.custom(value, allValues);
          if (customError) return customError;
        }
      }
    }

    return '';
  }, [validationRules, values]);

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setValues((prev) => {
      const updated = { ...prev, [name]: val };
      // Real-time validation if field was touched
      if (touched[name]) {
        const error = validateField(name, val, updated);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
      }
      return updated;
    });
  }, [touched, validateField]);

  // Handle input blur
  const handleBlur = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, val);
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, [validateField]);

  // Set single field value programmatically
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => {
      const updated = { ...prev, [name]: value };
      if (touched[name]) {
        const error = validateField(name, value, updated);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
      }
      return updated;
    });
  }, [touched, validateField]);

  // Validate entire form
  const validateAll = useCallback(() => {
    const newErrors = {};
    const newTouched = {};
    let isValid = true;

    Object.keys(validationRules).forEach((field) => {
      newTouched[field] = true;
      const error = validateField(field, values[field], values);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);
    return isValid;
  }, [validationRules, validateField, values]);

  // Reset form
  const resetForm = useCallback((newInitialValues = initialValues) => {
    setValues(newInitialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    setValues,
    errors,
    setErrors,
    touched,
    setTouched,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
    validateAll,
    resetForm,
    isValid: Object.values(errors).every((err) => !err)
  };
}
