from fastapi import FastAPI
from dotenv import load_dotenv

load_dotenv()

from features.tickets.router import router as tickets_router
from agents.tickets.router import router as tickets_agent_router


app = FastAPI()

app.include_router(tickets_router)
app.include_router(tickets_agent_router)