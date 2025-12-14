"use client";

interface CostSummaryCardProps {
  provider?: string;
  totalCost: number;
  breakdown?: Array<{
    name: string;
    cost: number;
    percentage: number;
  }>;
  period?: string;
}

export default function CostSummaryCard({
  provider,
  totalCost,
  breakdown,
  period = "this period"
}: CostSummaryCardProps) {
  const getProviderColor = (provider?: string) => {
    switch (provider?.toUpperCase()) {
      case "AWS":
        return "from-orange-500 to-yellow-600";
      case "AZURE":
        return "from-blue-500 to-cyan-600";
      case "GCP":
        return "from-green-500 to-emerald-600";
      default:
        return "from-purple-500 to-pink-600";
    }
  };

  const getProviderIcon = (provider?: string) => {
    switch (provider?.toUpperCase()) {
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

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700 shadow-xl max-w-md my-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getProviderColor(provider)} flex items-center justify-center text-xl shadow-lg`}>
            {getProviderIcon(provider)}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">
              {provider ? `${provider} Costs` : "Total Costs"}
            </h3>
            <p className="text-gray-400 text-xs">{period}</p>
          </div>
        </div>
      </div>

      {/* Total Cost */}
      <div className="bg-gray-900/50 rounded-xl p-4 mb-4">
        <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Total Spend</div>
        <div className="text-3xl font-bold text-white">
          ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* Breakdown */}
      {breakdown && breakdown.length > 0 && (
        <div className="space-y-2">
          <div className="text-gray-400 text-xs uppercase tracking-wide mb-2">Breakdown by Service</div>
          {breakdown.map((item, index) => (
            <div key={index} className="bg-gray-900/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-300 text-sm font-medium">{item.name}</span>
                <span className="text-white font-bold text-sm">
                  ${item.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`bg-gradient-to-r ${getProviderColor(provider)} h-1.5 rounded-full`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-gray-400 text-xs">{item.percentage.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
