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
  const { userState, isLoading, setUserName } = useUserState();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

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
        return <FinOps onBack={() => setCurrentView("dashboard")} />;
      case "greenops":
        return <GreenOps onBack={() => setCurrentView("dashboard")} />;
      default:
        return (
          <div className="max-w-7xl mx-auto p-8">
            {/* Phase 2: Metrics Grid */}
            <MetricsGrid />

            {/* Phase 3: Favorites Section */}
            <FavoritesSection className="mb-8" />

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* FinOps Card */}
              <button
                onClick={() => setCurrentView("finops")}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-left relative overflow-hidden"
              >
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs font-bold rounded-full">
                    Coming Soon
                  </span>
                </div>
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">💰</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    FinOps
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Financial operations, cloud cost management, and budget optimization
                  </p>
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400 font-semibold">
                  <span>Preview</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* GreenOps Card */}
              <button
                onClick={() => setCurrentView("greenops")}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-left relative overflow-hidden"
              >
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-full">
                    Coming Soon
                  </span>
                </div>
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🌱</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    GreenOps
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Sustainable operations, carbon footprint tracking, and energy optimization
                  </p>
                </div>
                <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Preview</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Ticket Management Card */}
              <button
                onClick={() => setCurrentView("tickets")}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-left"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🎫</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Ticket Management
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Create, track, and manage support tickets with AI assistance
                  </p>
                </div>
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold">
                  <span>Launch</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>

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
          onCustomizeDashboard={() => alert('Customize Dashboard feature coming soon!')}
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
        <div className="flex-1 overflow-hidden">
          <CopilotChat
            className="h-full overflow-y-auto"
            instructions={`You are Jarvis, an AI assistant for a comprehensive operations platform.

Jarvis has three main features:

1. **Ticket Management System** (Currently Available):
   - Create and manage support tickets
   - Track ticket status and operations
   - View all tickets with AI assistance
   - IMPORTANT: When users ask to create a ticket, use the openCreateTicketForm() action to open a form
   - Use getAllTickets() to retrieve tickets

2. **FinOps** (Coming Soon):
   - Financial operations and cloud cost management
   - Budget optimization and tracking
   - Currently under development

3. **GreenOps** (Coming Soon):
   - Sustainable operations and environmental monitoring
   - Carbon footprint tracking
   - Energy usage optimization
   - Currently under development

Help users navigate between features, create tickets, and understand what Jarvis offers. Be friendly, professional, and concise. When users ask about FinOps or GreenOps, let them know these features are coming soon.

IMPORTANT: When users ask to create a ticket, ALWAYS use openCreateTicketForm() action to open the form.`}
            labels={{
              title: "Jarvis Assistant",
              initial: "Hi! I'm Jarvis, your AI operations assistant. I can help you with:\n\n• Create & view tickets (just ask me!)\n• Learn about FinOps & GreenOps (coming soon)\n• Navigate between features\n\nWhat would you like to do?",
            }}
          />
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
    </div>
  );
}
