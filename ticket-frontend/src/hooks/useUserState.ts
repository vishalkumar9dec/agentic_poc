"use client";

import { useState, useEffect } from 'react';
import type { UserState, DashboardLayout } from '@/types/dashboard';

const STORAGE_KEY = 'jarvis_user_state';

const DEFAULT_USER_STATE: UserState = {
  name: '',
  role: 'Level 3 Administrator',
  verifiedAccess: true,
  favorites: ['cost-explorer', 'carbon-footprint', 'deploy-status'],
  dashboardLayout: {
    metricsVisible: true,
    favoritesVisible: true,
    activityVisible: true,
    productsVisible: true,
  },
  isFirstVisit: true,
};

export function useUserState() {
  const [userState, setUserState] = useState<UserState>(DEFAULT_USER_STATE);
  const [isLoading, setIsLoading] = useState(true);

  // Load user state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserState;
        setUserState(parsed);
      }
    } catch (error) {
      console.error('Error loading user state:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save user state to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userState));
      } catch (error) {
        console.error('Error saving user state:', error);
      }
    }
  }, [userState, isLoading]);

  // Update functions
  const updateUserState = (updates: Partial<UserState>) => {
    setUserState(prev => ({ ...prev, ...updates }));
  };

  const setUserName = (name: string) => {
    updateUserState({
      name,
      isFirstVisit: false
    });
  };

  const setUserRole = (role: string) => {
    updateUserState({ role });
  };

  const toggleFavorite = (itemId: string) => {
    setUserState(prev => {
      const favorites = prev.favorites.includes(itemId)
        ? prev.favorites.filter(id => id !== itemId)
        : [...prev.favorites, itemId];
      return { ...prev, favorites };
    });
  };

  const updateDashboardLayout = (layout: Partial<DashboardLayout>) => {
    setUserState(prev => ({
      ...prev,
      dashboardLayout: { ...prev.dashboardLayout, ...layout },
    }));
  };

  const resetUserState = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUserState(DEFAULT_USER_STATE);
  };

  return {
    userState,
    isLoading,
    setUserName,
    setUserRole,
    toggleFavorite,
    updateDashboardLayout,
    updateUserState,
    resetUserState,
  };
}
