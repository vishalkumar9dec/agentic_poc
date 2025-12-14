"use client";

import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useState, useEffect } from "react";
import TicketManagement from "@/features/tickets/TicketManagement";
import FinOps from "@/features/finops/FinOps";
import GreenOps from "@/features/greenops/GreenOps";
import { useUserState } from "@/hooks/useUserState";
import WelcomeModal from "@/components/dashboard/WelcomeModal";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import FavoritesSection from "@/components/dashboard/FavoritesSection";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import ProductsGrid from "@/components/dashboard/ProductsGrid";
import CustomizeDashboardModal from "@/components/dashboard/CustomizeDashboardModal";
import CostSummaryCard from "@/components/finops/CostSummaryCard";
import ProviderComparisonCard from "@/components/finops/ProviderComparisonCard";

interface Ticket {
  id: number;
  title: string;
  status: string;
  operation: string;
  requester: string;
}

type FeatureView = "dashboard" | "tickets" | "finops" | "greenops";

export default function Home() {
  const [currentView, setCurrentView] = useState<FeatureView>("dashboard");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    status: 'Open',
    operation: 'task',
    requester: ''
  });

  // Phase 1: User State Management
  const { userState, isLoading, setUserName, updateDashboardLayout } = useUserState();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  // FinOps filter state
  const [finopsFilters, setFinopsFilters] = useState<{
    selectedProviders: string[];
    selectedServices: string[];
    preset?: string;
    chartType?: "area" | "bar" | "line";
    viewMode?: "chart" | "table";
  }>({
    selectedProviders: ["AWS", "Azure", "GCP"],
    selectedServices: [],
    chartType: "area",
    viewMode: "chart"
  });

  // Show welcome modal if user has no name
  useEffect(() => {
    if (!isLoading && !userState.name) {
      setShowWelcomeModal(true);
    }
  }, [isLoading, userState.name]);

  // Handle welcome modal completion
  const handleWelcomeComplete = (name: string) => {
    setUserName(name);
    setShowWelcomeModal(false);
  };

  // Make tickets available to the AI
  useCopilotReadable({
    description: "Current list of tickets in the system",
    value: tickets,
  });

  // Action to get all tickets
  useCopilotAction({
    name: "getAllTickets",
    description: "Retrieve all tickets from the database",
    parameters: [],
    handler: async () => {
      try {
        const response = await fetch("http://localhost:8000/tickets");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTickets(data);
        // Navigate to tickets view
        setCurrentView("tickets");
        return { success: true, tickets: data };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    },
  });

  // Action to open ticket creation form
  useCopilotAction({
    name: "openCreateTicketForm",
    description: "Open a form to create a new ticket. Use this when user asks to create a ticket.",
    parameters: [],
    handler: async () => {
      setShowCreateForm(true);
      return { success: true, message: "Opening ticket creation form..." };
    },
  });

  // Action to navigate to FinOps
  useCopilotAction({
    name: "navigateToFinOps",
    description: "Navigate to the FinOps dashboard for cloud cost management. Use this when user asks about costs, cloud spending, FinOps, or wants to see the FinOps page.",
    parameters: [],
    handler: async () => {
      setCurrentView("finops");
      return {
        success: true,
        message: "Navigating to FinOps dashboard... You can now ask me questions like:\n• Show me AWS costs\n• What were my costs last month?\n• Compare costs across providers\n• Which service is most expensive?"
      };
    },
  });

  // Action to show cost summary with generative UI
  useCopilotAction({
    name: "showCostSummary",
    description: "Display a visual cost summary card for a specific provider or all providers combined. Use this when user asks to see costs, breakdown, or spending for a provider.",
    parameters: [
      {
        name: "provider",
        type: "string",
        description: "Cloud provider name (AWS, Azure, or GCP). Leave empty for combined total.",
        required: false,
      },
      {
        name: "period",
        type: "string",
        description: "Time period description (e.g., 'November 2025', 'last month')",
        required: false,
      },
    ],
    handler: async ({ provider, period }) => {
      try {
        // Fetch cost data from backend
        const preset = "last_month"; // Could be dynamic based on period
        const response = await fetch(`http://localhost:8000/api/finops/costs/summary?preset=${preset}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const summary = await response.json();

        // If specific provider requested, filter data
        if (provider) {
          const providerUpper = provider.toUpperCase();

          // Try to find provider cost with different casing (backend might use title case)
          const providerCost = summary.by_provider[providerUpper] ||
                               summary.by_provider[provider] ||
                               summary.by_provider[provider.charAt(0).toUpperCase() + provider.slice(1).toLowerCase()] ||
                               0;

          const providerServices = summary.top_services.filter((s: any) => {
            // Check if service belongs to this provider
            if (providerUpper === "AWS" && ["EC2", "S3", "Lambda"].includes(s.name)) return true;
            if (providerUpper === "AZURE" && ["Virtual Machines", "Blob Storage", "Azure Functions"].includes(s.name)) return true;
            if (providerUpper === "GCP" && ["Compute Engine", "Cloud Storage", "Cloud Functions"].includes(s.name)) return true;
            return false;
          });

          // Calculate total from services if provider cost is 0
          const calculatedTotal = providerServices.reduce((sum: number, s: any) => sum + s.cost, 0);
          const finalCost = providerCost > 0 ? providerCost : calculatedTotal;

          return {
            success: true,
            provider: providerUpper,
            totalCost: finalCost,
            breakdown: providerServices,
            period: period || "last month"
          };
        }

        // Return combined summary
        return {
          success: true,
          totalCost: summary.total_cost,
          breakdown: summary.top_services,
          period: period || "last month"
        };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    },
    render: ({ status, result }) => {
      if (status === "complete" && result.success) {
        return (
          <CostSummaryCard
            provider={result.provider}
            totalCost={result.totalCost}
            breakdown={result.breakdown}
            period={result.period}
          />
        );
      }
      return null;
    },
  });

  // Action to compare providers with generative UI
  useCopilotAction({
    name: "compareProviders",
    description: "Display a visual comparison of costs across cloud providers (AWS, Azure, GCP). Use this when user wants to compare or see all providers.",
    parameters: [
      {
        name: "period",
        type: "string",
        description: "Time period description (e.g., 'November 2025', 'last month')",
        required: false,
      },
    ],
    handler: async ({ period }) => {
      try {
        const preset = "last_month";
        const response = await fetch(`http://localhost:8000/api/finops/costs/summary?preset=${preset}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const summary = await response.json();

        // Transform data for provider comparison
        const providers = Object.entries(summary.by_provider).map(([name, cost]) => ({
          name,
          cost: cost as number,
          percentage: ((cost as number) / summary.total_cost) * 100
        }));

        return {
          success: true,
          providers,
          totalCost: summary.total_cost,
          period: period || "last month"
        };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    },
    render: ({ status, result }) => {
      if (status === "complete" && result.success) {
        return (
          <ProviderComparisonCard
            providers={result.providers}
            totalCost={result.totalCost}
            period={result.period}
          />
        );
      }
      return null;
    },
  });

  // Action to query FinOps costs (for text responses)
  useCopilotAction({
    name: "queryFinOpsCosts",
    description: "Query cloud costs using natural language for detailed text analysis. Use this for specific questions that need detailed explanations.",
    parameters: [
      {
        name: "query",
        type: "string",
        description: "Natural language query about costs (e.g., 'show me AWS costs last month', 'compare providers', 'most expensive service')",
        required: true,
      },
    ],
    handler: async ({ query }) => {
      try {
        // Navigate to FinOps first if not already there
        setCurrentView("finops");

        // Call the AI query endpoint
        const response = await fetch("http://localhost:8000/api/finops/ai/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Auto-update dashboard filters based on query AND AI response
        const queryLower = query.toLowerCase();
        const responseLower = (data.response || "").toLowerCase();
        // RESET filters to defaults first
        const newFilters: any = {
          selectedProviders: ["AWS", "Azure", "GCP"],
          selectedServices: [],
          chartType: "area",
          viewMode: "chart"
        };

        // Service grouping by provider
        const servicesByProvider: Record<string, string[]> = {
          AWS: ["EC2", "S3", "Lambda"],
          Azure: ["Virtual Machines", "Blob Storage", "Azure Functions"],
          GCP: ["Compute Engine", "Cloud Storage", "Cloud Functions"]
        };

        // Detect provider filters from query - check for specific provider mentions
        const hasAWS = queryLower.includes("aws");
        const hasAzure = queryLower.includes("azure");
        const hasGCP = queryLower.includes("gcp") || queryLower.includes("google");
        const hasCompare = queryLower.includes("compare") || queryLower.includes("all");

        // If specific provider mentioned (not comparing), filter to that provider only
        if (hasAzure && !hasAWS && !hasGCP && !hasCompare) {
          newFilters.selectedProviders = ["Azure"];
          newFilters.selectedServices = servicesByProvider.Azure;
        } else if (hasAWS && !hasAzure && !hasGCP && !hasCompare) {
          newFilters.selectedProviders = ["AWS"];
          newFilters.selectedServices = servicesByProvider.AWS;
        } else if (hasGCP && !hasAWS && !hasAzure && !hasCompare) {
          newFilters.selectedProviders = ["GCP"];
          newFilters.selectedServices = servicesByProvider.GCP;
        }
        // If comparing or mentioning multiple, show all
        else {
          newFilters.selectedProviders = ["AWS", "Azure", "GCP"];
          newFilters.selectedServices = [...servicesByProvider.AWS, ...servicesByProvider.Azure, ...servicesByProvider.GCP];
        }

        // Detect service filters from both query and AI response
        const allServices = ["EC2", "S3", "Lambda", "Virtual Machines", "Blob Storage", "Azure Functions", "Compute Engine", "Cloud Storage", "Cloud Functions"];

        // First check if specific services are mentioned in query
        let matchedServices = allServices.filter(service =>
          queryLower.includes(service.toLowerCase())
        );

        // If no services in query, check AI response for service mentions
        if (matchedServices.length === 0 && responseLower) {
          const servicesInResponse = allServices.filter(service =>
            responseLower.includes(service.toLowerCase())
          );

          // If "most expensive" or similar analysis in query, focus on the primary service mentioned
          if ((queryLower.includes("most expensive") || queryLower.includes("expensive") || queryLower.includes("top")) && servicesInResponse.length > 0) {
            // Take only the first mentioned service (likely the most expensive one)
            matchedServices = [servicesInResponse[0]];

            // Also filter to the correct provider for this service
            for (const [provider, providerServices] of Object.entries(servicesByProvider)) {
              if (providerServices.includes(servicesInResponse[0])) {
                newFilters.selectedProviders = [provider];
                break;
              }
            }
          } else if (servicesInResponse.length > 0) {
            // For other queries, show all mentioned services
            matchedServices = servicesInResponse;
          }
        }

        // Apply matched services to filters
        if (matchedServices.length > 0) {
          newFilters.selectedServices = matchedServices;
        }

        // Detect time period from query
        if (queryLower.includes("last month")) {
          newFilters.preset = "last_month";
        } else if (queryLower.includes("this month")) {
          newFilters.preset = "this_month";
        } else if (queryLower.includes("last week")) {
          newFilters.preset = "last_week";
        } else if (queryLower.includes("this week")) {
          newFilters.preset = "this_week";
        }

        // Detect chart type from query
        if (queryLower.includes("bar chart") || queryLower.includes("bar graph")) {
          newFilters.chartType = "bar";
          newFilters.viewMode = "chart";
        } else if (queryLower.includes("line chart") || queryLower.includes("line graph")) {
          newFilters.chartType = "line";
          newFilters.viewMode = "chart";
        } else if (queryLower.includes("area chart") || queryLower.includes("area graph")) {
          newFilters.chartType = "area";
          newFilters.viewMode = "chart";
        } else if (queryLower.includes("table") || queryLower.includes("tabular")) {
          newFilters.viewMode = "table";
        }

        setFinopsFilters(newFilters);

        return {
          success: true,
          response: data.response,
          data: data.data,
          recommendations: data.recommendations
        };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    },
  });

  // Handle form submission
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const response = await fetch("http://localhost:8000/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Refresh tickets list
      const ticketsResponse = await fetch("http://localhost:8000/tickets");
      if (ticketsResponse.ok) {
        const updatedTickets = await ticketsResponse.json();
        setTickets(updatedTickets);
      }
      // Navigate to tickets view
      setCurrentView("tickets");
      setShowCreateForm(false);
      setFormData({ title: '', status: 'Open', operation: 'task', requester: '' });
    } catch (error) {
      alert('Error creating ticket: ' + String(error));
    } finally {
      setIsCreating(false);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "tickets":
        return <TicketManagement onBack={() => setCurrentView("dashboard")} tickets={tickets} setTickets={setTickets} />;
      case "finops":
        return (
          <FinOps
            onBack={() => setCurrentView("dashboard")}
            externalFilters={finopsFilters}
            onFiltersChange={setFinopsFilters}
          />
        );
      case "greenops":
        return <GreenOps onBack={() => setCurrentView("dashboard")} />;
      default:
        return (
          <div className="max-w-7xl mx-auto p-8">
            {/* Phase 3: Metrics Grid */}
            {userState.dashboardLayout.metricsVisible && (
              <MetricsGrid tickets={tickets} />
            )}

            {/* Phase 4 & 5: Two-Column Layout - Favorites + Activity */}
            {(userState.dashboardLayout.favoritesVisible || userState.dashboardLayout.activityVisible) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {userState.dashboardLayout.favoritesVisible && <FavoritesSection />}
                {userState.dashboardLayout.activityVisible && <ActivityTimeline />}
              </div>
            )}

            {/* Phase 6: Product Cards / Features Grid */}
            {userState.dashboardLayout.productsVisible && (
              <ProductsGrid onNavigate={setCurrentView} className="mb-8" />
            )}

            {/* Features Info */}
            <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                What is Jarvis?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Jarvis is your AI-powered operations platform that brings together essential tools for modern teams:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Ticket Management:</strong> Streamline support workflows with intelligent ticket tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span><strong>FinOps:</strong> Optimize cloud costs and manage financial operations efficiently</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  <span><strong>GreenOps:</strong> Monitor environmental impact and implement sustainable practices</span>
                </li>
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Phase 2: Dashboard Layout with Sidebar and TopBar */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardLayout
          userName={userState.name || 'User'}
          userRole={userState.role}
          currentView={currentView}
          onCustomizeDashboard={() => setShowCustomizeModal(true)}
        >
          {renderContent()}
        </DashboardLayout>
      </div>

      {/* AI Chat Sidebar - Essential for Agentic AI interaction */}
      <div className="w-96 border-l border-gray-700 shadow-2xl flex flex-col h-screen bg-gray-900">
        {/* Voice Button - Fixed at Top */}
        <div className="flex-none p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <button
            disabled
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 opacity-50 cursor-not-allowed relative"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <span>Voice Input</span>
            <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
              Coming Soon
            </span>
          </button>
        </div>

        {/* Copilot Chat - Scrollable Area */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          <CopilotChat
            className="flex-1 overflow-y-auto"
            instructions={`You are Jarvis, an AI assistant for a comprehensive operations platform.

Jarvis has three main features:

1. **Ticket Management System** (Currently Available):
   - Create and manage support tickets
   - Track ticket status and operations
   - View all tickets with AI assistance
   - IMPORTANT: When users ask to create a ticket, use the openCreateTicketForm() action to open a form
   - Use getAllTickets() to retrieve tickets

2. **FinOps** (Now Available):
   - Financial operations and cloud cost management
   - View costs by provider (AWS, Azure, GCP) and services
   - Query costs using natural language
   - Budget optimization and tracking
   - Use navigateToFinOps() to open the FinOps dashboard
   - Use showCostSummary() to display visual cost cards for a specific provider or combined total
   - Use compareProviders() to show a visual comparison across all cloud providers
   - Use queryFinOpsCosts() for detailed text-based cost analysis

3. **GreenOps** (Coming Soon):
   - Sustainable operations and environmental monitoring
   - Carbon footprint tracking
   - Energy usage optimization
   - Currently under development

Help users navigate between features, create tickets, analyze cloud costs, and understand what Jarvis offers. Be friendly, professional, and concise.

When users ask about FinOps or costs:
- Use navigateToFinOps() to navigate to the FinOps page
- Use queryFinOpsCosts() to answer specific cost questions
- Provide helpful suggestions for cost queries

When users ask about GreenOps, let them know this feature is coming soon.

IMPORTANT: When users ask to create a ticket, ALWAYS use openCreateTicketForm() action to open the form.`}
            labels={{
              title: "Jarvis Assistant",
              initial: "Hi! I'm Jarvis, your AI operations assistant. I can help you with:\n\n• Create & view tickets\n• Analyze cloud costs with visual cards (try: 'show me AWS costs')\n• Compare provider spending with charts\n• Get cost optimization recommendations\n• Navigate between features\n\nI can display interactive cost cards and visualizations right here in the chat!\n\nWhat would you like to do?",
            }}
          />

          {/* Quick Actions - Inline pills just above text input (like reference image) */}
          {currentView === "finops" && (
            <div className="flex-none px-4 py-2 bg-gray-900 border-t border-gray-700">
              <div className="flex flex-wrap gap-2">
                {[
                  "Show costs last month",
                  "Compare all providers",
                  "Most expensive service",
                  "Optimization tips",
                  "Cost by service",
                  "Budget recommendations"
                ].map((query, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      console.log("Quick action clicked:", query);

                      // Service grouping by provider
                      const servicesByProvider: Record<string, string[]> = {
                        AWS: ["EC2", "S3", "Lambda"],
                        Azure: ["Virtual Machines", "Blob Storage", "Azure Functions"],
                        GCP: ["Compute Engine", "Cloud Storage", "Cloud Functions"]
                      };

                      // Reset and apply new filters
                      const queryLower = query.toLowerCase();
                      const newFilters: any = {
                        selectedProviders: ["AWS", "Azure", "GCP"],
                        selectedServices: [...servicesByProvider.AWS, ...servicesByProvider.Azure, ...servicesByProvider.GCP],
                        chartType: "area",
                        viewMode: "chart"
                      };

                      // Apply filters based on query
                      if (queryLower.includes("compare") || queryLower.includes("all")) {
                        newFilters.selectedProviders = ["AWS", "Azure", "GCP"];
                        newFilters.selectedServices = [...servicesByProvider.AWS, ...servicesByProvider.Azure, ...servicesByProvider.GCP];
                      }
                      if (queryLower.includes("last month")) {
                        newFilters.preset = "last_month";
                      }

                      setFinopsFilters(newFilters);

                      // Fetch AI response and update
                      fetch("http://localhost:8000/api/finops/ai/query", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ query }),
                      })
                        .then(res => res.json())
                        .then(data => {
                          console.log("✅ Filters applied!");
                          console.log("AI Response:", data.response);
                        })
                        .catch(err => console.error("Error:", err));
                    }}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-full border border-gray-700 hover:border-gray-600 transition-all"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in border border-gray-200 dark:border-gray-800">
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🎫</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Create New Ticket</h2>
                    <p className="text-white/80 text-sm">Fill in the details below</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-white hover:bg-white/20 rounded-xl p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white font-medium"
                  placeholder="e.g., Fix login timeout issue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white font-medium"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Type</label>
                  <select
                    required
                    value={formData.operation}
                    onChange={(e) => setFormData({ ...formData, operation: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white font-medium"
                  >
                    <option value="bug_fix">Bug Fix</option>
                    <option value="feature">Feature</option>
                    <option value="task">Task</option>
                    <option value="request_gitlab_access">GitLab Access</option>
                    <option value="documentation">Documentation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Requester</label>
                <input
                  type="text"
                  required
                  value={formData.requester}
                  onChange={(e) => setFormData({ ...formData, requester: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white font-medium"
                  placeholder="Your name"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create Ticket'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-4 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Phase 1: Welcome Modal */}
      {showWelcomeModal && (
        <WelcomeModal onComplete={handleWelcomeComplete} />
      )}

      {/* Phase 7: Customize Dashboard Modal */}
      <CustomizeDashboardModal
        isOpen={showCustomizeModal}
        onClose={() => setShowCustomizeModal(false)}
        currentLayout={userState.dashboardLayout}
        onSave={updateDashboardLayout}
      />
    </div>
  );
}
