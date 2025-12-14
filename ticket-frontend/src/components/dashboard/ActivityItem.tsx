"use client";

import { ActivityItem as ActivityItemType } from '@/types/dashboard';
import { timeAgo } from '@/utils/timeAgo';

interface ActivityItemProps extends ActivityItemType {
  isLast?: boolean;
}

// Status indicator colors based on activity type
const statusColors = {
  success: {
    dot: 'bg-green-500',
    ring: 'ring-green-500/20',
    icon: '✓',
  },
  warning: {
    dot: 'bg-orange-500',
    ring: 'ring-orange-500/20',
    icon: '⚠',
  },
  info: {
    dot: 'bg-gray-500',
    ring: 'ring-gray-500/20',
    icon: 'i',
  },
};

export default function ActivityItem({
  type,
  title,
  subtitle,
  timestamp,
  isLast = false,
}: ActivityItemProps) {
  const colors = statusColors[type];
  const relativeTime = timeAgo(timestamp);

  return (
    <div className="relative flex gap-4 pb-6">
      {/* Timeline Line and Dot */}
      <div className="relative flex flex-col items-center">
        {/* Status Dot */}
        <div
          className={`
            w-6 h-6 rounded-full ${colors.dot}
            ring-4 ${colors.ring}
            flex items-center justify-center
            text-white text-xs font-bold
            z-10
          `}
        >
          {type === 'success' && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {type === 'warning' && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          )}
          {type === 'info' && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          )}
        </div>

        {/* Connecting Line (if not last item) */}
        {!isLast && (
          <div className="w-0.5 h-full bg-gray-700 absolute top-6 bottom-0" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pt-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm mb-0.5 truncate">
              {title}
            </h4>
            <p className="text-gray-400 text-sm truncate">
              {subtitle}
            </p>
          </div>
          <time
            className="text-gray-500 text-xs font-medium whitespace-nowrap flex-shrink-0"
            dateTime={timestamp}
            title={new Date(timestamp).toLocaleString()}
          >
            {relativeTime}
          </time>
        </div>
      </div>
    </div>
  );
}
