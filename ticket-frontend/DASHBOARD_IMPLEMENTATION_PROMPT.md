# Dashboard Implementation Prompt

> **Framework Clarification:** This project uses **Next.js 16**, which is a **React framework**. All components are React components (.tsx files) using React 19. Next.js adds file-based routing, server-side rendering, and build optimizations on top of React. If you're familiar with React, you already know how to work with this codebase - just add `"use client"` for interactive components.

## Project Context
This is a **Next.js 16 (React 19 framework)** + TypeScript + Tailwind CSS project for "Jarvis" - an AI-powered operations platform. The application currently has a basic dashboard with three feature cards (FinOps, GreenOps, Ticket Management) and needs to be transformed into a professional, personalized dashboard.

**Important:** Next.js is a React framework that adds routing, SSR, and optimizations on top of React. All components are React components using JSX/TSX. The `src/app/` directory structure uses Next.js App Router with React Server Components and Client Components (`"use client"`).

## Current Tech Stack
- **Framework:** Next.js 16 (React framework with App Router and Turbopack)
- **UI Library:** React 19.2.0
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **AI Integration:** CopilotKit (React components)
- **Backend:** FastAPI (ticket management API)
- **Existing Features:** Ticket Management (functional), FinOps (coming soon), GreenOps (coming soon)

**Tech Stack Notes:**
- All components are React components (.tsx files)
- Use React hooks (useState, useEffect, etc.) as normal
- Client-side components need `"use client"` directive
- File-based routing via Next.js App Router (`src/app/` directory)

## Current File Structure
```
ticket-frontend/src/
├── app/
│   ├── page.tsx           # Main dashboard (needs complete redesign)
│   └── globals.css        # Global styles
├── features/
│   ├── tickets/           # Ticket Management feature
│   ├── finops/            # FinOps feature (placeholder)
│   └── greenops/          # GreenOps feature (placeholder)
└── components/            # Shared components (to be created)
```

---

## Target Design Specification

### Visual Reference
The target design is a modern, dark-themed dashboard with the following layout:

```
┌─────────────────────────────────────────────────────────────────┐
│ [Sidebar] [Verified Access Badge] Welcome back, Alex  [Customize] [🔔] │
├─────────────────────────────────────────────────────────────────┤
│ [Sidebar]  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│ [Nav     ]  │Pending│ │Active│ │Cloud │ │Effici│                │
│ [Icons  ]  │   3  │ │  5   │ │ 84%  │ │  92  │                │
│ [Vertical] └──────┘ └──────┘ └──────┘ └──────┘                │
│            ┌─────────────────┐  ┌─────────────────┐            │
│            │ Your Favorites  │  │ Recent Activity │            │
│            │                 │  │                 │            │
│            │ [Card] [Card]   │  │ • Item 1        │            │
│            │ [Card]          │  │ • Item 2        │            │
│            └─────────────────┘  │ • Item 3        │            │
│            ┌─────────────────────┴─────────────────┘            │
│            │ Explore CCoE Products      [View All]              │
│            │ [FinOps] [GreenOps] [Ticket Mgmt]                  │
│            └───────────────────────────────────────             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Detailed Component Specifications

### 1. Top Bar Component
**Location:** Top of dashboard, spans full width

**Elements:**
- **Left Side:**
  - Badge: "🛡️ Verified Access: Level 3 Administrator" (green shield icon, gray text)
  - Welcome message: "Welcome back, [UserName]" (large, bold, white text)

- **Right Side:**
  - Button: "✨ Customize Dashboard" (dark button, white text, sparkle icon)
  - Notification bell icon with red badge (showing unread count)

**Styling:**
- Background: transparent/dark
- Height: ~100px
- Padding: 24px horizontal
- Items vertically centered

---

### 2. Metrics Cards Section
**Layout:** 4 cards in a horizontal row, equal width, responsive

**Card 1: Pending Approvals**
- Icon: Clock/timer icon (orange)
- Title: "PENDING APPROVALS"
- Value: "3" (large number)
- Subtitle: "Waiting for your review" (orange text)
- Background: Dark card with subtle border
- Icon color: Orange (#f97316)

**Card 2: Active Tickets**
- Icon: Ticket/support icon (blue)
- Title: "ACTIVE TICKETS"
- Value: "5" (large number)
- Subtitle: "2 high priority" (blue text)
- Icon color: Blue (#3b82f6)

**Card 3: Cloud Budget**
- Icon: Credit card/wallet icon (green)
- Title: "CLOUD BUDGET"
- Value: "84%" (large number)
- Progress bar: Green, 84% filled
- Icon color: Green (#10b981)

**Card 4: Efficiency Score**
- Icon: Activity/chart icon (purple)
- Title: "EFFICIENCY SCORE"
- Value: "92" (large number)
- Subtitle: "↗ Top 5% of users" (green text with up arrow)
- Icon color: Purple (#a855f7)

**Card Dimensions:**
- Height: ~140px
- Border radius: 16px
- Padding: 24px
- Gap between cards: 16px
- Background: rgba(255, 255, 255, 0.05) with border

---

### 3. Two-Column Layout (Favorites + Activity)

#### Left Column: Your Favorites Section
**Header:**
- Title: "⭐ Your Favorites" (yellow star, white text)
- Edit button: "Edit" (right-aligned, gray text)

**Favorite Cards (3 cards, 2 columns on desktop):**
1. **Cost Explorer**
   - Icon: Credit card (green/teal)
   - Title: "Cost Explorer" (white)
   - Background: Dark with green glow
   - Hover: Subtle lift effect

2. **Carbon Footprint**
   - Icon: Leaf (green)
   - Title: "Carbon Footprint" (white)
   - Background: Dark with green glow

3. **Deploy Status**
   - Icon: Lightning bolt (yellow)
   - Title: "Deploy Status" (white)
   - Background: Dark with yellow glow

**Card Dimensions:**
- Width: 48% each (2 per row)
- Height: ~120px
- Border radius: 12px
- Padding: 20px

#### Right Column: Recent Activity Section
**Header:**
- Icon: Clock (white)
- Title: "Recent Activity" (white text)
- Dropdown: "TIMELINE" (top-right, with menu icon)

**Activity Items (vertical timeline):**
Each item shows:
- Status icon (colored circle: green for success, orange for warning, gray for info)
- Title (bold, white)
- Subtitle (gray, smaller)
- Timestamp (gray, right-aligned)

Example items:
1. ✅ "Request Approved" | "AWS EC2 Instance Large" | "2h ago"
2. ⚠️ "Budget Alert" | "Q3 Marketing Spend" | "5h ago"
3. ⚪ "Ticket Updated" | "INC-2024-892" | "1d ago"

**Styling:**
- Vertical line connecting items
- Icon size: 24px
- Spacing between items: 20px
- Background: Dark card with border

---

### 4. Product Cards Section (Bottom)
**Header:**
- Title: "Explore CCoE Products" (white text)
- Link: "View All" (right-aligned, gray text)

**Product Cards (3 cards, horizontal row):**

**Card 1: FinOps**
- Icon: Credit card (green, top-left)
- Star icon: Top-right (for favoriting)
- Title: "FinOps" (large, bold, white)
- Description: "Optimize cloud costs & manage financial..." (gray, truncated)
- Background: Dark card with subtle border
- Hover: Border glow effect

**Card 2: GreenOps**
- Icon: Leaf (green)
- Star icon: Top-right
- Title: "GreenOps" (large, bold, white)
- Description: "Track carbon footprint & sustainable operations." (gray)

**Card 3: Ticket Mgmt**
- Icon: Ticket (blue)
- Star icon: Top-right
- Title: "Ticket Mgmt" (large, bold, white)
- Description: "AI-assisted support ticket tracking." (gray)

**Card Dimensions:**
- Width: 32% each (3 per row)
- Height: ~160px
- Border radius: 16px
- Padding: 24px
- Gap: 16px

---

## Technical Requirements

### Data Management

#### User State (localStorage)
```typescript
interface UserState {
  name: string;                    // e.g., "Alex"
  role: string;                    // e.g., "Level 3 Administrator"
  verifiedAccess: boolean;
  favorites: string[];              // IDs of favorited items
  dashboardLayout: {
    metricsVisible: boolean;
    favoritesVisible: boolean;
    activityVisible: boolean;
  };
}
```

#### Metrics Data (Mock initially)
```typescript
interface Metrics {
  pendingApprovals: {
    count: number;
    subtitle: string;
  };
  activeTickets: {
    count: number;
    highPriority: number;
  };
  cloudBudget: {
    percentage: number;
  };
  efficiencyScore: {
    score: number;
    percentile: number;
  };
}
```

#### Activity Data
```typescript
interface ActivityItem {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  subtitle: string;
  timestamp: string;               // ISO format
}
```

---

## Implementation Tasks

### Phase 1: Foundation & User State
**Files to create:**
- `src/hooks/useUserState.ts` - React hook for user state management
- `src/types/dashboard.ts` - TypeScript interfaces
- `src/utils/mockData.ts` - Mock data for development

**Tasks:**
1. Create useUserState React hook with localStorage persistence
2. Define TypeScript interfaces for all data types
3. Generate mock data for metrics and activity
4. Add user name prompt on first visit (simple modal using React state)

**React Patterns to Use:**
- useState for local component state
- useEffect for localStorage sync
- Custom hook pattern for reusability

**Acceptance Criteria:**
- User can enter name on first visit
- Name persists across page refreshes (localStorage)
- Mock data is properly typed with TypeScript
- Hook follows React best practices

---

### Phase 2: Layout & Top Bar
**Files to create:**
- `src/components/dashboard/TopBar.tsx`
- `src/components/dashboard/DashboardLayout.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/Button.tsx`

**Tasks:**
1. Create responsive dashboard layout with sidebar
2. Implement top bar with verified badge and welcome message
3. Add "Customize Dashboard" button (non-functional initially)
4. Add notification bell with badge
5. Create reusable Badge and Button components

**Styling Requirements:**
- Dark theme (bg-gray-900)
- Sidebar: 80px wide, icons only
- Top bar: 100px height, flex layout
- Responsive: Stack on mobile

**Acceptance Criteria:**
- Top bar displays user name correctly
- Layout is responsive
- Components use Tailwind CSS classes only

---

### Phase 3: Metrics Cards
**Files to create:**
- `src/components/dashboard/MetricCard.tsx`
- `src/components/dashboard/MetricsGrid.tsx`
- `src/components/ui/ProgressBar.tsx`

**Tasks:**
1. Create reusable MetricCard component with variants
2. Implement progress bar for Cloud Budget card
3. Add icons using Heroicons or Lucide React
4. Create 4-column grid layout (responsive to 2 columns on tablet, 1 on mobile)
5. Connect to mock metrics data

**Component Props:**
```typescript
interface MetricCardProps {
  icon: ReactNode;
  iconColor: string;
  title: string;
  value: string | number;
  subtitle?: string;
  showProgress?: boolean;
  progressValue?: number;
}
```

**Acceptance Criteria:**
- All 4 metric cards display correctly
- Progress bar animates smoothly
- Cards are responsive
- Icons match design colors

---

### Phase 4: Favorites Section
**Files to create:**
- `src/components/dashboard/FavoritesSection.tsx`
- `src/components/dashboard/FavoriteCard.tsx`
- `src/hooks/useFavorites.ts`

**Tasks:**
1. Create FavoriteCard component with icon and title
2. Implement 2-column grid for favorites
3. Add "Edit" mode functionality
4. Create useFavorites hook for managing favorites
5. Add hover effects and animations

**Edit Mode Features:**
- Show remove (X) button on each card
- Allow adding new favorites from a list
- Save to localStorage

**Acceptance Criteria:**
- 3 favorite cards display in 2-column grid
- Edit mode allows removing favorites
- State persists in localStorage
- Smooth hover animations

---

### Phase 5: Recent Activity Timeline
**Files to create:**
- `src/components/dashboard/ActivityTimeline.tsx`
- `src/components/dashboard/ActivityItem.tsx`
- `src/utils/timeAgo.ts` - Helper for relative timestamps

**Tasks:**
1. Create ActivityItem component with status indicator
2. Implement vertical timeline with connecting line
3. Add relative timestamp utility ("2h ago", "1d ago")
4. Create dropdown menu for "TIMELINE" filter
5. Add smooth scroll for long lists

**Timeline Design:**
- Vertical line connecting all items (2px, gray)
- Status dots: 24px circles (green, orange, gray)
- Title: 16px, bold
- Subtitle: 14px, gray-400
- Timestamp: 12px, gray-500, right-aligned

**Acceptance Criteria:**
- Timeline displays with proper vertical alignment
- Status colors match item type
- Timestamps are relative and accurate
- Items are sorted by most recent first

---

### Phase 6: Product Cards
**Files to create:**
- `src/components/dashboard/ProductCard.tsx`
- `src/components/dashboard/ProductsGrid.tsx`

**Tasks:**
1. Create ProductCard component with star favorite button
2. Implement 3-column grid (responsive to 1 column on mobile)
3. Add hover effects (border glow)
4. Connect to existing features (navigation)
5. Implement favorite toggle functionality

**Component Props:**
```typescript
interface ProductCardProps {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  isFavorited: boolean;
  onFavoriteToggle: (id: string) => void;
  onNavigate: () => void;
}
```

**Acceptance Criteria:**
- All 3 product cards display correctly
- Clicking card navigates to feature
- Star toggle adds/removes from favorites
- Hover effect is smooth

---

### Phase 7: Polish & Integration
**Tasks:**
1. Implement "Customize Dashboard" modal with show/hide options
2. Connect Active Tickets metric to real API data
3. Add loading states for all async data
4. Implement smooth page transitions
5. Add empty states (e.g., "No recent activity")
6. Optimize responsive breakpoints
7. Add keyboard navigation support

**Customize Dashboard Modal:**
- Toggle visibility of: Metrics, Favorites, Activity, Products
- Reset to default layout button
- Save button (updates localStorage)

**Acceptance Criteria:**
- Modal opens and saves preferences
- Real ticket count displays in Active Tickets metric
- Loading spinners show during data fetch
- All sections have proper empty states
- Works smoothly on mobile/tablet/desktop

---

## File Structure (After Implementation)

```
ticket-frontend/src/
├── app/
│   ├── page.tsx                      # Updated main dashboard
│   └── globals.css                   # Updated with custom styles
├── components/
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx       # Main layout wrapper
│   │   ├── TopBar.tsx                # Top bar with welcome
│   │   ├── MetricsGrid.tsx           # 4 metrics cards grid
│   │   ├── MetricCard.tsx            # Reusable metric card
│   │   ├── FavoritesSection.tsx      # Favorites container
│   │   ├── FavoriteCard.tsx          # Single favorite card
│   │   ├── ActivityTimeline.tsx      # Activity feed
│   │   ├── ActivityItem.tsx          # Single activity item
│   │   ├── ProductsGrid.tsx          # Products section
│   │   └── ProductCard.tsx           # Single product card
│   └── ui/
│       ├── Badge.tsx                 # Reusable badge
│       ├── Button.tsx                # Reusable button
│       ├── ProgressBar.tsx           # Progress bar component
│       └── Modal.tsx                 # Modal for customization
├── hooks/
│   ├── useUserState.ts               # User state management
│   └── useFavorites.ts               # Favorites management
├── types/
│   └── dashboard.ts                  # All TypeScript interfaces
├── utils/
│   ├── mockData.ts                   # Mock data generators
│   └── timeAgo.ts                    # Relative time helper
└── features/
    └── (existing features)
```

---

## Design System Specifications

### Colors (Tailwind CSS)
```css
/* Backgrounds */
--bg-primary: bg-gray-900
--bg-card: bg-gray-800/50
--bg-card-hover: bg-gray-800/70

/* Text */
--text-primary: text-white
--text-secondary: text-gray-400
--text-muted: text-gray-500

/* Accents */
--accent-orange: text-orange-500 / bg-orange-500
--accent-blue: text-blue-500 / bg-blue-500
--accent-green: text-green-500 / bg-green-500
--accent-purple: text-purple-500 / bg-purple-500
--accent-yellow: text-yellow-500 / bg-yellow-500

/* Borders */
--border-subtle: border-gray-700
--border-hover: border-gray-600
```

### Typography
```css
/* Headings */
h1: text-4xl font-bold
h2: text-2xl font-semibold
h3: text-xl font-semibold

/* Body */
body: text-base font-normal
subtitle: text-sm text-gray-400
caption: text-xs text-gray-500
```

### Spacing
```css
/* Card Padding */
--padding-sm: p-4
--padding-md: p-6
--padding-lg: p-8

/* Gaps */
--gap-sm: gap-2
--gap-md: gap-4
--gap-lg: gap-6
--gap-xl: gap-8
```

### Border Radius
```css
--radius-sm: rounded-lg (8px)
--radius-md: rounded-xl (12px)
--radius-lg: rounded-2xl (16px)
```

### Shadows
```css
--shadow-card: shadow-lg
--shadow-card-hover: shadow-xl
```

---

## Animation Guidelines

### Hover Effects
```css
/* Cards */
transition: all 0.2s ease-in-out
hover:scale-[1.02]
hover:shadow-xl
hover:border-gray-600

/* Buttons */
transition: all 0.15s ease
hover:bg-opacity-80
```

### Loading States
- Use Tailwind's `animate-pulse` for skeleton loading
- Spinner: 20px, centered, border-2

### Page Transitions
- Fade in on mount: `animate-fade-in`
- Duration: 300ms
- Easing: ease-out

---

## Testing Checklist

### Functionality
- [ ] User name persists across refreshes
- [ ] Metrics display correct mock data
- [ ] Favorites can be added/removed
- [ ] Activity timeline sorts by date
- [ ] Product cards navigate to features
- [ ] Customize modal saves preferences
- [ ] Active Tickets shows real count from API

### Responsive Design
- [ ] Mobile (< 640px): All sections stack vertically
- [ ] Tablet (640px - 1024px): 2-column layout for some sections
- [ ] Desktop (> 1024px): Full multi-column layout
- [ ] Sidebar collapses on mobile

### Accessibility
- [ ] All interactive elements are keyboard accessible
- [ ] Focus states are visible
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader labels for icons

### Performance
- [ ] No layout shift on load
- [ ] Images/icons load efficiently
- [ ] localStorage operations don't block UI
- [ ] Smooth 60fps animations

---

## Mock Data Examples

### Metrics Mock Data
```typescript
export const mockMetrics: Metrics = {
  pendingApprovals: {
    count: 3,
    subtitle: "Waiting for your review"
  },
  activeTickets: {
    count: 5,
    highPriority: 2
  },
  cloudBudget: {
    percentage: 84
  },
  efficiencyScore: {
    score: 92,
    percentile: 5
  }
};
```

### Activity Mock Data
```typescript
export const mockActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'success',
    title: 'Request Approved',
    subtitle: 'AWS EC2 Instance Large',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2h ago
  },
  {
    id: '2',
    type: 'warning',
    title: 'Budget Alert',
    subtitle: 'Q3 Marketing Spend',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5h ago
  },
  {
    id: '3',
    type: 'info',
    title: 'Ticket Updated',
    subtitle: 'INC-2024-892',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1d ago
  }
];
```

---

## API Integration Points

### Existing API (Keep)
```typescript
// Fetch tickets for Active Tickets metric
GET http://localhost:8000/tickets
Response: Ticket[]
```

### Future APIs (Mock for now)
```typescript
// User profile
GET /api/user/profile
Response: { name: string, role: string, accessLevel: string }

// Pending approvals
GET /api/approvals/pending
Response: { count: number, items: Approval[] }

// Cloud budget
GET /api/cloud/budget
Response: { percentage: number, amount: number, limit: number }

// Activity feed
GET /api/activity/recent
Response: ActivityItem[]
```

---

## Success Criteria

The implementation is complete when:

1. ✅ User sees personalized welcome message with their name
2. ✅ All 4 metric cards display with correct mock data
3. ✅ Active Tickets metric shows real count from API
4. ✅ Favorites section allows editing and persists choices
5. ✅ Recent activity timeline displays mock items with proper formatting
6. ✅ Product cards navigate to existing features
7. ✅ "Customize Dashboard" button opens functional modal
8. ✅ All sections are responsive on mobile/tablet/desktop
9. ✅ Dark theme matches the reference design
10. ✅ No console errors or TypeScript warnings

---

## Known Limitations (To Document)

- Metrics data is mocked except Active Tickets
- User authentication is simulated via localStorage
- No backend for approvals, budget, or efficiency score
- Activity feed is static mock data
- Drag-and-drop reordering not implemented (future enhancement)

---

## Future Enhancements (Post-MVP)

1. Real-time data updates via WebSocket
2. Drag-and-drop dashboard customization
3. Widget marketplace (add new metric cards)
4. Export dashboard as PDF/image
5. Team dashboards (view colleagues' metrics)
6. Custom date ranges for metrics
7. Advanced filtering for activity timeline
8. Dark/light theme toggle
9. Multiple dashboard layouts (save/switch between)
10. Notifications system integration

---

## Prompt Usage Instructions

### For AI Assistants
```
"Implement the Jarvis dashboard according to the specifications in
DASHBOARD_IMPLEMENTATION_PROMPT.md. This is a Next.js 16 project (React 19
framework). All components are React components using TypeScript and Tailwind CSS.
Start with Phase 1 and proceed sequentially through all phases. Use React hooks
(useState, useEffect, custom hooks), the exact component structure, styling
guidelines, and mock data provided. Add 'use client' directive for client-side
components. Ensure TypeScript types are properly defined and all components
are responsive."
```

### For Developers
1. Read the entire prompt to understand scope
2. **Note:** This is a React project using Next.js framework - use React patterns
3. Set up project structure first (folders, files)
4. Implement phases sequentially (1 → 7)
5. Use React hooks, TSX/JSX, and functional components
6. Add `"use client"` directive for client-side interactive components
7. Test each phase before moving to next
8. Use mock data initially, plan for API integration
9. Refer to Design System section for consistent styling

---

## Version History

- **v1.0** (2025-01-XX): Initial prompt created based on reference design
- Target: Jarvis Operations Platform Dashboard
- Framework: Next.js 16 (React 19 framework) + TypeScript + Tailwind CSS v4
- Note: All components are React components; Next.js provides routing and optimizations

---

## Contact & Support

For questions about this implementation:
- Review the reference screenshot
- Check existing codebase in `ticket-frontend/src/`
- Refer to Next.js 16 and Tailwind CSS documentation
- Test in browser at `http://localhost:3000` (or port shown by dev server)

---

**END OF PROMPT**
