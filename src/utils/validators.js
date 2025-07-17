// Validaciones para formularios y datos

export const validators = {
  // Validar email
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validar teléfono chileno
  isValidPhone: (phone) => {
    const phoneRegex = /^(\+?56)?(\s?)[9]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  // Validar que no esté vacío
  isNotEmpty: (value) => {
    return value && value.trim().length > 0;
  },

  // Validar longitud mínima
  hasMinLength: (value, minLength) => {
    return value && value.length >= minLength;
  },

  // Validar longitud máxima
  hasMaxLength: (value, maxLength) => {
    return value && value.length <= maxLength;
  },

  // Validar número positivo
  isPositiveNumber: (value) => {
    return !isNaN(value) && Number(value) > 0;
  },

  // Validar formato de hora (HH:MM)
  isValidTime: (time) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  },

  // Validar color hexadecimal
  isValidHexColor: (color) => {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexColorRegex.test(color);
  }
};

// Mensajes de error
export const errorMessages = {
  required: 'Este campo es requerido',
  email: 'Por favor ingresa un email válido',
  phone: 'Por favor ingresa un número de teléfono válido (ej: +56912345678)',
  minLength: (min) => `Debe tener al menos ${min} caracteres`,
  maxLength: (max) => `No puede tener más de ${max} caracteres`,
  positiveNumber: 'Debe ser un número positivo',
  time: 'Por favor ingresa una hora válida (HH:MM)',
  hexColor: 'Por favor ingresa un color hexadecimal válido'
};

// Validar formulario de checkout
export const validateCheckoutForm = (formData, deliveryMethod) => {
  const errors = {};

  // Validar nombre
  if (!validators.isNotEmpty(formData.name)) {
    errors.name = errorMessages.required;
  } else if (!validators.hasMinLength(formData.name, 3)) {
    errors.name = errorMessages.minLength(3);
  }

  // Validar email
  if (!validators.isNotEmpty(formData.email)) {
    errors.email = errorMessages.required;
  } else if (!validators.isValidEmail(formData.email)) {
    errors.email = errorMessages.email;
  }

  // Validar teléfono
  if (!validators.isNotEmpty(formData.phone)) {
    errors.phone = errorMessages.required;
  } else if (!validators.isValidPhone(formData.phone)) {
    errors.phone = errorMessages.phone;
  }

  // Validar dirección si es delivery
  if (deliveryMethod === 'delivery' && !validators.isNotEmpty(formData.address)) {
    errors.address = errorMessages.required;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};