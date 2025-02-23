import React from 'react';
import { IconType } from 'react-icons';
import { useRouter } from 'next/navigation';
import Card from '../Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  trend?: number;
  color?: 'teal' | 'indigo' | 'orange' | 'purple' | 'pink';
  href?: string;
  onClick?: () => void;
}

const colorClasses = {
  teal: 'text-teal-500',
  indigo: 'text-indigo-500',
  orange: 'text-orange-500',
  purple: 'text-purple-500',
  pink: 'text-pink-500',
} as const;

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'indigo',
  href,
  onClick,
}: StatsCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }
  };

  return (
    <Card
      isInteractive={!!(href || onClick)}
      onClick={handleClick}
      aria-label={`View details for ${title}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm text-gray-600 font-normal mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend !== undefined && (
            <div className="mt-1">
              <span className={`text-sm ${trend >= 0 ? 'text-emerald-500' : 'text-red-500'} flex items-center gap-1`}>
                <span aria-hidden="true">{trend >= 0 ? "↑" : "↓"}</span>
                <span className="sr-only">{trend >= 0 ? "Increased by" : "Decreased by"}</span>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        <Icon 
          className={`w-6 h-6 ${colorClasses[color]}`} 
          aria-hidden="true"
        />
      </div>
    </Card>
  );
}