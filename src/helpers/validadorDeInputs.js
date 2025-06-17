

export const isRequired = (value, fieldName) => {
  if (!value || !value.trim()) {
    return `El campo ${fieldName} es obligatorio.`;
  }
  return '';
};

export const minLength = (value, min, fieldName) => {
  if (value.length < min) {
    return `El campo ${fieldName} debe tener al menos ${min} caracteres.`;
  }
  return '';
};

export const maxLength = (value, max, fieldName) => {
  if (value.length > max) {
    return `El campo ${fieldName} debe tener como máximo ${max} caracteres.`;
  }
  return '';
};

export const isEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'El formato del email no es válido.';
  }
  return '';
};

export const isNumeric = (value, fieldName) => {
  const numericRegex = /^[0-9]+$/;
  if (!numericRegex.test(value)) {
    return `El campo ${fieldName} debe contener solo números.`;
  }
  return '';
};