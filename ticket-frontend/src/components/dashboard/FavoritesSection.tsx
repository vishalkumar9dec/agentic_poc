"use client";

import { useState } from 'react';
import FavoriteCard from './FavoriteCard';
import { favoriteItems } from '@/utils/mockData';
import type { FavoriteItem } from '@/types/dashboard';

interface FavoritesSectionProps {
  className?: string;
}

export default function FavoritesSection({ className = '' }: FavoritesSectionProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteItem[]>(favoriteItems);

  const handleRemoveFavorite = (id: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  const handleCardClick = (id: string) => {
    console.log('Favorite clicked:', id);
    // TODO: Navigate to the favorite feature/page
  };

  return (
    <div className={`bg-gray-800/30 border border-gray-700 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="mr-2">⭐</span>
          Your Favorites
        </h2>
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`
            px-4 py-2 rounded-lg font-medium transition-all duration-200
            ${isEditMode
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }
          `}
        >
          {isEditMode ? 'Done' : 'Edit'}
        </button>
      </div>

      {/* Favorites Grid */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((favorite) => (
            <FavoriteCard
              key={favorite.id}
              {...favorite}
              isEditMode={isEditMode}
              onRemove={handleRemoveFavorite}
              onClick={handleCardClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No favorites yet</p>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            Add Favorites
          </button>
        </div>
      )}
    </div>
  );
}
