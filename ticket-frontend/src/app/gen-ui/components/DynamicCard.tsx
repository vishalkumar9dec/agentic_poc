'use client';

interface FieldConfig {
  name: string;
  label: string;
  value: string | number;
  className?: string;
}

export interface CardConfig {
  layout: 'grid' | 'list' | 'compact';
  theme: 'blue' | 'green' | 'purple' | 'modern';
  showHeader: boolean;
  showFooter: boolean;
  headerClasses: string;
  bodyClasses: string;
  footerClasses: string;
  containerClasses: string;
  titleClasses: string;
  fields: FieldConfig[];
  badge?: {
    text: string;
    className: string;
  };
  icon?: string;
}

interface DynamicCardProps {
  config: CardConfig;
  data: {
    id: number;
    title: string;
    [key: string]: any;
  };
}

export function DynamicCard({ config, data }: DynamicCardProps) {
  // Status badge color mapping
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('progress')) return 'bg-blue-600 text-white';
    if (statusLower.includes('pending') || statusLower.includes('approval')) return 'bg-yellow-700 text-white';
    if (statusLower.includes('completed') || statusLower.includes('done')) return 'bg-green-600 text-white';
    if (statusLower.includes('open')) return 'bg-gray-600 text-white';
    return 'bg-purple-600 text-white';
  };

  return (
    <div className="bg-gray-800/40 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all duration-200 overflow-hidden">
      {/* Header with icon, ticket number, and status badge */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {config.icon && <span className="text-xl">{config.icon}</span>}
            <span className="text-xs font-semibold text-gray-400">
              #{data.id}
            </span>
          </div>
          {config.badge && (
            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getStatusColor(config.badge.text)}`}>
              {config.badge.text}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-4 line-clamp-2">
          {data.title}
        </h3>

        {/* Fields - Compact vertical list */}
        <div className="space-y-2.5">
          {config.fields.map((field) => (
            <div key={field.name} className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{field.label}:</span>
              <span className="font-medium text-gray-200">{field.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 bg-gray-900/40 border-t border-gray-700/50">
        <p className="text-xs text-gray-500">Updated recently</p>
      </div>
    </div>
  );
}
