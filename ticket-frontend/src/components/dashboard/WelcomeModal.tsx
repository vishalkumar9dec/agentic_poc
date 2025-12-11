"use client";

import { useState } from 'react';

interface WelcomeModalProps {
  onComplete: (name: string) => void;
}

export default function WelcomeModal({ onComplete }: WelcomeModalProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-center">
          <div className="w-20 h-20 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <span className="text-5xl">👋</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome to Jarvis
          </h2>
          <p className="text-white/90 text-sm">
            AI-powered operations platform for modern teams
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-300 mb-3"
            >
              What should we call you?
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 text-lg transition-all"
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}
