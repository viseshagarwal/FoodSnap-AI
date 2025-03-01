export interface PasswordValidation {
  hasMinLength: boolean;
  hasLetter: boolean;
  hasNumber: boolean;
}

export const validateEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return "";
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Za-z]/.test(password)) {
    errors.push('Password must contain at least one letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateName = (name: string): string => {
  if (!name) return "Full name is required";
  if (name.length < 2) return "Name must be at least 2 characters long";
  return "";
};

export const validateRequired = (value: string, fieldName: string): string => {
  return !value ? `${fieldName} is required` : "";
};