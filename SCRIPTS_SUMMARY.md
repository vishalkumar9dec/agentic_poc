# Launch Scripts Summary

## 📁 Created Files

Three launch scripts have been created in the project root:

```
/Users/vishalkumar/projects/agentic_ai/
├── start_all.sh        # Launch everything (macOS)
├── start_backend.sh    # Launch AG-UI backend only
├── start_frontend.sh   # Launch Next.js frontend only
└── LAUNCH_GUIDE.md     # Complete usage guide
```

All scripts are **executable** and ready to use.

---

## 🚀 Quick Reference

### Start Everything (Easiest)

```bash
./start_all.sh
```

**What happens:**
- Opens 2 new Terminal windows (macOS)
- Terminal 1: Starts AG-UI backend on port 8001
- Terminal 2: Starts Next.js frontend on port 3001
- Auto-checks prerequisites
- Auto-opens browser (optional)

### Start Backend Only

```bash
./start_backend.sh
```

**Features:**
- ✅ Checks virtual environment exists
- ✅ Checks .env file exists
- ✅ Verifies OPENAI_API_KEY is set
- ✅ Activates venv automatically
- ✅ Sets PYTHONPATH correctly
- ✅ Starts server on port 8001

### Start Frontend Only

```bash
./start_frontend.sh
```

**Features:**
- ✅ Checks frontend directory exists
- ✅ Auto-installs dependencies if missing
- ✅ Starts Next.js dev server
- ✅ Uses port 3001 (or 3000 if available)

---

## 📋 Script Details

### start_all.sh

**Platform:** macOS (uses AppleScript)
**Linux:** Uses gnome-terminal or xterm
**Windows:** Shows manual instructions

**Checks:**
1. Virtual environment exists
2. `.env` file exists
3. Frontend directory exists
4. All prerequisites met

**Actions:**
1. Opens new Terminal for backend
2. Opens new Terminal for frontend
3. Displays status message
4. Shows URLs to access

**Usage:**
```bash
./start_all.sh
```

---

### start_backend.sh

**Platform:** Any Unix-like OS (macOS, Linux)

**Pre-flight Checks:**
```bash
✓ Virtual environment exists
✓ .env file exists
✓ OPENAI_API_KEY is set in .env
```

**Process:**
```bash
1. Navigate to project root
2. Activate virtual environment
3. Load .env file
4. Set PYTHONPATH
5. cd to app/
6. Start AG-UI server
```

**Output:**
```
==========================================
  Starting AG-UI Backend Server
==========================================

✓ Activating virtual environment...
✓ Environment configured

🚀 Starting AG-UI server on port 8001...
   Press Ctrl+C to stop

Starting AG-UI server for ticket agent on port 8001...
INFO:     Uvicorn running on http://0.0.0.0:8001
```

**Error Handling:**
- Exits if venv not found
- Exits if .env not found
- Exits if OPENAI_API_KEY not in .env

---

### start_frontend.sh

**Platform:** Any Unix-like OS

**Pre-flight Checks:**
```bash
✓ Frontend directory exists
✓ node_modules exists (or installs)
```

**Process:**
```bash
1. Navigate to project root
2. cd to ticket-frontend/
3. Check/install dependencies
4. Start Next.js dev server
```

**Output:**
```
==========================================
  Starting Next.js Frontend
==========================================

✓ Dependencies ready

🚀 Starting Next.js dev server...
   Frontend will be available at: http://localhost:3001

▲ Next.js 16.0.7
- Local:        http://localhost:3001
✓ Ready in XXXms
```

**Auto-install:**
If `node_modules` doesn't exist, runs `npm install` automatically

---

## 🛑 Stopping Services

### If using start_all.sh:
1. Switch to Terminal window running backend
2. Press `Ctrl + C`
3. Switch to Terminal window running frontend
4. Press `Ctrl + C`

### If using individual scripts:
Press `Ctrl + C` in each terminal

---

## 🔧 Customization

### Change Backend Port

Edit `start_backend.sh`:
```bash
# Change this line in app/agents/tickets/ag_ui_server.py
uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Change Frontend Port

Edit `start_frontend.sh`:
```bash
# Add before npm run dev
export PORT=3002
npm run dev
```

### Add More Checks

Edit any script and add to the checks section:
```bash
# Example: Check for specific Python version
if ! python --version | grep -q "3.1"; then
    echo "❌ Python 3.10+ required"
    exit 1
fi
```

---

## 📚 Related Documentation

- **[README.md](README.md)** - Full project documentation
- **[LAUNCH_GUIDE.md](LAUNCH_GUIDE.md)** - Detailed launch instructions
- **[NETWORK_ERROR_FIX.md](NETWORK_ERROR_FIX.md)** - CORS troubleshooting

---

## 🐛 Common Issues

### Script Won't Run

**Error:** `Permission denied`

**Fix:**
```bash
chmod +x start_all.sh start_backend.sh start_frontend.sh
```

### Backend Fails to Start

**Error:** `ModuleNotFoundError: No module named 'agents'`

**Fix:** The script sets PYTHONPATH automatically, but if it fails:
```bash
export PYTHONPATH=/Users/vishalkumar/projects/agentic_ai/app
```

### Frontend Can't Connect

**Error:** Network error in browser

**Fix:** Make sure backend is running first:
```bash
# Terminal 1
./start_backend.sh

# Wait for "Uvicorn running" message

# Terminal 2
./start_frontend.sh
```

### Port Already in Use

**Error:** `Port 8001 already in use`

**Fix:**
```bash
lsof -ti:8001 | xargs kill -9
```

---

## 💡 Tips

### Background Processes

To run servers in background:
```bash
./start_backend.sh &
./start_frontend.sh &
```

**Note:** You won't see logs. Not recommended for development.

### View Logs

Scripts output logs to stdout. To save logs:
```bash
./start_backend.sh 2>&1 | tee backend.log
./start_frontend.sh 2>&1 | tee frontend.log
```

### Check What's Running

```bash
# Check port 8001 (backend)
lsof -ti:8001

# Check port 3001 (frontend)
lsof -ti:3001

# Both
lsof -ti:8001 -ti:3001
```

---

## ✅ Success Verification

After running scripts, verify:

**Backend:**
```bash
curl http://localhost:8001
# Should return: "Method Not Allowed" (normal)
```

**Frontend:**
```bash
curl http://localhost:3001
# Should return: HTML content
```

**Or just open:** http://localhost:3001

---

## 🎯 What Each Script Does (Visual)

```
start_all.sh
    │
    ├─▶ Check Prerequisites
    │   ├─ Virtual env exists?
    │   ├─ .env file exists?
    │   └─ Frontend dir exists?
    │
    ├─▶ Open Terminal 1
    │   └─ Run start_backend.sh
    │
    └─▶ Open Terminal 2
        └─ Run start_frontend.sh


start_backend.sh
    │
    ├─▶ Activate venv
    ├─▶ Load .env
    ├─▶ Set PYTHONPATH
    └─▶ python agents/tickets/ag_ui_server.py


start_frontend.sh
    │
    ├─▶ Check node_modules
    ├─▶ Install if missing
    └─▶ npm run dev
```

---

**Created:** 2025-12-08
**Scripts Version:** 1.0
**Platform:** macOS (with Linux support)
