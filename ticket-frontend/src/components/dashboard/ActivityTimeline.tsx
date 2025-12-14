"use client";

import { useState } from 'react';
import ActivityItem from './ActivityItem';
import { mockActivity } from '@/utils/mockData';
import type { ActivityItem as ActivityItemType } from '@/types/dashboard';

interface ActivityTimelineProps {
  className?: string;
  maxItems?: number;
}

type FilterOption = 'all' | 'today' | 'week' | 'month';

const filterLabels: Record<FilterOption, string> = {
  all: 'All Time',
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
};

export default function ActivityTimeline({
  className = '',
  maxItems = 10,
}: ActivityTimelineProps) {
  const [filter, setFilter] = useState<FilterOption>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Filter activities based on selected filter
  const filterActivities = (activities: ActivityItemType[]): ActivityItemType[] => {
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;

    switch (filter) {
      case 'today':
        return activities.filter(item => {
          const itemTime = new Date(item.timestamp).getTime();
          return now - itemTime < dayInMs;
        });
      case 'week':
        return activities.filter(item => {
          const itemTime = new Date(item.timestamp).getTime();
          return now - itemTime < 7 * dayInMs;
        });
      case 'month':
        return activities.filter(item => {
          const itemTime = new Date(item.timestamp).getTime();
          return now - itemTime < 30 * dayInMs;
        });
      default:
        return activities;
    }
  };

  // Sort by most recent first and apply filters
  const sortedActivities = [...mockActivity]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filteredActivities = filterActivities(sortedActivities).slice(0, maxItems);

  return (
    <div className={`bg-gray-800/30 border border-gray-700 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {/* Clock Icon */}
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition-colors"
          >
            <span>{filterLabels[filter]}</span>
            <svg
              className={`w-4 h-4 transition-transform ${showFilterMenu ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showFilterMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowFilterMenu(false)}
              />

              {/* Menu */}
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-20">
                {(Object.keys(filterLabels) as FilterOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setFilter(option);
                      setShowFilterMenu(false);
                    }}
                    className={`
                      w-full px-4 py-2.5 text-left text-sm transition-colors
                      ${filter === option
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-gray-300 hover:bg-gray-700'
                      }
                    `}
                  >
                    {filterLabels[option]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Timeline Content */}
      <div className="relative">
        {filteredActivities.length > 0 ? (
          <div className="space-y-0">
            {filteredActivities.map((activity, index) => (
              <ActivityItem
                key={activity.id}
                {...activity}
                isLast={index === filteredActivities.length - 1}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <p className="text-gray-400 font-medium">No recent activity</p>
            <p className="text-gray-500 text-sm mt-1">
              {filter !== 'all' ? 'Try changing the filter' : 'Activity will appear here'}
            </p>
          </div>
        )}
      </div>

      {/* View All Link (if there are more items) */}
      {mockActivity.length > maxItems && filteredActivities.length === maxItems && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors flex items-center gap-1">
            <span>View all activity</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
