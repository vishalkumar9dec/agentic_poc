import type { Metrics, ActivityItem, Product, FavoriteItem } from '@/types/dashboard';

// Mock Metrics Data
export const mockMetrics: Metrics = {
  pendingApprovals: {
    count: 3,
    subtitle: 'Waiting for your review',
  },
  activeTickets: {
    count: 5,
    highPriority: 2,
  },
  cloudBudget: {
    percentage: 84,
  },
  efficiencyScore: {
    score: 92,
    percentile: 5,
  },
};

// Mock Activity Data
export const mockActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'success',
    title: 'Request Approved',
    subtitle: 'AWS EC2 Instance Large',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
  },
  {
    id: '2',
    type: 'warning',
    title: 'Budget Alert',
    subtitle: 'Q3 Marketing Spend',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5h ago
  },
  {
    id: '3',
    type: 'info',
    title: 'Ticket Updated',
    subtitle: 'INC-2024-892',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1d ago
  },
];

// Product/Feature Data
export const products: Product[] = [
  {
    id: 'finops',
    name: 'FinOps',
    description: 'Optimize cloud costs & manage financial operations',
    icon: 'credit-card',
    status: 'coming-soon',
    route: '/finops',
  },
  {
    id: 'greenops',
    name: 'GreenOps',
    description: 'Track carbon footprint & sustainable operations',
    icon: 'leaf',
    status: 'coming-soon',
    route: '/greenops',
  },
  {
    id: 'ticket-mgmt',
    name: 'Ticket Mgmt',
    description: 'AI-assisted support ticket tracking',
    icon: 'ticket',
    status: 'available',
    route: '/tickets',
  },
];

// Favorite Items Data
export const favoriteItems: FavoriteItem[] = [
  {
    id: 'cost-explorer',
    name: 'Cost Explorer',
    icon: 'credit-card',
    iconColor: 'from-green-500 to-emerald-600',
  },
  {
    id: 'carbon-footprint',
    name: 'Carbon Footprint',
    icon: 'leaf',
    iconColor: 'from-green-500 to-teal-600',
  },
  {
    id: 'deploy-status',
    name: 'Deploy Status',
    icon: 'zap',
    iconColor: 'from-yellow-500 to-orange-600',
  },
];

// Helper function for relative time
export function getRelativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diff = now - then;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}
