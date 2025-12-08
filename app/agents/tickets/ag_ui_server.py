"""AG-UI server for the ticket assistant agent.

Run this with PYTHONPATH set:
    cd app && PYTHONPATH=/Users/vishalkumar/projects/agentic_ai/app python agents/tickets/ag_ui_server.py
"""

from dotenv import load_dotenv
import uvicorn

# Load environment variables (including OPENAI_API_KEY)
load_dotenv()

from agents.tickets.agent import ticket_agent

if __name__ == "__main__":
    # Convert the PydanticAI agent to a Starlette/FastAPI app
    app = ticket_agent.to_ag_ui()

    print("Starting AG-UI server for ticket agent on port 8001...")
    print("CopilotKit frontend can connect to: http://localhost:8001")

    # Run the server
    uvicorn.run(app, host="0.0.0.0", port=8001)
