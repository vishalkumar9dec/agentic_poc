from pydantic_ai import Agent, RunContext

from features.tickets.service import create_a_ticket, get_tickets
from features.tickets.models import Ticket
from agents.tickets.models import CreateTicketOutput, GetTicketsOutput


ticket_agent = Agent[None, CreateTicketOutput | GetTicketsOutput](
    'openai:gpt-5-mini',
    system_prompt=(
        "You are a helpful ticket management agent. You can create tickets and retrieve "
        "from the system by using create_ticket and get_tickets tools."
        "If the user wants to create a ticket ask for title, status, operation, requester."
    )    
)

@ticket_agent.tool
def create_ticket(ctx: RunContext, title: str, status: str, operation: str, requester: str) -> CreateTicketOutput:
    """Create a new ticket in the system."""
    ticket = Ticket(
        title=title,
        status=status,
        operation=operation,
        requester=requester
    )
    create_a_ticket(ticket)
    return CreateTicketOutput(message="Ticket created successfully.")

@ticket_agent.tool
def get_all_tickets(ctx: RunContext) -> GetTicketsOutput:
    """Retrieve all tickets from the system."""
    tickets = get_tickets()
    tickets_list = [
        {
            "id": ticket.id,
            "title": ticket.title,
            "status": ticket.status,
            "operation": ticket.operation,
            "requester": ticket.requester
        }
        for ticket in tickets
    ]
    return GetTicketsOutput(tickets=tickets_list)


async def run_ticket_agent(user_input: str) -> CreateTicketOutput | GetTicketsOutput:
    """Run the ticket agent with the given user input."""
    result = await ticket_agent.run_async(user_input)
    return result.output