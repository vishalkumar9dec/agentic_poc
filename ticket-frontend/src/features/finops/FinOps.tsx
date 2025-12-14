"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CloudCost {
  id: number;
  cloud_provider: string;
  service_name: string;
  cost: number;
  date: string;
  created_at: string;
}

interface CostDataResponse {
  data: CloudCost[];
  metadata: {
    total_cost: number;
    date_range: {
      start: string | null;
      end: string | null;
    };
    provider_summary: Record<string, number>;
    service_summary: Record<string, number>;
  };
  query_info: {
    cloud_provider: string | null;
    service_name: string | null;
    start_date: string | null;
    end_date: string | null;
    preset: string | null;
    granularity: string;
    record_count: number;
  };
}

interface CostSummary {
  total_cost: number;
  by_provider: Record<string, number>;
  by_service: Record<string, number>;
  trend: string;
  percentage_change: number;
  top_services: Array<{ name: string; cost: number; percentage: number }>;
  top_providers: Array<{ name: string; cost: number; percentage: number }>;
}

interface FinOpsProps {
  onBack: () => void;
  externalFilters?: {
    selectedProviders: string[];
    selectedServices: string[];
    preset?: string;
    chartType?: "area" | "bar" | "line";
    viewMode?: "chart" | "table";
  };
  onFiltersChange?: (filters: any) => void;
}

type ViewMode = "chart" | "table";
type ChartType = "area" | "bar" | "line";
type DatePreset = "this_week" | "last_week" | "this_month" | "last_month" | "last_30_days" | "last_90_days";
type Granularity = "daily" | "weekly" | "monthly";

const API_BASE = "http://localhost:8000/api/finops";

export default function FinOps({ onBack, externalFilters, onFiltersChange }: FinOpsProps) {
  const [costData, setCostData] = useState<CostDataResponse | null>(null);
  const [summary, setSummary] = useState<CostSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("chart");
  const [chartType, setChartType] = useState<ChartType>("area");
  const [preset, setPreset] = useState<DatePreset>("last_month");
  const [granularity, setGranularity] = useState<Granularity>("daily");

  // Filters
  const [providers, setProviders] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showProviderMenu, setShowProviderMenu] = useState(false);
  const [showServiceMenu, setShowServiceMenu] = useState(false);
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Sync external filters with internal state
  useEffect(() => {
    if (externalFilters) {
      if (externalFilters.selectedProviders.length > 0) {
        setSelectedProviders(externalFilters.selectedProviders);
      }
      if (externalFilters.selectedServices && externalFilters.selectedServices.length > 0) {
        setSelectedServices(externalFilters.selectedServices);
      }
      if (externalFilters.preset) {
        setPreset(externalFilters.preset as DatePreset);
      }
      if (externalFilters.chartType) {
        setChartType(externalFilters.chartType);
      }
      if (externalFilters.viewMode) {
        setViewMode(externalFilters.viewMode);
      }
    }
  }, [externalFilters]);

  // Fetch providers
  const fetchProviders = async () => {
    try {
      console.log("Fetching providers from:", `${API_BASE}/providers`);
      const response = await fetch(`${API_BASE}/providers`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Providers fetched:", data);
      setProviders(data);
      setSelectedProviders(data); // Select all by default
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  // Fetch services
  const fetchServices = async () => {
    try {
      console.log("Fetching services from:", `${API_BASE}/services`);
      const response = await fetch(`${API_BASE}/services`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Services fetched:", data);
      setServices(data);
      setSelectedServices(data); // Select all by default
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // Group services by provider - MUST match backend data exactly
  const getServicesByProvider = () => {
    // Only show services that actually exist in the data for each provider
    const allServices = services;
    const serviceMap: Record<string, string[]> = {
      AWS: [],
      Azure: [],
      GCP: []
    };

    // Dynamically group services by checking which provider they belong to
    // AWS services
    const awsServices = ["EC2", "S3", "Lambda"];
    // Azure services
    const azureServices = ["Virtual Machines", "Blob Storage", "Azure Functions"];
    // GCP services
    const gcpServices = ["Compute Engine", "Cloud Storage", "Cloud Functions"];

    allServices.forEach(service => {
      if (awsServices.includes(service)) {
        serviceMap.AWS.push(service);
      } else if (azureServices.includes(service)) {
        serviceMap.Azure.push(service);
      } else if (gcpServices.includes(service)) {
        serviceMap.GCP.push(service);
      }
    });

    return serviceMap;
  };

  // Fetch cost data
  const fetchCostData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/costs?preset=${preset}&granularity=${granularity}`);
      const data = await response.json();
      setCostData(data);
    } catch (error) {
      console.error("Error fetching cost data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch summary
  const fetchSummary = async () => {
    try {
      const response = await fetch(`${API_BASE}/costs/summary?preset=${preset}`);
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchProviders();
    fetchServices();
  }, []);

  useEffect(() => {
    fetchCostData();
    fetchSummary();
  }, [preset, granularity]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if click is outside dropdown containers
      if (!target.closest('.provider-dropdown-container') && !target.closest('.service-dropdown-container')) {
        setShowProviderMenu(false);
        setShowServiceMenu(false);
      }
      // Close custom range if clicking outside
      if (!target.closest('.custom-range-container')) {
        setShowCustomRange(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Toggle provider selection
  const toggleProvider = (provider: string) => {
    setSelectedProviders(prev =>
      prev.includes(provider)
        ? prev.filter(p => p !== provider)
        : [...prev, provider]
    );
  };

  // Toggle service selection
  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  // Transform data for charts
  const getChartData = () => {
    if (!costData) return [];

    const grouped: Record<string, any> = {};

    // Filter data based on selected providers and services
    const filteredData = costData.data.filter(
      record =>
        selectedProviders.includes(record.cloud_provider) &&
        selectedServices.includes(record.service_name)
    );

    filteredData.forEach((record) => {
      const date = record.date;
      if (!grouped[date]) {
        grouped[date] = { date, AWS: 0, Azure: 0, GCP: 0 };
      }
      grouped[date][record.cloud_provider] += record.cost;
    });

    return Object.values(grouped).sort((a: any, b: any) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);

      return (
        <div className="bg-gray-900 bg-opacity-95 border border-gray-700 rounded-lg p-4 shadow-xl">
          <p className="text-gray-400 text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-300 text-sm">{entry.name}:</span>
              </div>
              <span className="text-white font-semibold text-sm">
                ${entry.value.toFixed(0).toLocaleString()}
              </span>
            </div>
          ))}
          <div className="border-t border-gray-700 mt-2 pt-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-300 text-sm font-semibold">Total</span>
              <span className="text-green-400 font-bold text-sm">
                ${total.toFixed(0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Download data
  const handleDownload = () => {
    if (!costData) return;

    const csv = [
      ["Date", "Provider", "Service", "Cost"],
      ...costData.data.map(item => [
        item.date,
        item.cloud_provider,
        item.service_name,
        item.cost.toFixed(2)
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finops-costs-${preset}.csv`;
    a.click();
  };

  const chartData = getChartData();

  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1 text-white">FinOps Overview</h1>
            <p className="text-gray-400 text-sm">
              Track and optimize your cloud infrastructure costs across providers.
            </p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </button>
        </div>

        {/* Filter Bar */}
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          {/* Quick Filters */}
          <button
            onClick={() => setPreset("this_week")}
            className={`px-4 py-1.5 rounded-lg font-medium transition-all text-sm ${
              preset === "this_week"
                ? "bg-gray-700 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-750"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setPreset("last_month")}
            className={`px-4 py-1.5 rounded-lg font-medium transition-all text-sm ${
              preset === "last_month"
                ? "bg-gray-700 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-750"
            }`}
          >
            Last Month
          </button>

          {/* Custom Range */}
          <div className="relative custom-range-container">
            <button
              onClick={() => setShowCustomRange(!showCustomRange)}
              className="px-4 py-1.5 rounded-lg font-medium bg-transparent text-gray-400 border-2 border-dashed border-gray-600 hover:border-gray-500 transition-all flex items-center gap-1 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Custom Range
            </button>

            {/* Custom Range Dropdown */}
            {showCustomRange && (
              <div className="absolute top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4 z-50 min-w-[280px]">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">End Date</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (customStartDate && customEndDate) {
                          // Apply custom range - would need backend support for custom dates
                          console.log("Custom range:", customStartDate, "to", customEndDate);
                          setShowCustomRange(false);
                        }
                      }}
                      disabled={!customStartDate || !customEndDate}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCustomRange(false);
                      }}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Granularity Dropdown */}
          <select
            value={granularity}
            onChange={(e) => setGranularity(e.target.value as Granularity)}
            className="px-4 py-1.5 rounded-lg font-medium bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-750 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          {/* Providers Filter */}
          <div className="relative provider-dropdown-container">
            <button
              onClick={() => setShowProviderMenu(!showProviderMenu)}
              className="px-4 py-1.5 rounded-lg font-medium bg-transparent text-gray-400 border-2 border-dashed border-gray-600 hover:border-gray-500 transition-all flex items-center gap-1 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Providers ({selectedProviders.length}/{providers.length})
            </button>

            {/* Provider Dropdown */}
            {showProviderMenu && (
              <div className="absolute top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 z-50 min-w-[220px]">
                <div className="px-4 py-2 text-white font-semibold text-sm border-b border-gray-700 mb-1">
                  Cloud Providers
                </div>
                {providers.length === 0 ? (
                  <div className="text-gray-400 text-sm px-4 py-2">Loading providers...</div>
                ) : (
                  providers.map((provider) => (
                    <div
                      key={provider}
                      onClick={() => toggleProvider(provider)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <span className="w-4 text-gray-400">
                        {selectedProviders.includes(provider) && "✓"}
                      </span>
                      <span className="text-sm text-gray-200">
                        {provider}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Services Filter */}
          <div className="relative service-dropdown-container">
            <button
              onClick={() => setShowServiceMenu(!showServiceMenu)}
              className="px-4 py-1.5 rounded-lg font-medium bg-transparent text-gray-400 border-2 border-dashed border-gray-600 hover:border-gray-500 transition-all flex items-center gap-1 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Services ({selectedServices.length}/{services.length})
            </button>

            {/* Services Dropdown */}
            {showServiceMenu && (
              <div className="absolute top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 z-50 min-w-[240px] max-h-[400px] overflow-y-auto">
                <div className="px-4 py-2 text-white font-semibold text-sm border-b border-gray-700 mb-1">
                  Services
                </div>
                {services.length === 0 ? (
                  <div className="text-gray-400 text-sm px-4 py-2">Loading services...</div>
                ) : (
                  Object.entries(getServicesByProvider()).map(([provider, providerServices]) => (
                    <div key={provider}>
                      {/* Provider Header */}
                      <div className="px-4 py-2 text-gray-400 font-medium text-xs uppercase mt-2">
                        {provider}
                      </div>
                      {/* Services under this provider */}
                      {providerServices.map((service) => (
                        <div
                          key={service}
                          onClick={() => toggleService(service)}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors ml-4"
                        >
                          <span className="w-4 text-gray-400 text-sm">
                            {selectedServices.includes(service) && "✓"}
                          </span>
                          <span className="text-sm text-gray-200">
                            {service}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-750 transition-all border border-gray-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>

        {/* Cost Trends Section */}
        <div className="bg-gray-900 bg-opacity-50 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-white mb-0.5">Cost Trends</h2>
              <p className="text-gray-400 text-sm">
                Total spend:{" "}
                <span className="text-white font-semibold">
                  ${summary?.total_cost.toLocaleString() || "0"}
                </span>{" "}
                for selected period
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-800 rounded-md p-0.5">
                <button
                  onClick={() => setViewMode("chart")}
                  className={`px-2 py-1 rounded-sm font-medium transition-all text-xs ${
                    viewMode === "chart"
                      ? "bg-gray-700 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Chart
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-2 py-1 rounded-sm font-medium transition-all text-xs ${
                    viewMode === "table"
                      ? "bg-gray-700 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Table
                </button>
              </div>

              {/* Chart Type Toggle */}
              {viewMode === "chart" && (
                <div className="flex bg-gray-800 rounded-md p-0.5">
                  <button
                    onClick={() => setChartType("area")}
                    className={`px-2 py-1 rounded-sm font-medium transition-all text-xs ${
                      chartType === "area"
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Area
                  </button>
                  <button
                    onClick={() => setChartType("bar")}
                    className={`px-2 py-1 rounded-sm font-medium transition-all text-xs ${
                      chartType === "bar"
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Bar
                  </button>
                  <button
                    onClick={() => setChartType("line")}
                    className={`px-2 py-1 rounded-sm font-medium transition-all text-xs ${
                      chartType === "line"
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Line
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Chart */}
          {viewMode === "chart" && !loading && chartData.length > 0 && (
            <div className="mt-3">
              <ResponsiveContainer width="100%" height={220}>
                {chartType === "area" ? (
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorAWS" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorAzure" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorGCP" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis
                      dataKey="date"
                      stroke="#6B7280"
                      tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      stroke="#6B7280"
                      tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="AWS"
                      stackId="1"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      fill="url(#colorAWS)"
                    />
                    <Area
                      type="monotone"
                      dataKey="Azure"
                      stackId="1"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      fill="url(#colorAzure)"
                    />
                    <Area
                      type="monotone"
                      dataKey="GCP"
                      stackId="1"
                      stroke="#10B981"
                      strokeWidth={2}
                      fill="url(#colorGCP)"
                    />
                  </AreaChart>
                ) : chartType === "bar" ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis
                      dataKey="date"
                      stroke="#6B7280"
                      tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      stroke="#6B7280"
                      tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="AWS" stackId="a" fill="#F59E0B" />
                    <Bar dataKey="Azure" stackId="a" fill="#3B82F6" />
                    <Bar dataKey="GCP" stackId="a" fill="#10B981" />
                  </BarChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis
                      dataKey="date"
                      stroke="#6B7280"
                      tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      stroke="#6B7280"
                      tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="AWS" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Azure" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="GCP" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          )}

          {/* Table View */}
          {viewMode === "table" && !loading && costData && (
            <div className="mt-3 overflow-x-auto max-h-[300px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-900">
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-2 px-3 text-gray-400 font-medium text-xs">Date</th>
                    <th className="text-left py-2 px-3 text-gray-400 font-medium text-xs">Provider</th>
                    <th className="text-left py-2 px-3 text-gray-400 font-medium text-xs">Service</th>
                    <th className="text-right py-2 px-3 text-gray-400 font-medium text-xs">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {costData.data
                    .filter(
                      item =>
                        selectedProviders.includes(item.cloud_provider) &&
                        selectedServices.includes(item.service_name)
                    )
                    .slice(0, 50)
                    .map((item, index) => (
                      <tr key={index} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                        <td className="py-2 px-3 text-gray-300 text-xs">{item.date}</td>
                        <td className="py-2 px-3">
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            item.cloud_provider === "AWS" ? "bg-orange-500 bg-opacity-20 text-orange-400" :
                            item.cloud_provider === "Azure" ? "bg-blue-500 bg-opacity-20 text-blue-400" :
                            "bg-green-500 bg-opacity-20 text-green-400"
                          }`}>
                            {item.cloud_provider}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-gray-300 text-xs">{item.service_name}</td>
                        <td className="py-2 px-3 text-right text-white font-semibold text-xs">
                          ${item.cost.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-400">Loading chart data...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
