import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  labelClassName?: string;
  wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, labelClassName = "", wrapperClassName = "", className = "", disabled = false, ...props }, ref) => {
    const baseInputClasses = "mt-1 block w-full px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg shadow-sm transition-colors";
    const baseLabelClasses = "block text-xs sm:text-sm font-medium text-gray-700";
    
    // Handle different input states
    const stateClasses = {
      default: "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
      error: "border-red-300 focus:ring-red-500 focus:border-red-500",
      disabled: "bg-gray-50 text-gray-500 cursor-not-allowed",
    };

    const inputClasses = [
      baseInputClasses,
      error ? stateClasses.error : stateClasses.default,
      disabled ? stateClasses.disabled : "",
      className
    ].join(" ");

    return (
      <div className={wrapperClassName}>
        <label
          htmlFor={props.id}
          className={`${baseLabelClasses} ${disabled ? "text-gray-500" : ""} ${labelClassName}`}
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          ref={ref}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs sm:text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;