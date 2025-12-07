from fastapi import APIRouter
from pydantic import BaseModel

from agents.tickets.agent import run_ticket_agent


router = APIRouter(prefix="/tickets_agent", tags=["tickets_agent"])


class NLQuery(BaseModel):
    query: str


@router.post("")
async def ticket_assistant_agent(body: NLQuery):
    """API endpoint for ticket agent to process natural language queries.
    Examples:
    - 'Create a ticket : title=Bug, desc-login fails, status=Pending_approval, requestor=vishal, operation=login_issue'
    - 'Show me all tickets'
    """
    result = await run_ticket_agent(body.query)
    return result