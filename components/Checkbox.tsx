import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  error?: string;
  wrapperClassName?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ 
  label, 
  error, 
  className = "", 
  wrapperClassName = "",
  disabled = false,
  ...props 
}) => {
  const baseCheckboxClasses = "h-3 w-3 sm:h-4 sm:w-4 text-indigo-600 border-gray-300 rounded transition-all";
  const stateClasses = {
    default: "focus:ring-indigo-500",
    error: "border-red-300 focus:ring-red-500",
    disabled: "opacity-50 cursor-not-allowed"
  };

  const checkboxClasses = [
    baseCheckboxClasses,
    error ? stateClasses.error : stateClasses.default,
    disabled ? stateClasses.disabled : "",
    className
  ].join(" ");

  return (
    <div className={`flex flex-col ${wrapperClassName}`}>
      <div className="flex items-start sm:items-center">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            className={checkboxClasses}
            disabled={disabled}
            {...props}
          />
        </div>
        <label
          htmlFor={props.id}
          className={`ml-2 block text-xs sm:text-sm ${
            disabled ? "text-gray-500" : "text-gray-900"
          } ${error ? "text-red-600" : ""}`}
        >
          {label}
        </label>
      </div>
      {error && (
        <p className="mt-1 text-xs sm:text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Checkbox;