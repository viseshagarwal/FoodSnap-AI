import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  titleClassName?: string;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  isInteractive?: boolean;
  onClick?: () => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  children?: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  title,
  titleClassName = "",
  headerContent,
  footerContent,
  isInteractive = false,
  onClick,
  onKeyPress,
  children,
  className = "",
  ...props
}, ref) => {
  const baseClasses = "bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-150";
  const interactiveClasses = isInteractive 
    ? "cursor-pointer hover:shadow-lg hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-teal-500"
    : "";

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (onKeyPress) {
      onKeyPress(e);
    } else if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={isInteractive ? onClick : undefined}
      onKeyPress={handleKeyPress}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      {...props}
    >
      {(title || headerContent) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 className={`text-sm text-gray-600 font-normal ${titleClassName}`}>
              {title}
            </h3>
          )}
          {headerContent}
        </div>
      )}
      
      {children}

      {footerContent && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {footerContent}
        </div>
      )}
    </div>
  );
});

Card.displayName = "Card";

export default Card;