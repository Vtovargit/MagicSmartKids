import { useState } from 'react';

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface FieldConfig {
  [key: string]: ValidationRules;
}

export const useFormValidation = (config: FieldConfig) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validate = (field: string, value: any): string | null => {
    const rules = config[field];
    if (!rules) return null;

    if (rules.required && (!value || value.toString().trim() === '')) {
      return 'Este campo es obligatorio';
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `Mínimo ${rules.minLength} caracteres`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `Máximo ${rules.maxLength} caracteres`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Formato inválido';
    }

    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  };

  const validateField = (field: string, value: any) => {
    const error = validate(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));
    return !error;
  };

  const validateAll = (values: { [key: string]: any }) => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    Object.keys(config).forEach(field => {
      const error = validate(field, values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const setFieldTouched = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const reset = () => {
    setErrors({});
    setTouched({});
  };

  return {
    errors,
    touched,
    validateField,
    validateAll,
    setFieldTouched,
    reset,
    hasErrors: Object.keys(errors).some(key => errors[key])
  };
};