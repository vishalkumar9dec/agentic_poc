# AG-UI Server - Quick Start Guide

## What is Running?

Your PydanticAI `ticket_agent` is now exposed as an AG-UI server that CopilotKit can connect to!

## How to Launch the AG-UI Server

### Option 1: From Project Root (Recommended)

```bash
# Navigate to project root
cd /Users/vishalkumar/projects/agentic_ai

# Activate virtual environment
source venv/bin/activate

# Set PYTHONPATH and run the server
cd app && PYTHONPATH=/Users/vishalkumar/projects/agentic_ai/app python agents/tickets/ag_ui_server.py
```

### Option 2: Single Command (from project root)

```bash
cd /Users/vishalkumar/projects/agentic_ai && source venv/bin/activate && cd app && PYTHONPATH=/Users/vishalkumar/projects/agentic_ai/app python agents/tickets/ag_ui_server.py
```

### Option 3: Create a Launch Script

Create a file `start_agui.sh` in the project root:

```bash
#!/bin/bash
cd /Users/vishalkumar/projects/agentic_ai
source venv/bin/activate
cd app
PYTHONPATH=/Users/vishalkumar/projects/agentic_ai/app python agents/tickets/ag_ui_server.py
```

Make it executable and run:
```bash
chmod +x start_agui.sh
./start_agui.sh
```

## What You'll See

When the server starts successfully, you'll see:

```
Starting AG-UI server for ticket agent on port 8001...
CopilotKit frontend can connect to: http://localhost:8001
INFO:     Started server process [XXXX]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
```

## Server Details

- **URL**: http://localhost:8001
- **Protocol**: AG-UI (Agent-User Interaction)
- **Agent**: `ticket_agent` with tools:
  - `create_ticket` - Create new tickets
  - `get_all_tickets` - List all tickets

## Requirements

1. ✅ Virtual environment activated
2. ✅ `OPENAI_API_KEY` set in `.env` file
3. ✅ `pydantic-ai[ag-ui]` installed
4. ✅ PYTHONPATH set correctly

## Troubleshooting

### Error: "No module named 'agents'"
- Make sure you're running from the `app/` directory
- Ensure PYTHONPATH is set: `PYTHONPATH=/Users/vishalkumar/projects/agentic_ai/app`

### Error: "The api_key client option must be set"
- Check that your `.env` file exists in the project root
- Verify `OPENAI_API_KEY` is set in `.env`
- The key should start with `sk-`

### Error: "Address already in use"
- Port 8001 is already in use
- Kill the existing process: `lsof -ti:8001 | xargs kill -9`
- Or change the port in `ag_ui_server.py`

## Stop the Server

Press `CTRL + C` in the terminal where the server is running.

## Next Steps

Once the AG-UI server is running, you can:
1. Connect a CopilotKit frontend to `http://localhost:8001`
2. Build a chat interface that talks to your ticket agent
3. Test ticket creation and listing through natural language

---

**Current Status**: ✅ Backend AG-UI server is ready!
**Next**: Create a frontend to interact with the agent
