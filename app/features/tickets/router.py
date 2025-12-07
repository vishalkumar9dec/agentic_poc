from fastapi import APIRouter

from features.tickets.models import Ticket
from features.tickets.service import create_a_ticket, get_tickets

router = APIRouter(prefix="/tickets", tags=["tickets"])


@router.post("/")
def create_ticket(ticket: Ticket):
    """API endpoint to create a new ticket."""
    return create_a_ticket(ticket)


@router.get("/")
def get_all_tickets():
    """API endpoint to get all tickets."""
    return get_tickets()