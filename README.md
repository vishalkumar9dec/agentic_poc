# Agentic AI Ticket Management System

An AI-powered ticket management system with conversational interface, built using PydanticAI agents and CopilotKit for Generative UI.

## 🎯 Project Overview

This project demonstrates:
- **PydanticAI Agents** for intelligent ticket management
- **AG-UI Protocol** (Agent-User Interaction) for seamless frontend-backend communication
- **CopilotKit** for building conversational, agentic user interfaces
- **FastAPI** backend with SQLite database
- **Next.js** frontend with real-time chat interface

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (http://localhost:3001)                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Next.js Frontend with CopilotKit                  │    │
│  │  - Chat Interface                                  │    │
│  │  - Ticket Display                                  │    │
│  └────────────────────┬───────────────────────────────┘    │
└────────────────────────┼────────────────────────────────────┘
                         │ HTTP/SSE (AG-UI Protocol)
                         │
┌────────────────────────▼────────────────────────────────────┐
│  AG-UI Server (http://localhost:8001)                       │
│  ┌────────────────────────────────────────────────────┐    │
│  │  PydanticAI Agent (ticket_agent)                   │    │
│  │  - create_ticket tool                              │    │
│  │  - get_all_tickets tool                            │    │
│  └────────────────────┬───────────────────────────────┘    │
└────────────────────────┼────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│  FastAPI Backend (http://localhost:8000)                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │  REST API + Service Layer                          │    │
│  │  - /tickets endpoints                              │    │
│  │  - /agents/tickets endpoints                       │    │
│  └────────────────────┬───────────────────────────────┘    │
└────────────────────────┼────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│  SQLite Database (poc.db)                                   │
│  - Ticket storage                                           │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
agentic_ai/
├── app/                          # Backend application
│   ├── agents/                   # AI Agents
│   │   └── tickets/
│   │       ├── agent.py          # PydanticAI ticket agent
│   │       ├── ag_ui_server.py   # AG-UI server (port 8001)
│   │       ├── models.py         # Agent output models
│   │       └── router.py         # Agent API endpoints
│   ├── features/                 # Feature modules
│   │   └── tickets/
│   │       ├── models.py         # Pydantic models
│   │       ├── router.py         # FastAPI endpoints
│   │       └── service.py        # Business logic
│   ├── database/                 # Database layer
│   │   ├── db_operations.py     # Generic DB operations
│   │   └── schema.py            # SQLAlchemy schemas
│   └── main.py                   # FastAPI app entry point
│
├── ticket-frontend/              # Next.js Frontend
│   └── src/
│       └── app/
│           ├── page.tsx          # Main chat page
│           └── layout.tsx        # App layout
│
├── docs/                         # Documentation
│   ├── GENUI_AGUI_OVERVIEW.md
│   ├── GENUI_USE_CASES.md
│   └── GENUI_IMPLEMENTATION_TASKS.md
│
├── prompts/                      # AI Prompts
│   └── copilotkit-frontend-setup.md
│
├── .env                          # Environment variables
├── venv/                         # Python virtual environment
└── README.md                     # This file
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **OpenAI API Key**

### 1. Clone and Setup Environment

```bash
cd /Users/vishalkumar/projects/agentic_ai
```

### 2. Backend Setup

#### Create `.env` file with your OpenAI API key:

```bash
# .env
OPENAI_API_KEY=sk-your-api-key-here
```

#### Activate virtual environment:

```bash
source venv/bin/activate
```

#### Install dependencies (if needed):

```bash
pip install pydantic-ai[ag-ui] fastapi uvicorn sqlalchemy python-dotenv
```

### 3. Start the Servers

You need to run **3 servers** in separate terminals:

#### Terminal 1: AG-UI Server (Port 8001)

```bash
cd /Users/vishalkumar/projects/agentic_ai/app
source ../venv/bin/activate
PYTHONPATH=/Users/vishalkumar/projects/agentic_ai/app python agents/tickets/ag_ui_server.py
```

**Expected output:**
```
Starting AG-UI server for ticket agent on port 8001...
CopilotKit frontend can connect to: http://localhost:8001
INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
```

#### Terminal 2: FastAPI Backend (Port 8000) - Optional

```bash
cd /Users/vishalkumar/projects/agentic_ai
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

**Note:** This is optional - only needed if you want to use the REST API endpoints directly.

#### Terminal 3: Next.js Frontend (Port 3001)

```bash
cd /Users/vishalkumar/projects/agentic_ai/ticket-frontend
npm run dev
```

**Expected output:**
```
▲ Next.js 16.0.7
- Local:        http://localhost:3001
✓ Ready in XXXms
```

### 4. Access the Application

Open your browser and navigate to:

```
http://localhost:3001
```

You should see:
- **Main page** with "Ticket Management System" header
- **Chat sidebar** on the right labeled "Ticket Assistant"
- **Welcome message** in the chat

## 💬 How to Use

### Chat Commands

The AI assistant understands natural language. Try these commands:

#### List All Tickets
```
show me all tickets
```

#### Create a New Ticket
```
create a new ticket with title "Fix login bug" status "open" operation "bug_fix" requester "John Doe"
```

Or let the agent guide you:
```
create a new bug ticket
```
(The agent will ask for missing information)

#### Get Ticket Details
```
show me details for ticket #1
```

### Ticket Fields

When creating tickets, you need:
- **title**: Brief description of the ticket
- **status**: open, in_progress, closed
- **operation**: bug_fix, feature, task, etc.
- **requester**: Person who created the ticket

## 🔧 Configuration

### Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Next.js Frontend | 3001 | http://localhost:3001 |
| AG-UI Backend | 8001 | http://localhost:8001 |
| FastAPI (optional) | 8000 | http://localhost:8000 |

### Environment Variables

Create a `.env` file in the project root:

```env
# Required
OPENAI_API_KEY=sk-your-api-key-here

# Optional
DATABASE_URL=sqlite:///poc.db
```

## 🛠️ Development

### Project Components

#### 1. PydanticAI Agent (`app/agents/tickets/agent.py`)

The core AI agent with two tools:
- `create_ticket`: Creates new tickets in the database
- `get_all_tickets`: Retrieves all tickets

```python
ticket_agent = Agent[None, CreateTicketOutput | GetTicketsOutput](
    'openai:gpt-4o-mini',
    system_prompt="You are a helpful ticket management agent..."
)
```

#### 2. AG-UI Server (`app/agents/tickets/ag_ui_server.py`)

Exposes the PydanticAI agent via AG-UI protocol:
- Converts agent to Starlette/FastAPI app
- Adds CORS middleware for frontend communication
- Handles streaming responses

#### 3. Frontend Chat Interface (`ticket-frontend/src/app/page.tsx`)

React component using CopilotKit:
- `<CopilotKit>`: Connects to AG-UI server
- `<CopilotSidebar>`: Provides chat interface
- Real-time streaming responses

### Key Technologies

- **PydanticAI**: Type-safe AI agent framework
- **AG-UI Protocol**: Agent-User Interaction standard
- **CopilotKit**: React framework for agentic UIs
- **FastAPI**: Modern Python web framework
- **Next.js**: React framework with SSR
- **SQLite**: Lightweight database

## 📚 Documentation

Detailed documentation available in the `docs/` folder:

- **[GENUI_AGUI_OVERVIEW.md](docs/GENUI_AGUI_OVERVIEW.md)**: Overview of Generative UI and Agentic UI concepts
- **[GENUI_USE_CASES.md](docs/GENUI_USE_CASES.md)**: 12+ use cases for the ticket system
- **[GENUI_IMPLEMENTATION_TASKS.md](docs/GENUI_IMPLEMENTATION_TASKS.md)**: Complete implementation roadmap
- **[COPILOTKIT_POC_PLAN.md](docs/COPILOTKIT_POC_PLAN.md)**: CopilotKit integration guide

## 🐛 Troubleshooting

### Issue: Network Error in Chat

**Solution:** Make sure the AG-UI server (port 8001) is running with CORS enabled.

Check `ag_ui_server.py` has:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    ...
)
```

### Issue: "No module named 'agents'"

**Solution:** Run the AG-UI server with PYTHONPATH set:
```bash
PYTHONPATH=/Users/vishalkumar/projects/agentic_ai/app python agents/tickets/ag_ui_server.py
```

### Issue: "OpenAI API key not set"

**Solution:** Create `.env` file with your OpenAI API key:
```bash
echo "OPENAI_API_KEY=sk-your-key" > .env
```

### Issue: Port already in use

**Solution:** Kill the process using the port:
```bash
# For port 8001
lsof -ti:8001 | xargs kill -9

# For port 3001
lsof -ti:3001 | xargs kill -9
```

## 🧪 Testing

### Test the AG-UI Server

```bash
curl -X POST http://localhost:8001/ \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "show all tickets"}]}'
```

### Test the FastAPI Backend

```bash
# Get all tickets
curl http://localhost:8000/tickets

# Create a ticket
curl -X POST http://localhost:8000/tickets \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","status":"open","operation":"test","requester":"API"}'
```

## 🚦 Development Workflow

### 1. Make Changes to Agent

Edit `app/agents/tickets/agent.py`, then restart AG-UI server:
```bash
# Kill old server (Ctrl+C)
# Start new server
PYTHONPATH=/Users/vishalkumar/projects/agentic_ai/app python agents/tickets/ag_ui_server.py
```

### 2. Make Changes to Frontend

Edit files in `ticket-frontend/src/app/`, Next.js will auto-reload.

### 3. Add New Tools to Agent

```python
@ticket_agent.tool
def update_ticket(ctx: RunContext, ticket_id: int, status: str):
    """Update ticket status"""
    # Implementation
    pass
```

## 📈 Next Steps

Potential enhancements:

1. **Add More Tools**: Update, delete, search tickets
2. **User Authentication**: Add login/auth system
3. **Real-time Updates**: WebSocket for live ticket updates
4. **Advanced UI**: Ticket cards, kanban board, analytics
5. **Multi-agent System**: Separate agents for different tasks
6. **Knowledge Base**: FAQ and solution suggestions

## 🤝 Contributing

This is a POC (Proof of Concept) project for learning and demonstration purposes.

## 📄 License

This project is for educational purposes.

## 🔗 Resources

- [PydanticAI Documentation](https://ai.pydantic.dev/)
- [CopilotKit Documentation](https://docs.copilotkit.ai/)
- [AG-UI Protocol](https://www.copilotkit.ai/ag-ui)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Built with:** PydanticAI • CopilotKit • FastAPI • Next.js • SQLite

**Last Updated:** 2025-12-08
