"use client";

import { useState } from 'react';
import FavoriteCard from './FavoriteCard';
import { availableFavorites } from '@/utils/mockData';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoritesSectionProps {
  className?: string;
}

export default function FavoritesSection({ className = '' }: FavoritesSectionProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Use the useFavorites hook
  const { favorites, isLoading, addFavorite, removeFavorite, isFavorited } = useFavorites();

  const handleRemoveFavorite = (id: string) => {
    removeFavorite(id);
  };

  const handleCardClick = (id: string) => {
    console.log('Favorite clicked:', id);
    // TODO: Navigate to the favorite feature/page
  };

  const handleAddFavorite = (favorite: typeof availableFavorites[0]) => {
    addFavorite(favorite);
  };

  // Get available items that aren't already favorited
  const availableToAdd = availableFavorites.filter(item => !isFavorited(item.id));

  if (isLoading) {
    return (
      <div className={`bg-gray-800/30 border border-gray-700 rounded-2xl p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-gray-700 rounded-xl"></div>
            <div className="h-32 bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

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
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Add Favorites
          </button>
        </div>
      )}

      {/* Edit Mode: Show Add Button */}
      {isEditMode && favorites.length > 0 && availableToAdd.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-600 hover:border-blue-500 text-gray-400 hover:text-blue-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add More Favorites
          </button>
        </div>
      )}

      {/* Add Favorites Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">Add to Favorites</h3>
                <p className="text-gray-400 text-sm mt-1">Select items to add to your dashboard</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {availableToAdd.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availableToAdd.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleAddFavorite(item);
                        if (availableToAdd.length === 1) {
                          setShowAddModal(false);
                        }
                      }}
                      className="bg-gray-800/50 border border-gray-700 hover:border-blue-500 rounded-xl p-4 text-left transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 group"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${item.iconColor} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <span className="text-2xl">
                          {item.icon === 'credit-card' && '💳'}
                          {item.icon === 'leaf' && '🌿'}
                          {item.icon === 'zap' && '⚡'}
                          {item.icon === 'ticket' && '🎫'}
                        </span>
                      </div>
                      <h4 className="text-white font-semibold mb-1">{item.name}</h4>
                      <p className="text-gray-400 text-sm">Click to add</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">All available items are already in your favorites!</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-700">
              <button
                onClick={() => setShowAddModal(false)}
                className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
