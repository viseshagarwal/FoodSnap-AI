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

export const validatePassword = (password: string): { error: string; validation: PasswordValidation } => {
  const validation = {
    hasMinLength: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /\d/.test(password),
  };

  if (!password) {
    return { error: "Password is required", validation };
  }

  const validationErrors: string[] = [];
  if (!validation.hasMinLength) validationErrors.push("at least 8 characters");
  if (!validation.hasLetter) validationErrors.push("at least one letter");
  if (!validation.hasNumber) validationErrors.push("at least one number");

  return {
    error: validationErrors.length ? `Password must have ${validationErrors.join(", ")}` : "",
    validation,
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