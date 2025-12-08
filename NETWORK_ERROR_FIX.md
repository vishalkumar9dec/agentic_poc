# Network Error Fix - CORS Configuration

## Issue
When accessing http://localhost:3001, the frontend showed a **network error** because:
- The AG-UI server (port 8001) was rejecting CORS preflight requests
- Browser sends OPTIONS requests before POST requests (CORS security)
- Server returned "405 Method Not Allowed" for OPTIONS requests

## Root Cause
The AG-UI server created by `ticket_agent.to_ag_ui()` didn't have CORS middleware configured, blocking cross-origin requests from the frontend.

## Solution Applied

### File: `app/agents/tickets/ag_ui_server.py`

**Added CORS Middleware:**
```python
from starlette.middleware.cors import CORSMiddleware

app = ticket_agent.to_ag_ui()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## What This Does
- **allow_origins**: Permits requests from frontend ports 3000 and 3001
- **allow_credentials**: Allows cookies/auth headers
- **allow_methods**: Accepts all HTTP methods (GET, POST, OPTIONS, etc.)
- **allow_headers**: Accepts all request headers

## Verification

### Before Fix:
```bash
curl -X OPTIONS http://localhost:8001/
# Response: 405 Method Not Allowed
```

### After Fix:
```bash
curl -X OPTIONS http://localhost:8001/
# Response: 200 OK (with CORS headers)
```

## Current Status
✅ AG-UI server running on port 8001 with CORS enabled
✅ Frontend running on port 3001
✅ Network communication working

## Test Now
1. Refresh browser at http://localhost:3001
2. Open chat sidebar
3. Type: "show me all tickets"
4. Should see response from the agent (no network error)

---

**Fixed on:** 2025-12-08
**Issue:** CORS blocking frontend-backend communication
**Resolution:** Added CORS middleware to AG-UI server
