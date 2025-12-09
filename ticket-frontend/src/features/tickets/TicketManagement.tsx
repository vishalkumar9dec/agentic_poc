"use client";

import { useState } from "react";

interface Ticket {
  id: number;
  title: string;
  status: string;
  operation: string;
  requester: string;
}

const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase().replace(/[_\s]/g, "");
  if (statusLower.includes("pending") || statusLower.includes("approval")) {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
  }
  if (statusLower.includes("progress") || statusLower.includes("open")) {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
  }
  if (statusLower.includes("complete") || statusLower.includes("closed") || statusLower.includes("done")) {
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
  }
  return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
};

const getOperationIcon = (operation: string) => {
  const opLower = operation.toLowerCase();
  if (opLower.includes("bug")) return "🐛";
  if (opLower.includes("feature")) return "✨";
  if (opLower.includes("task")) return "📋";
  if (opLower.includes("request")) return "🔑";
  return "📝";
};

interface TicketManagementProps {
  onBack: () => void;
  tickets: Ticket[];
  setTickets: (tickets: Ticket[]) => void;
}

export default function TicketManagement({ onBack, tickets, setTickets }: TicketManagementProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    status: "",
    operation: "",
    requester: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all tickets
  const handleViewTickets = async () => {
    setIsLoadingTickets(true);
    setShowCreateForm(false);
    try {
      const response = await fetch("http://localhost:8000/tickets");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      alert("Failed to fetch tickets. Please try again.");
    } finally {
      setIsLoadingTickets(false);
    }
  };

  // Form submission handler
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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

      // Refresh tickets list
      const ticketsResponse = await fetch("http://localhost:8000/tickets");
      if (ticketsResponse.ok) {
        const updatedTickets = await ticketsResponse.json();
        setTickets(updatedTickets);
      }

      // Reset form and hide it
      setFormData({ title: "", status: "", operation: "", requester: "" });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ticket Management System
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your tickets with AI assistance
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

      {/* Welcome Section - Shows when no tickets and no form */}
      {tickets.length === 0 && !showCreateForm && (
        <div className="mb-8 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-2xl">👋</span>
              </div>
              <h2 className="text-3xl font-bold">Welcome!</h2>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              Use the AI assistant to:
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={handleViewTickets}
                disabled={isLoadingTickets}
                className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-2xl">👀</span>
                <div className="text-left">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300">View Tickets</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    {isLoadingTickets ? "Loading..." : "See all your tickets"}
                  </p>
                </div>
              </button>

              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
              >
                <span className="text-2xl">➕</span>
                <div className="text-left">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-300">Create Tickets</h3>
                  <p className="text-sm text-purple-700 dark:text-purple-400">Add new tickets easily</p>
                </div>
              </button>

              <div className="relative flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl opacity-60 cursor-not-allowed">
                <span className="text-2xl">🔍</span>
                <div className="text-left">
                  <h3 className="font-semibold text-green-900 dark:text-green-300">Search</h3>
                  <p className="text-sm text-green-700 dark:text-green-400">Find specific tickets</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs font-semibold rounded">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl border-l-4 border-blue-500">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                💡 <strong>Try saying:</strong> "Show me all tickets" or "Create a new bug ticket"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Inline Create Ticket Form */}
      {showCreateForm && (
        <div className="mb-8 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">🎫</span>
                  <h2 className="text-2xl font-bold">Create New Ticket</h2>
                </div>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreateTicket} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Title Field */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter ticket title"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                  />
                </div>

                {/* Status Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  >
                    <option value="">Select status</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {/* Operation Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Operation Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.operation}
                    onChange={(e) => setFormData({ ...formData, operation: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  >
                    <option value="">Select operation type</option>
                    <option value="bug_fix">🐛 Bug Fix</option>
                    <option value="feature">✨ Feature</option>
                    <option value="task">📋 Task</option>
                    <option value="request_gitlab_access">🔑 Request Access</option>
                    <option value="documentation">📚 Documentation</option>
                    <option value="enhancement">⚡ Enhancement</option>
                  </select>
                </div>

                {/* Requester Field */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Requester <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.requester}
                    onChange={(e) => setFormData({ ...formData, requester: e.target.value })}
                    placeholder="Enter requester name"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating...</span>
                    </span>
                  ) : (
                    "Create Ticket"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tickets Grid */}
      {tickets.length > 0 && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tickets ({tickets.length})
            </h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
              >
                <span className="text-lg">➕</span>
                <span>New Ticket</span>
              </button>
              <button
                onClick={() => setTickets([])}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Home</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden hover:-translate-y-1"
              >
                <div className="p-6">
                  {/* Ticket Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getOperationIcon(ticket.operation)}</span>
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        #{ticket.id}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>

                  {/* Ticket Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 min-h-[3.5rem]">
                    {ticket.title}
                  </h3>

                  {/* Ticket Details */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400 w-24">Operation:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {ticket.operation}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400 w-24">Requester:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {ticket.requester}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Updated recently
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
