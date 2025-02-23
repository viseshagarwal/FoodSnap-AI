import React, { useState } from 'react';
import Input from './Input';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { PasswordValidation } from '@/utils/validation';

interface PasswordInputProps {
  id: string;
  label?: string;
  value?: string;
  error?: string;
  autoComplete?: string;
  showValidation?: boolean;
  validation?: PasswordValidation;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label = "Password",
  value,
  error,
  autoComplete,
  showValidation = false,
  validation = {
    hasMinLength: false,
    hasLetter: false,
    hasNumber: false,
  },
  onChange,
  required = false,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={showPassword ? "text" : "password"}
          label={label}
          value={value}
          error={error}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          onChange={onChange}
          className="pr-10"
        />
        <button
          type="button"
          className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50"
          onClick={togglePasswordVisibility}
          disabled={disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <FaEyeSlash className="w-4 h-4" />
          ) : (
            <FaEye className="w-4 h-4" />
          )}
        </button>
      </div>
      {showValidation && (
        <div className="mt-2 space-y-1">
          <p className={`text-sm ${validation.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
            • At least 8 characters
          </p>
          <p className={`text-sm ${validation.hasLetter ? 'text-green-600' : 'text-gray-500'}`}>
            • Contains at least one letter
          </p>
          <p className={`text-sm ${validation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
            • Contains at least one number
          </p>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;