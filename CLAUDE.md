# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an agentic AI project that includes:
1. **Pydantic AI agents** for AI-powered applications (hello.py, dice_game.py)
2. **FastAPI application** with a tickets management system (app/)

## Environment Setup

### Python Virtual Environment
```bash
# Activate virtual environment
source venv/bin/activate

# Deactivate when done
deactivate
```

### Environment Variables
The project uses environment variables stored in `.env`:
- `OPENAI_AI_KEY`: OpenAI API key for Pydantic AI agents
- Note: `.env` file contains actual API keys and should not be committed to version control

## Running the Applications

### Pydantic AI Examples
```bash
# Simple AI agent example
python hello.py

# Dice game with tools and context
python dice_game.py
```

### FastAPI Application
```bash
# Run the FastAPI server (from project root)
cd app
uvicorn main:app --reload

# Or from project root
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
- API documentation: `http://localhost:8000/docs`
- Tickets endpoint: `http://localhost:8000/tickets`

## Architecture

### FastAPI Application Structure

The FastAPI app follows a feature-based architecture:

```
app/
├── main.py              # FastAPI application entry point
├── database/            # Database layer
│   ├── db_operations.py # Generic database operations class
│   └── schema.py        # SQLAlchemy table schemas (TicketSchema)
└── features/            # Feature modules
    ├── constants.py     # Shared constants (DATABASE_URL)
    └── tickets/         # Tickets feature
        ├── models.py    # Pydantic models (Ticket)
        ├── router.py    # FastAPI router/endpoints
        └── service.py   # Business logic layer
```

### Key Architectural Patterns

1. **Layer Separation**:
   - Router layer (router.py) → handles HTTP requests/responses
   - Service layer (service.py) → contains business logic
   - Database layer (db_operations.py) → handles database operations
   - Models layer (models.py) → Pydantic models for validation
   - Schema layer (schema.py) → SQLAlchemy models for database tables

2. **DbOperations Class**:
   - Generic class in `database/db_operations.py`
   - Initialized with a SQLAlchemy model and database URL
   - Provides CRUD operations: `create()`, `read_all()`, `read_by_id()`
   - Uses SQLite database (defined by DATABASE_URL constant)
   - Session management via property with lazy initialization

3. **Naming Convention**:
   - Pydantic models use simple names (e.g., `Ticket` in models.py)
   - SQLAlchemy models use `*Model` suffix (e.g., `TicketModel` in schema.py)
   - Note: There's an inconsistency in service.py where it imports `TicketSchema` but schema.py defines `TicketModel`

4. **Feature Organization**:
   - Each feature is self-contained in its own directory under `features/`
   - Features export their router which is included in main.py
   - Database instances are created at the feature level (e.g., `ticket_db` in tickets/service.py)

### Pydantic AI Integration

The project uses [Pydantic AI](https://ai.pydantic.dev/) for AI agent creation:

- **Agent Creation**: Uses `Agent` class with model specification (e.g., 'openai:gpt-5-mini')
- **Tools**: Agents can have tools decorated with `@agent.tool_plain` or `@agent.tool`
- **Context/Dependencies**: Pass runtime context via `deps_type` parameter and `RunContext`
- **Execution**: Use `agent.run_sync()` for synchronous execution

## Known Issues

1. **Bug in db_operations.py**: The `__init__` method is misspelled as `__init` (missing one underscore) - this prevents the class from being properly initialized
2. **Database location**: The SQLite database file (`poc.db`) will be created in the current working directory when running the app
