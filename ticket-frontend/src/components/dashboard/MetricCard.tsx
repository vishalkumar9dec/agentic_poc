"use client";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconColor: string;
  showProgress?: boolean;
  progressValue?: number;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  showProgress = false,
  progressValue = 0,
}: MetricCardProps) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          {title}
        </span>
        <div className={`p-2 rounded-lg ${iconColor}`}>
          {icon}
        </div>
      </div>

      {/* Value */}
      <div className="mb-2">
        <span className="text-4xl font-bold text-white">
          {value}
        </span>
      </div>

      {/* Subtitle or Progress */}
      {showProgress ? (
        <div className="space-y-2">
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </div>
      ) : subtitle ? (
        <p className={`text-sm font-medium ${getSubtitleColor(iconColor)}`}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function getSubtitleColor(iconColor: string): string {
  if (iconColor.includes('orange')) return 'text-orange-400';
  if (iconColor.includes('blue')) return 'text-blue-400';
  if (iconColor.includes('green')) return 'text-green-400';
  if (iconColor.includes('purple')) return 'text-purple-400';
  return 'text-gray-400';
}
