# Launch Guide - Ticket Management System

Quick reference for starting and stopping the application.

## 🚀 Quick Start (Easiest Way)

### One-Command Launch (macOS)

```bash
./start_all.sh
```

This will:
- ✅ Check all prerequisites
- ✅ Open 2 new Terminal windows
- ✅ Start AG-UI backend (port 8001)
- ✅ Start Next.js frontend (port 3001)
- ✅ Open automatically in new tabs

Then open your browser to: **http://localhost:3001**

---

## 📋 Manual Launch (Step by Step)

If you prefer to start services manually:

### Terminal 1: Backend

```bash
./start_backend.sh
```

**What it does:**
- Activates Python virtual environment
- Sets PYTHONPATH correctly
- Starts AG-UI server on port 8001
- Serves PydanticAI ticket agent

**Expected output:**
```
==========================================
  Starting AG-UI Backend Server
==========================================

✓ Activating virtual environment...
✓ Environment configured

🚀 Starting AG-UI server on port 8001...
   Press Ctrl+C to stop

Starting AG-UI server for ticket agent on port 8001...
CopilotKit frontend can connect to: http://localhost:8001
INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
```

### Terminal 2: Frontend

```bash
./start_frontend.sh
```

**What it does:**
- Checks if node_modules exist (installs if needed)
- Starts Next.js dev server
- Runs on port 3001 (or 3000 if available)

**Expected output:**
```
==========================================
  Starting Next.js Frontend
==========================================

✓ Dependencies ready

🚀 Starting Next.js dev server...
   Frontend will be available at: http://localhost:3001
   Press Ctrl+C to stop

▲ Next.js 16.0.7
- Local:        http://localhost:3001
✓ Ready in XXXms
```

---

## 🛑 Stopping the Application

### If using `start_all.sh`:
1. Switch to each Terminal window
2. Press `Ctrl + C`

### If using manual scripts:
1. Press `Ctrl + C` in backend terminal
2. Press `Ctrl + C` in frontend terminal

---

## 🔍 Verify Services are Running

### Check Backend (AG-UI Server)

```bash
curl http://localhost:8001
```

**Expected:** `Method Not Allowed` (this is normal - it only accepts POST requests)

### Check Frontend

Open browser to: http://localhost:3001

**Expected:** Ticket Management System page with chat sidebar

---

## 📊 Service Status

| Service | Port | Check URL | Status Command |
|---------|------|-----------|----------------|
| AG-UI Backend | 8001 | http://localhost:8001 | `lsof -ti:8001` |
| Next.js Frontend | 3001 | http://localhost:3001 | `lsof -ti:3001` |

---

## ⚠️ Troubleshooting

### Script Permission Denied

```bash
chmod +x start_all.sh start_backend.sh start_frontend.sh
```

### Port Already in Use

**Backend (8001):**
```bash
lsof -ti:8001 | xargs kill -9
```

**Frontend (3001):**
```bash
lsof -ti:3001 | xargs kill -9
```

### Virtual Environment Not Found

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt  # if you have one
```

### .env File Missing

```bash
echo "OPENAI_API_KEY=sk-your-key-here" > .env
```

### Backend Starts But Crashes

**Check:**
1. Is `.env` file present?
2. Is `OPENAI_API_KEY` set in `.env`?
3. Is virtual environment activated?

**View logs:**
```bash
./start_backend.sh
# Look for error messages
```

### Frontend Shows Network Error

**Fix:**
1. Make sure backend is running (`./start_backend.sh`)
2. Check backend has CORS enabled (it should by default)
3. Refresh browser page

---

## 🔧 Advanced: Custom Ports

### Change Backend Port

Edit `app/agents/tickets/ag_ui_server.py`:
```python
uvicorn.run(app, host="0.0.0.0", port=8001)  # Change 8001 to your port
```

Also update frontend `src/app/page.tsx`:
```typescript
runtimeUrl="http://localhost:8001"  // Change to match backend port
```

### Change Frontend Port

Set environment variable:
```bash
PORT=3002 npm run dev
```

Or edit `ticket-frontend/package.json`:
```json
"scripts": {
  "dev": "next dev -p 3002"
}
```

---

## 📝 Script Details

### start_backend.sh
- **Purpose:** Start AG-UI backend server
- **Checks:** Virtual env, .env file, API key
- **Sets:** PYTHONPATH, activates venv
- **Starts:** Python server on port 8001

### start_frontend.sh
- **Purpose:** Start Next.js frontend
- **Checks:** Node modules, frontend directory
- **Installs:** Dependencies if missing
- **Starts:** Dev server on port 3001

### start_all.sh
- **Purpose:** Launch everything at once
- **Checks:** All prerequisites
- **Opens:** New Terminal windows (macOS)
- **Starts:** Both backend and frontend
- **Platform:** macOS (uses AppleScript)

---

## 🎯 What Happens After Launch

1. **Backend starts** on http://localhost:8001
   - Loads PydanticAI agent
   - Initializes database connection
   - Waits for frontend connections

2. **Frontend starts** on http://localhost:3001
   - Compiles React components
   - Connects to backend via AG-UI protocol
   - Renders chat interface

3. **You can use the app**
   - Open http://localhost:3001 in browser
   - Chat sidebar appears on right
   - Type: "show me all tickets"
   - Agent responds with ticket list

---

## 🔄 Development Workflow

### Making Changes

**Backend changes:**
```bash
# 1. Edit files in app/agents/tickets/
# 2. Stop backend (Ctrl+C)
# 3. Restart backend
./start_backend.sh
```

**Frontend changes:**
```bash
# Next.js auto-reloads, just save the file!
# No restart needed
```

---

## 📦 First Time Setup

If this is your first time running the project:

```bash
# 1. Create virtual environment
python -m venv venv

# 2. Activate it
source venv/bin/activate

# 3. Install Python dependencies
pip install pydantic-ai[ag-ui] fastapi uvicorn sqlalchemy python-dotenv

# 4. Create .env file
echo "OPENAI_API_KEY=sk-your-key" > .env

# 5. Install frontend dependencies
cd ticket-frontend
npm install
cd ..

# 6. Make scripts executable
chmod +x *.sh

# 7. Launch!
./start_all.sh
```

---

## ✅ Success Checklist

Before using the app, verify:

- [ ] Backend running on port 8001
- [ ] Frontend running on port 3001
- [ ] No error messages in terminals
- [ ] Browser opens to http://localhost:3001
- [ ] Chat sidebar visible on right side
- [ ] Can send test message
- [ ] Agent responds (no network error)

---

**Quick Commands:**

```bash
# Start everything
./start_all.sh

# Start backend only
./start_backend.sh

# Start frontend only
./start_frontend.sh

# Kill port 8001
lsof -ti:8001 | xargs kill -9

# Kill port 3001
lsof -ti:3001 | xargs kill -9

# View running processes
lsof -ti:8001 -ti:3001
```

---

**Last Updated:** 2025-12-08
