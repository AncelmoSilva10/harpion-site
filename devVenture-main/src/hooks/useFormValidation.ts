
import { useState } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validate?: (value: string) => boolean;
  message?: string;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const sanitizeInput = (value: string, preserveSpaces = false): string => {
    let sanitized = value;
    if (!preserveSpaces) {
      sanitized = sanitized.trim();
    }
    return sanitized
      .replace(/[<>]/g, '') // Remove basic XSS characters
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+=/gi, ''); // Remove event handlers
  };

  const validateField = (name: string, value: string): boolean => {
    const rule = rules[name];
    if (!rule) return true;

    const sanitizedValue = sanitizeInput(value);
    
    // Se o campo não é obrigatório e está vazio, é válido
    if (!rule.required && !sanitizedValue) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
      return true;
    }
    
    if (rule.required && !sanitizedValue) {
      setErrors(prev => ({ ...prev, [name]: rule.message || `${name} é obrigatório` }));
      return false;
    }

    if (rule.minLength && sanitizedValue.length < rule.minLength) {
      setErrors(prev => ({ ...prev, [name]: rule.message || `${name} deve ter pelo menos ${rule.minLength} caracteres` }));
      return false;
    }

    if (rule.maxLength && sanitizedValue.length > rule.maxLength) {
      setErrors(prev => ({ ...prev, [name]: rule.message || `${name} deve ter no máximo ${rule.maxLength} caracteres` }));
      return false;
    }

    if (rule.pattern && !rule.pattern.test(sanitizedValue)) {
      setErrors(prev => ({ ...prev, [name]: rule.message || `${name} tem formato inválido` }));
      return false;
    }

    if (rule.validate && !rule.validate(sanitizedValue)) {
      setErrors(prev => ({ ...prev, [name]: rule.message || `${name} inválido` }));
      return false;
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    return true;
  };

  const validateForm = (data: { [key: string]: string }): boolean => {
    let isValid = true;
    Object.keys(rules).forEach(field => {
      if (!validateField(field, data[field] || '')) {
        isValid = false;
      }
    });
    return isValid;
  };

  const clearFieldError = (name: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  return {
    errors,
    validateField,
    validateForm,
    sanitizeInput,
    clearErrors: () => setErrors({}),
    clearFieldError
  };
};
