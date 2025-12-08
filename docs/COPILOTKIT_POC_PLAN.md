# CopilotKit POC Integration Plan

## Overview

CopilotKit is an open-source framework that implements the AG-UI (Agent-User Interaction) protocol, connecting your existing PydanticAI agents to a React frontend with minimal code changes.

**POC Goal:** Transform the ticket system into an agentic UI in 3-5 days

---

## Why CopilotKit for This POC?

✅ **Native Python/FastAPI support** - Official SDK
✅ **Works with PydanticAI** - Wrap existing agents easily
✅ **Built-in UI components** - Chat, sidebar, streaming
✅ **Production-ready** - Security, error handling included
✅ **Minimal code changes** - Reuse 90% of existing backend
✅ **Fast iteration** - Hot reload, dev tools, debugging

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│          React Frontend (Next.js)                       │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │   CopilotKit Components                          │  │
│  │   - <CopilotSidebar />                          │  │
│  │   - <CopilotTextarea />                         │  │
│  │   - <CopilotChat />                             │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │ AG-UI Protocol                    │
└─────────────────────┼───────────────────────────────────┘
                      │
                      │ HTTP/SSE
                      │
┌─────────────────────▼───────────────────────────────────┐
│          FastAPI Backend                                │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │   CopilotKit SDK                                 │  │
│  │   sdk = CopilotKitSDK(agents=[...])             │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │                                    │
│  ┌──────────────────▼───────────────────────────────┐  │
│  │   Wrapped PydanticAI Agent                       │  │
│  │   ticket_assistant_agent                         │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │                                    │
│  ┌──────────────────▼───────────────────────────────┐  │
│  │   Existing Service & Database Layer              │  │
│  │   (No changes needed)                            │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## Implementation Steps

### Step 1: Install Dependencies (15 mins)

**Backend:**
```bash
# In your virtual environment
pip install copilotkit
```

**Frontend (new Next.js app):**
```bash
npx create-next-app@latest ticket-ui --typescript --tailwind --app
cd ticket-ui
npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/react-textarea
```

---

### Step 2: Wrap Your Existing Agent (30 mins)

**File:** `app/agents/tickets/copilot_wrapper.py`

```python
from copilotkit import CopilotKitSDK, Action
from copilotkit.types import ActionExecutionContext
from app.agents.tickets.agent import ticket_assistant_agent
from app.agents.tickets.service import TicketService
from typing import Dict, Any

# Initialize service
ticket_service = TicketService()

# Define actions that CopilotKit can call
async def list_tickets_action(context: ActionExecutionContext) -> Dict[str, Any]:
    """List all tickets"""
    tickets = await ticket_service.list_tickets()
    return {
        "tickets": [ticket.model_dump() for ticket in tickets],
        "count": len(tickets)
    }

async def create_ticket_action(
    context: ActionExecutionContext,
    title: str,
    description: str,
    priority: str = "medium"
) -> Dict[str, Any]:
    """Create a new ticket"""
    ticket = await ticket_service.create_ticket(
        title=title,
        description=description,
        priority=priority
    )
    return {
        "success": True,
        "ticket": ticket.model_dump(),
        "message": f"Created ticket #{ticket.id}: {title}"
    }

async def get_ticket_action(
    context: ActionExecutionContext,
    ticket_id: int
) -> Dict[str, Any]:
    """Get ticket details by ID"""
    ticket = await ticket_service.get_ticket(ticket_id)
    if not ticket:
        return {"error": f"Ticket #{ticket_id} not found"}
    return {"ticket": ticket.model_dump()}

# Define CopilotKit SDK with actions
sdk = CopilotKitSDK(
    actions=[
        Action(
            name="list_tickets",
            description="List all tickets in the system",
            handler=list_tickets_action,
        ),
        Action(
            name="create_ticket",
            description="Create a new ticket with title, description, and priority",
            handler=create_ticket_action,
            parameters={
                "title": {
                    "type": "string",
                    "description": "Title of the ticket",
                    "required": True
                },
                "description": {
                    "type": "string",
                    "description": "Detailed description of the issue",
                    "required": True
                },
                "priority": {
                    "type": "string",
                    "description": "Priority level (low, medium, high, critical)",
                    "required": False
                }
            }
        ),
        Action(
            name="get_ticket",
            description="Get details of a specific ticket by ID",
            handler=get_ticket_action,
            parameters={
                "ticket_id": {
                    "type": "integer",
                    "description": "The ID of the ticket to retrieve",
                    "required": True
                }
            }
        )
    ]
)
```

---

### Step 3: Add CopilotKit Endpoint to FastAPI (15 mins)

**File:** `app/main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from copilotkit.integrations.fastapi import add_fastapi_endpoint
from app.agents.tickets.copilot_wrapper import sdk

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add existing routers
from app.agents.tickets.router import router as tickets_router
app.include_router(tickets_router, prefix="/tickets")

# Add CopilotKit endpoint
add_fastapi_endpoint(app, sdk, "/copilotkit")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**That's it for the backend!** Your existing code remains unchanged.

---

### Step 4: Create Frontend Chat Interface (45 mins)

**File:** `ticket-ui/src/app/page.tsx`

```typescript
"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { TicketDashboard } from "@/components/TicketDashboard";

export default function Home() {
  return (
    <CopilotKit runtimeUrl="http://localhost:8000/copilotkit">
      <CopilotSidebar>
        <div className="min-h-screen p-8">
          <h1 className="text-4xl font-bold mb-8">Ticket System</h1>
          <TicketDashboard />
        </div>
      </CopilotSidebar>
    </CopilotKit>
  );
}
```

**File:** `ticket-ui/src/components/TicketDashboard.tsx`

```typescript
"use client";

import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useState, useEffect } from "react";

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
}

export function TicketDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Make tickets readable by the agent
  useCopilotReadable({
    description: "Current list of tickets displayed to the user",
    value: tickets,
  });

  // Define action to refresh tickets
  useCopilotAction({
    name: "displayTickets",
    description: "Display tickets in the UI",
    parameters: [
      {
        name: "tickets",
        type: "object[]",
        description: "Array of ticket objects to display",
      },
    ],
    handler: async ({ tickets }) => {
      setTickets(tickets);
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tickets.length === 0 ? (
        <div className="col-span-full text-center text-gray-500 py-12">
          <p>No tickets yet. Ask the AI to show tickets or create one!</p>
        </div>
      ) : (
        tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{ticket.title}</h3>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  ticket.priority === "high"
                    ? "bg-red-100 text-red-800"
                    : ticket.priority === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {ticket.priority}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{ticket.description}</p>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {ticket.status}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
```

---

### Step 5: Run the POC (5 mins)

**Terminal 1 (Backend):**
```bash
cd /Users/vishalkumar/projects/agentic_ai
source venv/bin/activate
uvicorn app.main:app --reload
```

**Terminal 2 (Frontend):**
```bash
cd ticket-ui
npm run dev
```

**Open:** http://localhost:3000

---

## POC Capabilities

Once running, you can interact with the AI copilot:

### Example Interactions:

**User:** "Show me all tickets"
**Agent:** *Calls `list_tickets` action → Displays tickets in UI*

**User:** "Create a bug ticket: Login page crashes on Safari"
**Agent:** *Calls `create_ticket` action → Shows success message → Refreshes UI*

**User:** "Show details for ticket #5"
**Agent:** *Calls `get_ticket` action → Displays ticket card with details*

---

## What Makes This Scalable?

### 1. **Separation of Concerns**
```
CopilotKit Wrapper → Actions → Service Layer → Database
```
Your existing service layer (`TicketService`) remains unchanged.

### 2. **Easy to Add Features**
Want to add "assign ticket" functionality?
```python
async def assign_ticket_action(context, ticket_id, assignee):
    return await ticket_service.assign_ticket(ticket_id, assignee)

# Add to sdk.actions list
```

### 3. **Generative UI (Phase 2)**
CopilotKit supports streaming React components:
```typescript
useCopilotAction({
  name: "renderTicketGrid",
  render: ({ tickets }) => <TicketGrid tickets={tickets} />
});
```

### 4. **Multiple Agents**
```python
sdk = CopilotKitSDK(
    agents=[
        ticket_assistant_agent,
        analytics_agent,
        assignment_agent
    ]
)
```

---

## Next Steps After POC

1. **Add More Actions** (search, filter, bulk operations)
2. **Implement Generative UI** (dynamic component rendering)
3. **Add Agent Memory** (persist conversation context)
4. **Integrate Analytics Agent** (dashboard generation)
5. **Add Authentication** (user-specific tickets)

---

## Cost & Performance

**Free Tier:**
- CopilotKit is open source (free)
- OpenAI API costs: ~$0.001 per interaction
- For POC: < $5/month

**Expected Performance:**
- Response time: 500ms - 2s (depending on action complexity)
- Concurrent users: 10-50 (sufficient for POC)

---

## Comparison with Previous Plan

| Aspect | Previous Plan (Custom) | CopilotKit Plan |
|--------|----------------------|-----------------|
| Setup Time | 1-2 weeks | 2-3 days |
| Code to Write | ~5000 lines | ~500 lines |
| Streaming Support | Manual implementation | Built-in |
| UI Components | Build from scratch | Pre-built |
| Security | Manual | Built-in |
| Maintenance | High | Low |
| Scalability | Good (more control) | Good (proven framework) |

---

## File Structure

```
agentic_ai/
├── app/
│   ├── agents/
│   │   └── tickets/
│   │       ├── agent.py            # Existing
│   │       ├── service.py          # Existing
│   │       ├── copilot_wrapper.py  # NEW - CopilotKit wrapper
│   │       └── router.py           # Existing
│   └── main.py                      # UPDATED - Add copilotkit endpoint
│
└── ticket-ui/                       # NEW - Frontend
    ├── src/
    │   ├── app/
    │   │   └── page.tsx
    │   └── components/
    │       └── TicketDashboard.tsx
    └── package.json
```

---

## Resources

- [CopilotKit Documentation](https://docs.copilotkit.ai/)
- [CopilotKit GitHub](https://github.com/CopilotKit/CopilotKit)
- [Python SDK Reference](https://docs.copilotkit.ai/reference/sdk/python/RemoteEndpoints)
- [FastAPI Integration Example](https://github.com/CopilotKit/with-langgraph-fastapi)
- [AG-UI Protocol](https://www.copilotkit.ai/ag-ui)

---

**Last Updated:** 2025-12-08
