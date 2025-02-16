import { IconType } from "react-icons";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  trend?: number;
  color?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "indigo",
}: StatsCardProps) {
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

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm text-gray-600 font-normal mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend !== undefined && (
            <div className="mt-1">
              <span className={`text-sm ${getTrendColor(trend)}`}>
                {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        <Icon className={`w-6 h-6 ${getIconColor(color)}`} />
      </div>
    </div>
  );
}
