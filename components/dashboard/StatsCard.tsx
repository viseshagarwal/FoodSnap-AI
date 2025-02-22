"use client";

import { IconType } from "react-icons";
import { useRouter } from "next/navigation";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  trend?: number;
  color?: string;
  href?: string;
  onClick?: () => void;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "indigo",
  href,
  onClick,
}: StatsCardProps) {
  const router = useRouter();

  const getIconColor = (color: string) => {
    const colors = {
      orange: "text-orange-500",
      indigo: "text-indigo-500",
      purple: "text-purple-500",
      pink: "text-pink-500",
    };
    return colors[color as keyof typeof colors] || colors.indigo;
  };

  const getTrendColor = (trend: number) => {
    return trend >= 0 ? "text-emerald-500" : "text-red-500";
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const isInteractive = href || onClick;
  const baseClasses = "bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-150";
  const interactiveClasses = isInteractive 
    ? "cursor-pointer hover:shadow-lg hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-teal-500"
    : "";

  return (
    <div
      className={`${baseClasses} ${interactiveClasses}`}
      onClick={isInteractive ? handleClick : undefined}
      onKeyPress={isInteractive ? handleKeyPress : undefined}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={isInteractive ? `View details for ${title}` : undefined}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm text-gray-600 font-normal mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend !== undefined && (
            <div className="mt-1">
              <span className={`text-sm ${getTrendColor(trend)} flex items-center gap-1`}>
                <span aria-hidden="true">{trend >= 0 ? "↑" : "↓"}</span>
                <span className="sr-only">{trend >= 0 ? "Increased by" : "Decreased by"}</span>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        <Icon 
          className={`w-6 h-6 ${getIconColor(color)}`} 
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
