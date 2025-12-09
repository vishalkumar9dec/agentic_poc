"use client";

import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useState } from "react";
import TicketManagement from "@/features/tickets/TicketManagement";
import FinOps from "@/features/finops/FinOps";
import GreenOps from "@/features/greenops/GreenOps";

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

  // Action to create a ticket
  useCopilotAction({
    name: "createTicket",
    description: "Create a new ticket in the system",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "The title of the ticket",
        required: true,
      },
      {
        name: "status",
        type: "string",
        description: "The status of the ticket (e.g., Pending Approval, Open, In Progress, Completed, Closed)",
        required: true,
      },
      {
        name: "operation",
        type: "string",
        description: "The type of operation (e.g., bug_fix, feature, task, request_gitlab_access, documentation, enhancement)",
        required: true,
      },
      {
        name: "requester",
        type: "string",
        description: "The name of the person who requested the ticket",
        required: true,
      },
    ],
    handler: async ({ title, status, operation, requester }) => {
      try {
        const response = await fetch("http://localhost:8000/tickets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, status, operation, requester }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Refresh tickets list
        const ticketsResponse = await fetch("http://localhost:8000/tickets");
        if (!ticketsResponse.ok) {
          throw new Error(`HTTP error! status: ${ticketsResponse.status}`);
        }
        const updatedTickets = await ticketsResponse.json();
        setTickets(updatedTickets);
        // Navigate to tickets view
        setCurrentView("tickets");
        return { success: true, ticket: data };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    },
  });

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
            {/* Header */}
            <div className="mb-12 text-center">
              <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Jarvis
              </h1>
              <p className="text-2xl text-gray-600 dark:text-gray-400 font-medium">
                Everything at one place
              </p>
              <p className="text-gray-500 dark:text-gray-500 mt-2">
                AI-powered operations platform for modern teams
              </p>
            </div>

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
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>

      {/* AI Chat Sidebar */}
      <div className="w-96 border-l border-gray-200 dark:border-gray-700 shadow-2xl flex flex-col">
        {/* Voice Button */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
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

        {/* Copilot Chat */}
        <div className="flex-1">
          <CopilotChat
            className="h-full"
            instructions={`You are Jarvis, an AI assistant for a comprehensive operations platform.

Jarvis has three main features:

1. **Ticket Management System** (Currently Available):
   - Create and manage support tickets
   - Track ticket status and operations
   - View all tickets with AI assistance
   - Use actions: getAllTickets() and createTicket() when users ask about tickets
   - When creating tickets, automatically navigate users to the ticket view after creation

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

IMPORTANT: You can create and retrieve tickets directly through chat without users having to click buttons. Just ask for the necessary details and use the available actions.`}
            labels={{
              title: "Jarvis Assistant",
              initial: "Hi! I'm Jarvis, your AI operations assistant. I can help you with:\n\n• Create & view tickets (just ask me!)\n• Learn about FinOps & GreenOps (coming soon)\n• Navigate between features\n\nWhat would you like to do?",
            }}
          />
        </div>
      </div>
    </div>
  );
}
