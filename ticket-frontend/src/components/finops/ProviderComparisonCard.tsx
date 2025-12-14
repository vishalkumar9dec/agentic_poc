"use client";

interface ProviderData {
  name: string;
  cost: number;
  percentage: number;
}

interface ProviderComparisonCardProps {
  providers: ProviderData[];
  totalCost: number;
  period?: string;
}

export default function ProviderComparisonCard({
  providers,
  totalCost,
  period = "this period"
}: ProviderComparisonCardProps) {
  const getProviderColor = (providerName: string) => {
    switch (providerName.toUpperCase()) {
      case "AWS":
        return { bg: "bg-orange-500", border: "border-orange-500", text: "text-orange-400" };
      case "AZURE":
        return { bg: "bg-blue-500", border: "border-blue-500", text: "text-blue-400" };
      case "GCP":
        return { bg: "bg-green-500", border: "border-green-500", text: "text-green-400" };
      default:
        return { bg: "bg-purple-500", border: "border-purple-500", text: "text-purple-400" };
    }
  };

  const getProviderIcon = (providerName: string) => {
    switch (providerName.toUpperCase()) {
      case "AWS":
        return "☁️";
      case "AZURE":
        return "🔷";
      case "GCP":
        return "🌐";
      default:
        return "💰";
    }
  };

  // Sort providers by cost (descending)
  const sortedProviders = [...providers].sort((a, b) => b.cost - a.cost);

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700 shadow-xl max-w-md my-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-xl shadow-lg">
          📊
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">Provider Comparison</h3>
          <p className="text-gray-400 text-xs">{period}</p>
        </div>
      </div>

      {/* Total */}
      <div className="bg-gray-900/50 rounded-xl p-3 mb-4">
        <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Combined Total</div>
        <div className="text-2xl font-bold text-white">
          ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* Provider Breakdown */}
      <div className="space-y-3">
        {sortedProviders.map((provider, index) => {
          const colors = getProviderColor(provider.name);
          return (
            <div key={index} className="bg-gray-900/30 rounded-xl p-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">{getProviderIcon(provider.name)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-semibold text-sm">{provider.name}</span>
                    <span className="text-white font-bold text-sm">
                      ${provider.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div
                        className={`${colors.bg} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${provider.percentage}%` }}
                      />
                    </div>
                    <span className={`${colors.text} text-xs font-semibold`}>
                      {provider.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
