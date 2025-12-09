"use client";

import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
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

export default function Home() {
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
        description: "The status of the ticket (e.g., open, in_progress, closed)",
        required: true,
      },
      {
        name: "operation",
        type: "string",
        description: "The type of operation (e.g., bug_fix, feature, task)",
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
        return { success: true, ticket: data };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    },
  });

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ticket Management System
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your tickets with AI assistance
            </p>
          </div>

          {/* Welcome Section - Collapses when tickets are shown */}
          {tickets.length === 0 && (
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
                  <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <span className="text-2xl">👀</span>
                    <div>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-300">View Tickets</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-400">See all your tickets</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <span className="text-2xl">➕</span>
                    <div>
                      <h3 className="font-semibold text-purple-900 dark:text-purple-300">Create Tickets</h3>
                      <p className="text-sm text-purple-700 dark:text-purple-400">Add new tickets easily</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <span className="text-2xl">🔍</span>
                    <div>
                      <h3 className="font-semibold text-green-900 dark:text-green-300">Search</h3>
                      <p className="text-sm text-green-700 dark:text-green-400">Find specific tickets</p>
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

          {/* Tickets Grid */}
          {tickets.length > 0 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Tickets ({tickets.length})
                </h2>
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
      </main>

      {/* AI Chat Sidebar */}
      <div className="w-96 border-l border-gray-200 dark:border-gray-700 shadow-2xl">
        <CopilotChat
          className="h-screen"
          instructions="You are a helpful ticket management assistant. Help users create and view tickets using the available actions: getAllTickets and createTicket."
          labels={{
            title: "Ticket Assistant",
            initial: "Hi! I can help you manage tickets. Try asking me to show all tickets or create a new one.",
          }}
        />
      </div>
    </div>
  );
}
