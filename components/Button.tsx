import React, { ButtonHTMLAttributes, forwardRef } from "react";
import LoadingSpinner from "./LoadingSpinner";

export type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  loadingText?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "button-primary",
  secondary: "button-secondary",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = "primary", 
    className = "", 
    children, 
    type = "button", 
    isLoading = false,
    loadingText,
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = "focus:outline-none focus:ring-2 focus:ring-teal-500 active:translate-y-0.5 transition-all duration-150";
    
    return (
      <button
        ref={ref}
        type={type}
        className={`${variantClasses[variant]} ${baseClasses} ${className}`}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center space-x-2">
            <LoadingSpinner size="sm" />
            {loadingText && <span>{loadingText}</span>}
          </span>
        ) : children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
