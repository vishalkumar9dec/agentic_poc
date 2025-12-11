"use client";

import MetricCard from './MetricCard';
import { mockMetrics } from '@/utils/mockData';

export default function MetricsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Pending Approvals */}
      <MetricCard
        title="PENDING APPROVALS"
        value={mockMetrics.pendingApprovals.count}
        subtitle={mockMetrics.pendingApprovals.subtitle}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
        iconColor="bg-orange-500/20 text-orange-400"
      />

      {/* Active Tickets */}
      <MetricCard
        title="ACTIVE TICKETS"
        value={mockMetrics.activeTickets.count}
        subtitle={`${mockMetrics.activeTickets.highPriority} high priority`}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
            />
          </svg>
        }
        iconColor="bg-blue-500/20 text-blue-400"
      />

      {/* Cloud Budget */}
      <MetricCard
        title="CLOUD BUDGET"
        value={`${mockMetrics.cloudBudget.percentage}%`}
        showProgress
        progressValue={mockMetrics.cloudBudget.percentage}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        }
        iconColor="bg-green-500/20 text-green-400"
      />

      {/* Efficiency Score */}
      <MetricCard
        title="EFFICIENCY SCORE"
        value={mockMetrics.efficiencyScore.score}
        subtitle={`↗ Top ${mockMetrics.efficiencyScore.percentile}% of users`}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        }
        iconColor="bg-purple-500/20 text-purple-400"
      />
    </div>
  );
}
