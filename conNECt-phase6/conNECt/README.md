# conNECt — Phase 1 through 6

College Professional Networking & Collaboration Platform (NEC).

**Phase 1 — Foundation:** setup, MongoDB, JWT auth, all four roles, User + Department models.

**Phase 2 — Social Network:** posts, likes, comments, follow system, profile activity.

**Phase 3 — College Core:** clubs, events, calendar, live notification bell over Socket.IO.

**Phase 4 — Mentor Collaboration:** projects, mentor request → accept/reject, automatic workspace creation.

**Phase 5 — Mentor Workspace (Classroom):** assignments, submissions, feedback, real-time group chat, live video classes (Daily.co).

**Phase 6 — Community Hub:** polls, suggestions/feedback, and the campus needs/request board.

## What's included

**Backend (`/server`)** — 21 models, 16 controllers, 15 route files, full JWT auth + RBAC, Socket.IO (live notifications + workspace chat), Daily.co video integration.

**Frontend (`/client`)** — Login/Register (designed, role-aware), Feed, Explore, Profile, Clubs, Events, Calendar, Projects, Mentor Requests inbox, Workspace (Assignments/Chat/Video tabs), and the new **Community Hub** (`/community`) with three tabs:
- **Polls** — create a poll with multiple options, vote once, see live results as percentage bars
- **Suggestions & Feedback** — submit suggestions or feedback about the platform, events, clubs, or facilities; admins can mark items reviewed
- **Campus Requests** — post a need (e.g. "need a calculator for tomorrow's exam"), others can offer to help; resolving a request awards the helper +10 XP (groundwork for Phase 7 gamification)

## Setup

### 1. Backend
```bash
cd server
npm install
cp .env.example .env
# Fill in MONGO_URI and JWT_SECRET (and DAILY_API_KEY if you want video classes)
npm run dev
```

### 2. Frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

### 3. Seed at least one Department
```bash
POST http://localhost:5000/api/departments
{ "name": "Computer Science", "code": "CSE", "themeColor": "#1E3A8A" }
```

## Try Phase 6

1. Go to `/community` in the nav
2. **Polls tab:** create a poll with 2+ options, vote from a second test account, watch the result bars update
3. **Suggestions tab:** submit feedback about an event or the platform; log in as admin to mark it reviewed
4. **Campus Requests tab:** post a request (e.g. "need lab partner"), switch to a second account, click "I can help" — request moves to Resolved, helper's XP increases by 10

## Next: Phase 7 — Gamification
Badges, XP (now has real data flowing in from Phase 6 helper points), streaks, department challenges, and leaderboard.
