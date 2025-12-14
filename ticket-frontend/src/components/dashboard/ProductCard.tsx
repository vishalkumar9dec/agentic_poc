"use client";

import { useState } from 'react';

interface ProductCardProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  status: 'available' | 'coming-soon';
  isFavorited: boolean;
  onFavoriteToggle: (id: string) => void;
  onNavigate: () => void;
}

export default function ProductCard({
  id,
  icon,
  title,
  description,
  status,
  isFavorited,
  onFavoriteToggle,
  onNavigate,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle(id);
  };

  const isComingSoon = status === 'coming-soon';

  return (
    <button
      onClick={onNavigate}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative
        bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8
        border border-gray-200 dark:border-gray-700
        transition-all duration-300
        hover:shadow-2xl hover:-translate-y-2
        text-left w-full
        ${isHovered ? 'ring-2 ring-blue-500/50' : ''}
      `}
    >
      {/* Coming Soon Badge */}
      {isComingSoon && (
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs font-bold rounded-full">
            Coming Soon
          </span>
        </div>
      )}

      {/* Star Favorite Button */}
      {!isComingSoon && (
        <button
          onClick={handleFavoriteClick}
          className={`
            absolute top-4 right-4 p-2 rounded-lg
            transition-all duration-200
            ${isFavorited
              ? 'text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20'
              : 'text-gray-400 hover:text-yellow-400 hover:bg-gray-700/50'
            }
          `}
          title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            className="w-5 h-5"
            fill={isFavorited ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
      )}

      {/* Content */}
      <div className="mb-6">
        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          {icon}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>

      {/* Action Text */}
      <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold">
        <span>{isComingSoon ? 'Preview' : 'Launch'}</span>
        <svg
          className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
