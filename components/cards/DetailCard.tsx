import React from 'react';
import Card from '../Card';
import Button, { ButtonVariant } from '../Button';

export interface DetailCardAction {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
}

interface DetailCardProps {
  title?: string;
  titleClassName?: string;
  description?: string | React.ReactNode;
  image?: string;
  imageAlt?: string;
  imageClassName?: string;
  content?: React.ReactNode;
  contentClassName?: string;
  actions?: DetailCardAction[];
  actionsClassName?: string;
  status?: {
    type: 'success' | 'warning' | 'error' | 'info';
    message: string;
  };
  className?: string;
}

const statusClasses = {
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  error: 'bg-red-50 text-red-700',
  info: 'bg-blue-50 text-blue-700',
} as const;

export default function DetailCard({
  title,
  titleClassName = "",
  description,
  image,
  imageAlt,
  imageClassName = "",
  content,
  contentClassName = "",
  actions,
  actionsClassName = "",
  status,
  className = "",
}: DetailCardProps) {
  const footerContent = actions?.length ? (
    <div className={`flex items-center justify-end ${actionsClassName || 'gap-3'}`}>
      {actions.map((action, index) => (
        <Button
          key={index}
          onClick={action.onClick}
          variant={action.variant}
          className={action.className}
          disabled={action.disabled}
        >
          {action.label}
        </Button>
      ))}
    </div>
  ) : undefined;

  return (
    <Card
      className={className}
      footerContent={footerContent}
    >
      {status && (
        <div className={`rounded-lg px-4 py-2 mb-4 ${statusClasses[status.type]}`}>
          {status.message}
        </div>
      )}
      
      <div className="flex items-start gap-3">
        {image && (
          <div className={`rounded-lg overflow-hidden flex-shrink-0 ${imageClassName || 'h-48 w-full'}`}>
            <img
              src={image}
              alt={imageAlt || ''}
              className={imageClassName ? '' : 'object-cover w-full h-full'}
            />
          </div>
        )}
        
        <div className={`flex-1 ${image ? '' : 'w-full'}`}>
          {title && (
            <h3 className={`font-semibold text-gray-900 ${titleClassName || 'text-lg mb-2'}`}>
              {title}
            </h3>
          )}
          
          {description && (
            <div className="text-sm text-gray-600 mb-4">
              {description}
            </div>
          )}
          
          <div className={contentClassName}>
            {content}
          </div>
        </div>
      </div>
    </Card>
  );
}