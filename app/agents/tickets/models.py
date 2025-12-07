from pydantic import BaseModel

class CreateTicketOutput(BaseModel):
    message: str


class GetTicketsOutput(BaseModel):
    tickets: list[dict]