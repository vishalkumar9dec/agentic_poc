"use client";

import { useState, useEffect } from 'react';
import type { FavoriteItem } from '@/types/dashboard';
import { favoriteItems } from '@/utils/mockData';

const FAVORITES_STORAGE_KEY = 'jarvis_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(parsed);
      } else {
        // Use default favorites if none stored
        setFavorites(favoriteItems);
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      setFavorites(favoriteItems);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
      }
    }
  }, [favorites, isLoading]);

  // Add a favorite
  const addFavorite = (favorite: FavoriteItem) => {
    setFavorites(prev => {
      // Check if already exists
      if (prev.some(f => f.id === favorite.id)) {
        return prev;
      }
      return [...prev, favorite];
    });
  };

  // Remove a favorite
  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  // Check if an item is favorited
  const isFavorited = (id: string): boolean => {
    return favorites.some(fav => fav.id === id);
  };

  // Toggle favorite
  const toggleFavorite = (favorite: FavoriteItem) => {
    if (isFavorited(favorite.id)) {
      removeFavorite(favorite.id);
    } else {
      addFavorite(favorite);
    }
  };

  // Reset to default favorites
  const resetToDefaults = () => {
    setFavorites(favoriteItems);
  };

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorited,
    toggleFavorite,
    resetToDefaults,
  };
}
