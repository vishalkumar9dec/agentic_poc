from database.schema import TicketSchema
from database.db_operations import DbOperations
from features.constants import DATABASE_URL
from features.tickets.models import Ticket

ticket_db = DbOperations(TicketSchema, DATABASE_URL)


def create_a_ticket(ticket_data: Ticket) -> str:
    """Create a new ticket in the database."""
    ticket_model = Ticket.model_validate(ticket_data)
    return ticket_db.create(**ticket_model.model_dump())


def get_tickets():
    return ticket_db.read_all()