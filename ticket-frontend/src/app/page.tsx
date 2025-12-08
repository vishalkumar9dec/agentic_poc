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
    <div className="flex h-screen">
      <main className="flex-1 flex flex-col items-center justify-center p-24">
        <div className="z-10 w-full max-w-5xl">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Ticket Management System
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Use the AI assistant to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>View all tickets</li>
              <li>Create new tickets</li>
              <li>Search for specific tickets</li>
            </ul>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>Try saying:</strong> "Show me all tickets" or "Create a new bug ticket"
              </p>
            </div>

            {tickets.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Current Tickets:</h3>
                <div className="space-y-2">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="border p-3 rounded-md">
                      <div className="font-semibold">{ticket.title}</div>
                      <div className="text-sm text-gray-600">
                        Status: {ticket.status} | Operation: {ticket.operation} |
                        Requester: {ticket.requester}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="w-96">
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
