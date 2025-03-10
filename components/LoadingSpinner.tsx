import React from 'react';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  className?: string;
  variant?: 'default' | 'gradient' | 'pulse' | 'dots' | 'rings' | 'wave';
  customSize?: number;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md',
  className = "",
  variant = 'default',
  customSize,
  color,
}) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10',
    custom: ''
  };

  const customSizeStyle = customSize ? { height: `${customSize}px`, width: `${customSize}px` } : {};
  const colorStyle = color ? { color } : {};
  
  // Gradient variant spinner (beautiful circular gradient)
  if (variant === 'gradient') {
    return (
      <div 
        className={`${size === 'custom' ? '' : sizeClasses[size]} relative ${className}`} 
        style={customSize ? customSizeStyle : {}}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 rounded-full animate-spin-slow"
            style={{
              background: 'conic-gradient(from 0deg, #10B981, #6366F1, #8B5CF6, #EC4899, #10B981)',
              maskImage: 'radial-gradient(transparent 60%, black 65%)',
              WebkitMaskImage: 'radial-gradient(transparent 60%, black 65%)',
            }}
          />
          <div className="absolute inset-[15%] rounded-full bg-white/90" />
          <div className="absolute inset-0 rounded-full animate-pulse opacity-20"
            style={{
              background: 'conic-gradient(transparent, #10B981, transparent)',
            }}
          />
        </div>
      </div>
    );
  }
  
  // Pulse variant (expanding and contracting circle)
  if (variant === 'pulse') {
    return (
      <div className={`${size === 'custom' ? '' : sizeClasses[size]} relative ${className}`} style={customSize ? customSizeStyle : {}}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500 to-indigo-500 animate-ping opacity-75" />
          <div className="absolute inset-[30%] rounded-full bg-teal-500" />
        </div>
      </div>
    );
  }
  
  // Dots variant (three bouncing dots)
  if (variant === 'dots') {
    const dotSize = size === 'xs' ? 'w-1 h-1' : 
                    size === 'sm' ? 'w-1.5 h-1.5' : 
                    size === 'md' ? 'w-2 h-2' : 
                    size === 'lg' ? 'w-2.5 h-2.5' : 'w-3 h-3';
    
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <div className={`${dotSize} rounded-full bg-teal-500 animate-bounce`} style={{ animationDelay: '0ms' }} />
        <div className={`${dotSize} rounded-full bg-indigo-500 animate-bounce`} style={{ animationDelay: '150ms' }} />
        <div className={`${dotSize} rounded-full bg-purple-500 animate-bounce`} style={{ animationDelay: '300ms' }} />
      </div>
    );
  }
  
  // Rings variant (multiple concentric circles)
  if (variant === 'rings') {
    return (
      <div className={`${size === 'custom' ? '' : sizeClasses[size]} relative ${className}`} style={customSize ? customSizeStyle : {}}>
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-teal-500 animate-spin"></div>
        <div className="absolute inset-[25%] rounded-full border-4 border-r-transparent border-indigo-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        <div className="absolute inset-[50%] rounded-full border-2 border-b-transparent border-purple-500 animate-spin" style={{ animationDuration: '0.75s' }}></div>
      </div>
    );
  }

  // Wave variant (sine wave animation)
  if (variant === 'wave') {
    const barCount = 5;
    const barWidth = size === 'xs' ? 'w-0.5' : 
                    size === 'sm' ? 'w-1' : 
                    size === 'md' ? 'w-1.5' : 
                    size === 'lg' ? 'w-2' : 'w-2.5';
    
    const barHeight = size === 'xs' ? 'h-3' : 
                      size === 'sm' ? 'h-4' : 
                      size === 'md' ? 'h-5' : 
                      size === 'lg' ? 'h-6' : 'h-8';
                      
    return (
      <div className={`flex items-center justify-center space-x-1 ${className}`}>
        {[...Array(barCount)].map((_, i) => (
          <div 
            key={i}
            className={`${barWidth} ${barHeight} bg-gradient-to-b from-teal-500 to-indigo-500 rounded-full animate-wave`} 
            style={{ 
              animationDelay: `${i * 100}ms`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    );
  }
  
  // Default spinner (enhanced version of the original)
  return (
    <svg
      className={`animate-spin ${size === 'custom' ? '' : sizeClasses[size]} ${className}`}
      style={{...customSizeStyle, ...colorStyle}}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

export default LoadingSpinner;