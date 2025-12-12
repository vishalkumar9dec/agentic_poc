"use client";

import { FavoriteItem } from '@/types/dashboard';

interface FavoriteCardProps extends FavoriteItem {
  isEditMode?: boolean;
  onRemove?: (id: string) => void;
  onClick?: (id: string) => void;
}

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  'credit-card': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  ),
  'leaf': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  ),
  'zap': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
  'ticket': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
      />
    </svg>
  ),
};

export default function FavoriteCard({
  id,
  name,
  icon,
  iconColor,
  isEditMode = false,
  onRemove,
  onClick,
}: FavoriteCardProps) {
  const handleCardClick = () => {
    if (!isEditMode && onClick) {
      onClick(id);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(id);
    }
  };

  return (
    <div
      className={`
        relative bg-gray-800/50 border border-gray-700 rounded-xl p-6
        transition-all duration-300
        ${!isEditMode ? 'hover:border-gray-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-900/50 cursor-pointer' : ''}
        ${isEditMode ? 'opacity-90' : ''}
      `}
      onClick={handleCardClick}
    >
      {/* Remove Button (Edit Mode) */}
      {isEditMode && (
        <button
          onClick={handleRemove}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg z-10"
          title="Remove favorite"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Icon */}
      <div className={`w-14 h-14 bg-gradient-to-br ${iconColor} rounded-xl flex items-center justify-center mb-4 text-white`}>
        {iconMap[icon] || iconMap['zap']}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white">{name}</h3>
    </div>
  );
}
