from pydantic import BaseModel

class Ticket(BaseModel):
    title: str
    status: str
    operation: str
    requester: str