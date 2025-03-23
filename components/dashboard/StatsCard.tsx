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
      teal: "text-teal-500"
    };
    return colors[color as keyof typeof colors] || colors.indigo;
  };

  const getTrendColor = (trend: number) => {
    return trend >= 0 ? "text-emerald-500" : "text-red-500";
  };

  const getTrendBg = (trend: number) => {
    return trend >= 0 ? "bg-emerald-50" : "bg-red-50";
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
  const baseClasses = "bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/80";
  const interactiveClasses = isInteractive 
    ? "cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
    : "transition-all duration-300 hover:shadow-md";

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
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-lg bg-gradient-to-br from-${color}-400/20 to-${color}-500/20 flex items-center justify-center`}>
              <Icon className={`h-4 w-4 ${getIconColor(color)}`} />
            </div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-2">
              <span className={`text-sm ${getTrendColor(trend)} flex items-center gap-1 ${getTrendBg(trend)} px-2 py-1 rounded-full`}>
                {trend >= 0 ? (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ) : (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
                <span className="font-medium">{Math.abs(trend)}%</span>
              </span>
              <span className="text-xs text-gray-500">vs previous</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
