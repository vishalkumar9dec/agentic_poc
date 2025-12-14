"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/types/dashboard';

interface CustomizeDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLayout: DashboardLayout;
  onSave: (layout: DashboardLayout) => void;
}

const defaultLayout: DashboardLayout = {
  metricsVisible: true,
  favoritesVisible: true,
  activityVisible: true,
  productsVisible: true,
};

export default function CustomizeDashboardModal({
  isOpen,
  onClose,
  currentLayout,
  onSave,
}: CustomizeDashboardModalProps) {
  const [layout, setLayout] = useState<DashboardLayout>(currentLayout);

  // Update local state when currentLayout changes
  useEffect(() => {
    setLayout(currentLayout);
  }, [currentLayout]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleToggle = (key: keyof DashboardLayout) => {
    setLayout(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleReset = () => {
    setLayout(defaultLayout);
  };

  const handleSave = () => {
    onSave(layout);
    onClose();
  };

  if (!isOpen) return null;

  const sections = [
    {
      key: 'metricsVisible' as keyof DashboardLayout,
      title: 'Metrics Cards',
      description: 'Show pending approvals, active tickets, budget, and efficiency score',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      key: 'favoritesVisible' as keyof DashboardLayout,
      title: 'Favorites Section',
      description: 'Quick access to your most-used features and tools',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      key: 'activityVisible' as keyof DashboardLayout,
      title: 'Recent Activity',
      description: 'Timeline of recent actions, approvals, and updates',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      key: 'productsVisible' as keyof DashboardLayout,
      title: 'Product Cards',
      description: 'Explore available CCoE products and services',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Customize Dashboard</h2>
                <p className="text-gray-400 text-sm">Choose which sections to display</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-4">
            {sections.map((section) => (
              <label
                key={section.key}
                className={`
                  flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer
                  transition-all duration-200
                  ${layout[section.key]
                    ? 'bg-blue-500/10 border-blue-500/50 hover:border-blue-500'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                  }
                `}
              >
                <div className="flex items-center h-6">
                  <input
                    type="checkbox"
                    checked={layout[section.key]}
                    onChange={() => handleToggle(section.key)}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={layout[section.key] ? 'text-blue-400' : 'text-gray-400'}>
                      {section.icon}
                    </span>
                    <h3 className="text-white font-semibold">{section.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm">{section.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
