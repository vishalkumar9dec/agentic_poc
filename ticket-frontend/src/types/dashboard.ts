// User State Types
export interface UserState {
  name: string;
  role: string;
  verifiedAccess: boolean;
  favorites: string[];
  dashboardLayout: DashboardLayout;
  isFirstVisit: boolean;
}

export interface DashboardLayout {
  metricsVisible: boolean;
  favoritesVisible: boolean;
  activityVisible: boolean;
  productsVisible: boolean;
}

// Metrics Types
export interface Metrics {
  pendingApprovals: PendingApprovals;
  activeTickets: ActiveTickets;
  cloudBudget: CloudBudget;
  efficiencyScore: EfficiencyScore;
}

export interface PendingApprovals {
  count: number;
  subtitle: string;
}

export interface ActiveTickets {
  count: number;
  highPriority: number;
}

export interface CloudBudget {
  percentage: number;
}

export interface EfficiencyScore {
  score: number;
  percentile: number;
}

// Activity Types
export type ActivityType = 'success' | 'warning' | 'info';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  subtitle: string;
  timestamp: string;
}

// Product/Feature Types
export interface Product {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'available' | 'coming-soon';
  route?: string;
}

// Favorite Item Types
export interface FavoriteItem {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
}
