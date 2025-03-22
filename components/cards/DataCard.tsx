import React from 'react';
import Card from '../Card';

interface DataPoint {
  label: string;
  value: string | number;
}

interface Metric {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    label?: string;
  };
  color?: string;
}

interface DataCardProps {
  title: string;
  metrics?: Metric[];
  chart?: React.ReactNode;
  dataPoints?: DataPoint[];
  className?: string;
}

export default function DataCard({
  title,
  metrics,
  chart,
  dataPoints,
  className = "",
}: DataCardProps) {
  return (
    <Card
      title={title}
      className={`${className} p-6 space-y-6`}
    >
      {metrics && metrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <div 
              key={index} 
              className="bg-gray-50/50 rounded-xl p-4 border border-gray-100/80 transition-all duration-300 hover:shadow-md"
            >
              <p className="text-sm font-medium text-gray-600 mb-2">{metric.label}</p>
              <div className="flex flex-col gap-2">
                <p className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {metric.value}
                </p>
                {metric.trend && (
                  <div className="flex items-center gap-2">
                    <span 
                      className={`text-sm flex items-center gap-1 px-2 py-1 rounded-full font-medium ${
                        metric.trend.value >= 0 
                          ? 'text-emerald-600 bg-emerald-50' 
                          : 'text-red-600 bg-red-50'
                      }`}
                    >
                      <span aria-hidden="true">
                        {metric.trend.value >= 0 ? '↑' : '↓'}
                      </span>
                      {Math.abs(metric.trend.value)}%
                    </span>
                    {metric.trend.label && (
                      <span className="text-xs text-gray-500">{metric.trend.label}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {chart && (
        <div className="h-64 relative">
          {chart}
        </div>
      )}

      {dataPoints && dataPoints.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          {dataPoints.map((point, index) => (
            <div 
              key={index} 
              className="bg-gray-50/50 rounded-lg p-3 transition-all duration-300 hover:shadow-sm"
            >
              <p className="text-sm text-gray-600 mb-1">{point.label}</p>
              <p className="text-base font-semibold text-gray-900">{point.value}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}