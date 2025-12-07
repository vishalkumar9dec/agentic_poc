from sqlalchemy import Column, Integer, String

from database.db_operations import Base


class TicketSchema(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    status = Column(String, index=True)
    operation = Column(String, index=True)
    requester = Column(String, index=True)