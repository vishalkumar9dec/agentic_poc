"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export default function Home() {
  return (
    <CopilotKit
      runtimeUrl="http://localhost:8001"
      agent="ticket-agent"
    >
      <CopilotSidebar
        instructions="You are a helpful ticket management assistant. Help users create and view tickets."
        defaultOpen={true}
        labels={{
          title: "Ticket Assistant",
          initial: "Hi! I can help you manage tickets. Try asking me to show all tickets or create a new one.",
        }}
      >
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
          <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
            <h1 className="text-4xl font-bold mb-8 text-center">
              Ticket Management System
            </h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Use the AI assistant on the right to:
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
            </div>
          </div>
        </main>
      </CopilotSidebar>
    </CopilotKit>
  );
}
