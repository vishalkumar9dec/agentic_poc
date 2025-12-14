"use client";

import ProductCard from './ProductCard';
import { products } from '@/utils/mockData';
import { useFavorites } from '@/hooks/useFavorites';

type FeatureView = "dashboard" | "tickets" | "finops" | "greenops";

interface ProductsGridProps {
  onNavigate: (view: FeatureView) => void;
  className?: string;
}

// Icon mapping for products
const iconMap: Record<string, React.ReactNode> = {
  'credit-card': <span className="text-4xl">💰</span>,
  'leaf': <span className="text-4xl">🌱</span>,
  'ticket': <span className="text-4xl">🎫</span>,
};

// Route to view mapping
const routeToViewMap: Record<string, FeatureView> = {
  '/finops': 'finops',
  '/greenops': 'greenops',
  '/tickets': 'tickets',
};

export default function ProductsGrid({ onNavigate, className = '' }: ProductsGridProps) {
  const { isFavorited, toggleFavorite } = useFavorites();

  const handleFavoriteToggle = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      // Convert product to FavoriteItem format
      toggleFavorite({
        id: product.id,
        name: product.name,
        icon: product.icon,
        iconColor: getIconColor(product.icon),
      });
    }
  };

  const handleNavigate = (route?: string) => {
    if (route) {
      const view = routeToViewMap[route] || 'dashboard';
      onNavigate(view);
    }
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Explore CCoE Products</h2>
        <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-1">
          <span>View All</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            icon={iconMap[product.icon] || iconMap['ticket']}
            title={product.name}
            description={product.description}
            status={product.status}
            isFavorited={isFavorited(product.id)}
            onFavoriteToggle={handleFavoriteToggle}
            onNavigate={() => handleNavigate(product.route)}
          />
        ))}
      </div>
    </div>
  );
}

// Helper function to get icon color based on icon type
function getIconColor(icon: string): string {
  switch (icon) {
    case 'credit-card':
      return 'from-green-500 to-emerald-600';
    case 'leaf':
      return 'from-emerald-500 to-teal-600';
    case 'ticket':
      return 'from-blue-500 to-purple-600';
    default:
      return 'from-gray-500 to-gray-600';
  }
}
