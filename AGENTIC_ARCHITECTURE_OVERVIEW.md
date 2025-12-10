# Jarvis: Agentic AI Platform - Technical Architecture

## Overview

Jarvis is an AI-powered operations platform that implements **Agentic AI** principles through autonomous AI agents and **Generative UI** concepts through dynamic, AI-driven interface control.

---

## What Makes This Agentic?

### Definition: Agentic AI
An agentic system is one where AI agents can:
1. **Autonomously make decisions** based on user intent
2. **Execute actions** using tools without step-by-step instructions
3. **Orchestrate workflows** across multiple operations
4. **Adapt behavior** based on context and state

### Our Implementation
Jarvis implements agency through:
- **Frontend agents** (CopilotKit actions) that control UI and execute operations
- **Natural language understanding** that maps user intent to autonomous actions
- **Tool-based architecture** where agents call functions to accomplish goals
- **Context awareness** where agents access and modify application state

---

## Architecture: Three-Layer Agentic System

```
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 1: GENERATIVE UI (Frontend)                              │
│  Next.js 16 + React 19 + CopilotKit                            │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  User Interface (page.tsx)                             │    │
│  │  ├─ Dashboard View (feature cards)                     │    │
│  │  ├─ Ticket Management View                             │    │
│  │  ├─ FinOps View (planned)                              │    │
│  │  └─ GreenOps View (planned)                            │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  AI Chat Interface (CopilotChat)                       │    │
│  │  • Conversational interaction                          │    │
│  │  • Streaming responses                                 │    │
│  │  • Natural language → Actions                          │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Agentic Actions (useCopilotAction)                    │    │
│  │                                                         │    │
│  │  getAllTickets() - Agent retrieves tickets             │    │
│  │  ├─ Fetches from backend API                           │    │
│  │  ├─ Updates application state                          │    │
│  │  ├─ Autonomously navigates to tickets view             │    │
│  │  └─ Returns structured response                        │    │
│  │                                                         │    │
│  │  createTicket() - Agent creates tickets                │    │
│  │  ├─ Extracts parameters from natural language          │    │
│  │  ├─ Validates and posts to backend                     │    │
│  │  ├─ Refreshes ticket list                              │    │
│  │  ├─ Autonomously navigates to tickets view             │    │
│  │  └─ Confirms success to user                           │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Context Sharing (useCopilotReadable)                  │    │
│  │  • Makes application state available to AI             │    │
│  │  • Agent can read current tickets, view state          │    │
│  │  • Enables context-aware decision making               │    │
│  └────────────────────────────────────────────────────────┘    │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           │ API Route: /api/copilotkit
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│  LAYER 2: COPILOT RUNTIME (Middleware)                          │
│  Next.js API Routes + CopilotKit Runtime                        │
│                                                                  │
│  route.ts:                                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  CopilotRuntime                                        │    │
│  │  ├─ Receives chat messages from frontend              │    │
│  │  ├─ Processes with OpenAI (gpt-4o-mini)               │    │
│  │  ├─ Determines which action to execute                │    │
│  │  ├─ Streams responses back to frontend                │    │
│  │  └─ Manages conversation context                      │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  OpenAI Adapter:                                                 │
│  • Translates CopilotKit actions → OpenAI function calls        │
│  • Model: gpt-4o-mini                                           │
│  • Handles streaming responses                                  │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           │ HTTP REST API
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│  LAYER 3: BACKEND (FastAPI + Database)                          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  FastAPI Application (main.py)                         │    │
│  │  • REST API endpoints                                  │    │
│  │  • Port 8000                                            │    │
│  │  • CORS enabled for frontend                           │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Feature Layer (app/features/tickets/)                │    │
│  │                                                         │    │
│  │  router.py - FastAPI endpoints                         │    │
│  │  ├─ GET /tickets - List all tickets                    │    │
│  │  ├─ GET /tickets/{id} - Get ticket by ID              │    │
│  │  └─ POST /tickets - Create new ticket                 │    │
│  │                                                         │    │
│  │  service.py - Business logic                           │    │
│  │  ├─ Ticket CRUD operations                             │    │
│  │  ├─ Data validation (Pydantic models)                 │    │
│  │  └─ Database interaction                               │    │
│  │                                                         │    │
│  │  models.py - Pydantic models                           │    │
│  │  └─ Ticket (title, status, operation, requester)      │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Database Layer (app/database/)                        │    │
│  │                                                         │    │
│  │  db_operations.py - Generic CRUD class                │    │
│  │  ├─ create(data) - Insert records                      │    │
│  │  ├─ read_all() - Query all records                     │    │
│  │  └─ read_by_id(id) - Query by ID                      │    │
│  │                                                         │    │
│  │  schema.py - SQLAlchemy models                         │    │
│  │  └─ TicketModel - Database table definition           │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  SQLite Database (poc.db)                              │    │
│  │  • Persistent storage                                  │    │
│  │  • Can be upgraded to PostgreSQL                       │    │
│  └────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

---

## How Agentic AI is Implemented

### 1. Autonomous Actions via CopilotKit

**Location:** `ticket-frontend/src/app/page.tsx`

```typescript
// Agent Action: Get All Tickets
useCopilotAction({
  name: "getAllTickets",
  description: "Retrieve all tickets from the database",
  parameters: [],
  handler: async () => {
    // 1. Agent autonomously fetches data
    const response = await fetch("http://localhost:8000/tickets");
    const data = await response.json();

    // 2. Agent updates application state
    setTickets(data);

    // 3. Agent autonomously changes UI view
    setCurrentView("tickets");

    // 4. Agent returns structured response
    return { success: true, tickets: data };
  },
});
```

**Agentic Characteristics:**
- **No manual trigger**: User says "show tickets" → Agent executes
- **Multi-step workflow**: Fetch → Update State → Navigate → Respond
- **Autonomous navigation**: Agent decides to switch views
- **Structured output**: Agent returns typed response

---

### 2. Context-Aware Decision Making

**Location:** `ticket-frontend/src/app/page.tsx`

```typescript
// Make application state readable by AI agent
useCopilotReadable({
  description: "Current list of tickets in the system",
  value: tickets,
});
```

**How it enables agency:**
- Agent can "see" current application state
- Agent makes informed decisions based on context
- Example: Agent knows if tickets already loaded → doesn't refetch
- Example: Agent sees ticket count → provides relevant summary

---

### 3. Natural Language → Action Mapping

**Location:** `ticket-frontend/src/app/page.tsx` (CopilotChat instructions)

```typescript
<CopilotChat
  instructions={`You are Jarvis, an AI assistant for a comprehensive operations platform.

1. **Ticket Management System** (Currently Available):
   - Create and manage support tickets
   - Track ticket status and operations
   - Use actions: getAllTickets() and createTicket() when users ask about tickets
   - When creating tickets, automatically navigate users to the ticket view

Help users navigate between features, create tickets, and understand what Jarvis offers.

IMPORTANT: You can create and retrieve tickets directly through chat without users
having to click buttons. Just ask for the necessary details and use the available actions.`}
/>
```

**How Natural Language Works:**
1. User: "Show me all open tickets"
2. CopilotRuntime (Layer 2) processes with OpenAI
3. OpenAI determines: Need to call `getAllTickets()` action
4. Action executes → Returns tickets
5. Agent filters/presents open tickets to user
6. UI automatically switches to tickets view

---

### 4. Tool-Based Architecture

**Frontend Actions = Tools:**
```typescript
// Tool 1: Data Retrieval
getAllTickets() → Fetches from API

// Tool 2: Data Creation
createTicket({ title, status, operation, requester }) → Creates in DB

// Future Tools (Easy to Add):
updateTicket(id, data) → Updates existing ticket
deleteTicket(id) → Removes ticket
searchTickets(query) → Searches by keywords
```

**Agent Autonomy:**
- Agent chooses which tool to use based on user intent
- Agent can chain multiple tools for complex workflows
- Agent handles errors and asks for clarification

---

## How Generative UI is Implemented

### 1. AI-Driven View Control

**Location:** `ticket-frontend/src/app/page.tsx`

```typescript
const [currentView, setCurrentView] = useState<FeatureView>("dashboard");

// AI agent controls this state through actions
useCopilotAction({
  handler: async () => {
    setCurrentView("tickets"); // AI changes what user sees
  }
});

// UI renders based on AI decision
const renderContent = () => {
  switch (currentView) {
    case "tickets":
      return <TicketManagement />;
    case "finops":
      return <FinOps />;
    case "greenops":
      return <GreenOps />;
    default:
      return <Dashboard />;
  }
};
```

**Generative Aspect:**
- UI state controlled by AI agent, not just user clicks
- Same natural language input → Different UI based on context
- Example: "Show tickets" → Switches to ticket view dynamically

---

### 2. Conversational Interface Replaces Traditional UI

**Traditional Approach:**
1. User clicks "New Ticket" button
2. User fills form with 4 fields
3. User clicks "Submit"
4. User manually navigates to view tickets

**Generative UI Approach:**
1. User: "Create a bug ticket for login timeout"
2. Agent: Extracts params, asks for missing info
3. Agent: Creates ticket, refreshes list, switches view
4. User: Sees result immediately

**Implementation:**
```typescript
useCopilotAction({
  name: "createTicket",
  parameters: [
    { name: "title", type: "string", required: true },
    { name: "status", type: "string", required: true },
    { name: "operation", type: "string", required: true },
    { name: "requester", type: "string", required: true },
  ],
  handler: async ({ title, status, operation, requester }) => {
    // Agent autonomously orchestrates entire workflow
    await fetch("/tickets", { method: "POST", body: JSON.stringify(...) });
    const updatedTickets = await fetch("/tickets").then(r => r.json());
    setTickets(updatedTickets);
    setCurrentView("tickets");
    return { success: true };
  },
});
```

---

### 3. Dynamic State Synchronization

**Frontend State ↔ Backend State ↔ AI Context**

```typescript
// State 1: React State
const [tickets, setTickets] = useState<Ticket[]>([]);
const [currentView, setCurrentView] = useState("dashboard");

// State 2: AI Context (useCopilotReadable makes it visible to agent)
useCopilotReadable({
  description: "Current list of tickets in the system",
  value: tickets,
});

// State 3: Backend Database
// When agent creates ticket → POST to FastAPI → SQLite

// Sync Flow:
// User chat → Agent action → Backend update → State update → UI re-render
```

**Generative Flow:**
1. User types natural language
2. Agent processes → Executes action
3. Backend state changes (DB updated)
4. Frontend state syncs (React state updated)
5. UI regenerates based on new state
6. Agent continues conversation with updated context

---

## FastAPI Backend Architecture

### Feature-Based Structure

```
app/
├── main.py                     # FastAPI entry point
├── features/                   # Feature modules
│   └── tickets/
│       ├── router.py          # FastAPI endpoints
│       ├── service.py         # Business logic
│       └── models.py          # Pydantic models
├── database/                   # Database layer
│   ├── db_operations.py       # Generic CRUD operations
│   └── schema.py              # SQLAlchemy models
└── constants.py               # Shared config
```

### How Backend Supports Agentic AI

**1. RESTful API Design**
```python
# router.py
@router.get("/tickets")
async def get_all_tickets():
    return ticket_db.read_all()

@router.post("/tickets")
async def create_ticket(ticket: Ticket):
    return ticket_db.create(ticket.model_dump())
```

**Why this matters for agents:**
- Simple, predictable endpoints
- Agents can reliably fetch/create data
- Consistent response format

**2. Type Safety with Pydantic**
```python
# models.py
class Ticket(BaseModel):
    title: str
    status: str
    operation: str
    requester: str
```

**Why this matters for agents:**
- Frontend agent knows exact structure
- Validation happens automatically
- Prevents agent from sending invalid data

**3. Generic Database Operations**
```python
# db_operations.py
class DbOperations:
    def create(self, data: dict):
        """Generic create operation"""
        # Works for any model

    def read_all(self):
        """Generic read all"""
        # Reusable across features
```

**Why this matters for agents:**
- New agents can reuse DB operations
- Easy to add new features (FinOps, GreenOps)
- Consistent data access pattern

---

## CopilotKit Runtime: The Bridge

### Location: `ticket-frontend/src/app/api/copilotkit/route.ts`

```typescript
const runtime = new CopilotRuntime();

const serviceAdapter = new OpenAIAdapter({
  openai,
  model: "gpt-4o-mini",
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });
  return handleRequest(req);
};
```

### What This Does

**1. Receives Chat Messages**
```
User: "Create a ticket for bug fix"
↓
Frontend sends to: POST /api/copilotkit
↓
Runtime receives message
```

**2. Processes with OpenAI**
```
Runtime → OpenAI Adapter → gpt-4o-mini
↓
Model analyzes: User wants to create ticket
Model decides: Need to call createTicket() action
Model extracts: operation="bug_fix"
```

**3. Executes Frontend Action**
```
Runtime tells frontend: "Execute createTicket action"
↓
Frontend handler runs
↓
Fetches to FastAPI backend
↓
Returns result
```

**4. Streams Response**
```
OpenAI generates response: "I've created ticket #42..."
↓
Runtime streams back to frontend
↓
User sees response in real-time
```

---

## Data Flow: Complete Request Lifecycle

### Example: User says "Show me all tickets"

```
1. USER INPUT
   ├─ User types: "Show me all tickets"
   └─ CopilotChat component captures input

2. FRONTEND → MIDDLEWARE
   ├─ POST /api/copilotkit
   ├─ Payload: { messages: [{ role: "user", content: "Show me all tickets" }] }
   └─ CopilotRuntime receives

3. MIDDLEWARE PROCESSING
   ├─ OpenAI Adapter sends to gpt-4o-mini
   ├─ Model analyzes intent
   ├─ Model decides: Call getAllTickets() action
   └─ Runtime tells frontend to execute action

4. ACTION EXECUTION
   ├─ getAllTickets handler runs
   ├─ Fetches: GET http://localhost:8000/tickets
   └─ Waits for backend response

5. BACKEND PROCESSING
   ├─ FastAPI route: GET /tickets
   ├─ Service layer: ticket_db.read_all()
   ├─ Database query: SELECT * FROM tickets
   └─ Returns: [{ id: 1, title: "...", ... }, ...]

6. STATE UPDATE
   ├─ setTickets(data) - Updates React state
   ├─ setCurrentView("tickets") - Switches view
   └─ Action returns: { success: true, tickets: [...] }

7. UI RENDERING
   ├─ renderContent() called
   ├─ currentView === "tickets"
   ├─ <TicketManagement /> renders
   └─ Tickets displayed in grid

8. AI RESPONSE
   ├─ Runtime sends result back to OpenAI
   ├─ Model generates natural language response
   ├─ "I found 15 tickets. Here they are..."
   └─ Streamed back to CopilotChat

9. USER SEES
   ├─ Chat shows AI message
   └─ UI shows tickets in grid view
```

---

## Key Technologies & Their Roles

| Technology | Role | Enables Agency/Gen UI By |
|------------|------|--------------------------|
| **CopilotKit** | Agentic UI framework | Connects natural language → Actions |
| **OpenAI GPT-4o-mini** | Language model | Understands intent, generates responses |
| **useCopilotAction** | Action definition | Gives AI tools to execute |
| **useCopilotReadable** | Context sharing | Makes app state visible to AI |
| **Next.js API Routes** | Middleware layer | Bridges frontend ↔ OpenAI |
| **FastAPI** | Backend API | Provides data endpoints for agents |
| **Pydantic** | Type validation | Ensures agent data consistency |
| **React State** | UI state management | Enables dynamic UI updates |

---

## Summary: Why This is Agentic & Generative

### Agentic Characteristics

1. **Autonomous Decision Making**
   - Agent decides which action to call based on natural language
   - Agent determines when to navigate UI
   - Agent orchestrates multi-step workflows

2. **Tool Use**
   - `useCopilotAction` defines tools (getAllTickets, createTicket)
   - Agent autonomously selects and executes tools
   - Agent chains tools for complex operations

3. **Context Awareness**
   - `useCopilotReadable` exposes app state to agent
   - Agent makes decisions based on current context
   - Agent maintains conversation history

4. **Goal-Oriented Behavior**
   - User states goal: "Create a ticket"
   - Agent figures out steps: Ask for details → Validate → Create → Navigate → Confirm
   - Agent doesn't need explicit instructions for each step

---

### Generative UI Characteristics

1. **Dynamic View Control**
   - AI controls `currentView` state
   - UI changes based on agent actions, not just clicks
   - Same input → Different UI based on context

2. **Conversational Interface**
   - Natural language replaces forms and buttons
   - Agent interprets intent → Executes UI operations
   - Streaming responses for real-time feedback

3. **State-Driven Rendering**
   - Agent modifies state → UI regenerates
   - React components render based on AI decisions
   - Seamless sync between AI context and UI state

4. **Adaptive Behavior**
   - Agent adapts responses to current state
   - Example: If tickets already loaded, agent doesn't refetch
   - Example: Agent navigates to different views based on action

---

## The Core Innovation

**Traditional UI:** User → Click Button → Form Appears → Fill Form → Submit → See Result

**Agentic UI:** User → Natural Language → Agent → Multi-step Autonomous Actions → Result

**Generative UI:** UI dynamically adapts to agent decisions in real-time

**Jarvis combines both:** Conversational agent that autonomously controls a dynamic, generative interface.

---

**Document Version:** 1.0
**Last Updated:** December 2025
**Architecture Status:** Implemented & Functional
