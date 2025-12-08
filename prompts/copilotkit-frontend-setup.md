# CopilotKit Frontend Setup Prompt

## Context
You are setting up a Next.js frontend with CopilotKit to connect to a PydanticAI agent exposed via AG-UI protocol. The backend AG-UI server is running on `http://localhost:8001` and exposes a ticket management agent.

## Objective
Create a minimal, working Next.js application with CopilotKit chat interface that connects to the AG-UI backend server.

## Prerequisites
- Node.js 18+ installed
- Backend AG-UI server running on port 8001
- Working directory: `/Users/vishalkumar/projects/agentic_ai`

---

## Step 1: Create Next.js Project

**Command:**
```bash
cd /Users/vishalkumar/projects/agentic_ai
npx create-next-app@latest ticket-frontend
```

**Interactive Prompts - Answer Exactly:**
- Would you like to use TypeScript? → **Yes**
- Would you like to use ESLint? → **Yes**
- Would you like to use Tailwind CSS? → **Yes**
- Would you like your code inside a `src/` directory? → **Yes**
- Would you like to use App Router? → **Yes**
- Would you like to use Turbopack for next dev? → **No**
- Would you like to customize the import alias (@/* by default)? → **No**

---

## Step 2: Install CopilotKit Packages

**Commands:**
```bash
cd ticket-frontend
npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/react-textarea
```

**Expected Output:**
```
added XXX packages in Xs
```

---

## Step 3: Create Main Chat Page

**File:** `src/app/page.tsx`

**Replace entire file with:**
```typescript
"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export default function Home() {
  return (
    <CopilotKit
      runtimeUrl="http://localhost:8001"
      agent="ticket-agent"
    >
      <CopilotSidebar
        instructions="You are a helpful ticket management assistant. Help users create and view tickets."
        defaultOpen={true}
        labels={{
          title: "Ticket Assistant",
          initial: "Hi! I can help you manage tickets. Try asking me to show all tickets or create a new one.",
        }}
      >
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
          <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
            <h1 className="text-4xl font-bold mb-8 text-center">
              Ticket Management System
            </h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Use the AI assistant on the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>View all tickets</li>
                <li>Create new tickets</li>
                <li>Search for specific tickets</li>
              </ul>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 <strong>Try saying:</strong> "Show me all tickets" or "Create a new bug ticket"
                </p>
              </div>
            </div>
          </div>
        </main>
      </CopilotSidebar>
    </CopilotKit>
  );
}
```

---

## Step 4: Update Layout (Optional - For Better Styling)

**File:** `src/app/layout.tsx`

**Keep existing file, just ensure it has:**
```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ticket Assistant",
  description: "AI-powered ticket management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

---

## Step 5: Start Development Server

**Command:**
```bash
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Starting...
 ✓ Ready in XXXms
```

---

## Step 6: Test the Application

1. **Open Browser:** Navigate to `http://localhost:3000`

2. **Expected UI:**
   - Main page with "Ticket Management System" header
   - Sidebar on the right with "Ticket Assistant" chat
   - Chat should be open by default

3. **Test Commands:**
   - Type: `"show me all tickets"`
   - Expected: Agent calls `get_all_tickets` tool and displays results

   - Type: `"create a ticket with title 'Test bug' and status 'open'"`
   - Expected: Agent asks for missing fields (operation, requester) and creates ticket

4. **Verify Backend Connection:**
   - Check AG-UI server logs (port 8001)
   - Should see incoming requests logged

---

## Verification Checklist

- [ ] Next.js dev server running on port 3000
- [ ] AG-UI backend server running on port 8001
- [ ] Chat sidebar visible on right side
- [ ] Can send messages to the assistant
- [ ] Assistant responds (not errors)
- [ ] Can execute "show me all tickets" successfully
- [ ] Can create a ticket through conversation

---

## Troubleshooting

### Issue: "Failed to fetch" error in chat

**Cause:** Frontend can't connect to backend

**Solution:**
1. Verify AG-UI server is running: `curl http://localhost:8001`
2. Check for CORS issues
3. Ensure `runtimeUrl="http://localhost:8001"` is correct

### Issue: Chat sidebar doesn't appear

**Cause:** CSS not loaded

**Solution:**
1. Ensure `import "@copilotkit/react-ui/styles.css";` is present
2. Restart dev server: `npm run dev`

### Issue: "Module not found" errors

**Cause:** Packages not installed

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Expected File Structure

```
ticket-frontend/
├── node_modules/
├── public/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx      ← Modified
│   │   └── page.tsx        ← Created (main file)
│   └── ...
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Next.js Frontend | 3000 | http://localhost:3000 |
| AG-UI Backend | 8001 | http://localhost:8001 |
| FastAPI (original) | 8000 | http://localhost:8000 |

---

## Success Criteria

✅ Frontend loads without errors
✅ Chat interface is visible and interactive
✅ Can communicate with AG-UI backend
✅ Agent executes tools (create_ticket, get_all_tickets)
✅ Responses are displayed in chat

---

## Next Steps After Setup

1. **Test ticket creation:** Walk through complete ticket creation flow
2. **Test ticket listing:** Verify all tickets display correctly
3. **Add custom UI:** Create ticket cards that display when listing
4. **Enhance agent:** Add more tools (update, delete, search)

---

## Reference Commands (Quick Copy)

```bash
# Complete setup from scratch
cd /Users/vishalkumar/projects/agentic_ai
npx create-next-app@latest ticket-frontend
cd ticket-frontend
npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/react-textarea

# Create page.tsx with content above
# Update layout.tsx with content above

npm run dev
```

---

## Reproducibility Notes

- **Node.js Version:** Use LTS (18.x or 20.x)
- **Package Versions:** Latest stable (as of Dec 2025)
- **Next.js Version:** 15.x with App Router
- **CopilotKit Version:** Latest (compatible with AG-UI)

This prompt should produce identical results every time when followed exactly.

---

**Last Updated:** 2025-12-08
**Backend AG-UI Server:** Running on port 8001
**Frontend Target:** http://localhost:3000
