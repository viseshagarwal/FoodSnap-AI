import React from 'react';
import Input from './Input';
import { validateEmail } from '@/utils/validation';

interface EmailInputProps {
  id?: string;
  label?: string;
  value?: string;
  error?: string;
  autoComplete?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidation?: (error: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const EmailInput: React.FC<EmailInputProps> = ({
  id = 'email',
  label = 'Email address',
  value,
  error,
  autoComplete = 'email',
  onChange,
  onValidation,
  required = true,
  disabled = false,
  className = '',
}) => {
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const validationError = validateEmail(e.target.value);
    if (validationError && onValidation) {
      onValidation(validationError);
    }
  };

  return (
    <Input
      id={id}
      name={id}
      type="email"
      label={label}
      value={value}
      error={error}
      autoComplete={autoComplete}
      required={required}
      disabled={disabled}
      onChange={onChange}
      onBlur={handleBlur}
      className={className}
    />
  );
};

export default EmailInput;