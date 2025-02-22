import React, { ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "button-primary",
  secondary: "button-secondary",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, type = "button", ...props }, ref) => {
    const baseClasses = "focus:outline-none focus:ring-2 focus:ring-teal-500 active:translate-y-0.5 transition-all duration-150";
    
    return (
      <button
        ref={ref}
        type={type}
        className={`${variantClasses[variant]} ${baseClasses} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
