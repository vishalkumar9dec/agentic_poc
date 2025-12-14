"use client";

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface TopBarProps {
  userName: string;
  userRole: string;
  onCustomizeDashboard?: () => void;
}

export default function TopBar({
  userName,
  userRole,
  onCustomizeDashboard,
}: TopBarProps) {
  return (
    <div className="bg-gray-900 border-b border-gray-800 px-8 py-6">
      <div className="flex items-center justify-between">
        {/* Left Side: Verified Badge + Welcome */}
        <div className="flex items-center space-x-6">
          {/* Verified Access Badge */}
          <Badge
            variant="success"
            size="md"
            icon={
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            }
          >
            Verified Access: {userRole}
          </Badge>

          {/* Welcome Message */}
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {userName}
            </h1>
          </div>
        </div>

        {/* Right Side: Customize Button + Notification */}
        <div className="flex items-center space-x-4">
          {/* Customize Dashboard Button */}
          <Button
            variant="secondary"
            size="md"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            }
            onClick={onCustomizeDashboard}
          >
            Customize Dashboard
          </Button>

          {/* Notification Bell */}
          <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {/* Notification Badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
