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
      className={`${className} space-y-4`}
    >
      {metrics && metrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-1">
              <p className="text-sm text-gray-500">{metric.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-semibold text-gray-900">{metric.value}</p>
                {metric.trend && (
                  <span 
                    className={`text-sm flex items-center gap-1 ${
                      metric.trend.value >= 0 ? 'text-emerald-500' : 'text-red-500'
                    }`}
                  >
                    <span aria-hidden="true">
                      {metric.trend.value >= 0 ? '↑' : '↓'}
                    </span>
                    <span className="sr-only">
                      {metric.trend.value >= 0 ? 'Increased by' : 'Decreased by'}
                    </span>
                    {Math.abs(metric.trend.value)}%
                    {metric.trend.label && (
                      <span className="text-gray-500">{metric.trend.label}</span>
                    )}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {chart && (
        <div className="h-64">
          {chart}
        </div>
      )}

      {dataPoints && dataPoints.length > 0 && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          {dataPoints.map((point, index) => (
            <div key={index} className="space-y-1">
              <p className="text-sm text-gray-500">{point.label}</p>
              <p className="text-lg font-semibold text-gray-900">{point.value}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}