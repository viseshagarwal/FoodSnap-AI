import React from 'react';
import Card from '../Card';
import Button, { ButtonVariant } from '../Button';

export interface DetailCardAction {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
}

interface DetailCardProps {
  title?: string;
  description?: string | React.ReactNode;
  image?: string;
  imageAlt?: string;
  content?: React.ReactNode;
  actions?: DetailCardAction[];
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
  description,
  image,
  imageAlt,
  content,
  actions,
  status,
  className = "",
}: DetailCardProps) {
  const footerContent = actions?.length ? (
    <div className="flex items-center justify-end gap-3">
      {actions.map((action, index) => (
        <Button
          key={index}
          onClick={action.onClick}
          variant={action.variant}
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

      {image && (
        <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
          <img
            src={image}
            alt={imageAlt || ''}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
      )}

      {description && (
        <div className="text-sm text-gray-600 mb-4">
          {description}
        </div>
      )}

      {content}
    </Card>
  );
}