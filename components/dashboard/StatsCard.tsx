import { IconType } from 'react-icons';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  trend?: number;
  color?: string;
}

export default function StatsCard({ title, value, icon: Icon, trend, color = 'teal' }: StatsCardProps) {
  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center mt-1">
              <span className={`text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend >= 0 ? '+' : ''}{trend}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-2 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );
} 