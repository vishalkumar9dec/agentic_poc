"use client";

interface GreenOpsProps {
  onBack: () => void;
}

export default function GreenOps({ onBack }: GreenOpsProps) {
  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            GreenOps
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sustainable Operations & Environmental Monitoring
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Coming Soon Section */}
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="mb-6">
            <span className="text-9xl">🌱</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Coming Soon
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
            GreenOps features will help you monitor carbon footprint, optimize energy usage, and implement sustainable practices.
          </p>
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl">
            Under Development
          </div>
        </div>
      </div>
    </div>
  );
}
