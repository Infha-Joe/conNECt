# conNECt — Phase 1 through 7

College Professional Networking & Collaboration Platform (NEC).

**Phase 1 — Foundation** · **Phase 2 — Social Network** · **Phase 3 — College Core** · **Phase 4 — Mentor Collaboration** · **Phase 5 — Mentor Workspace (Classroom)** · **Phase 6 — Community Hub**

**Phase 7 — Gamification (new):** badges, XP, streaks, daily tasks, department challenges, and a leaderboard.

## What's new in Phase 7

**Backend**
- `Badge`, `UserBadge`, `Challenge`, `DailyTask` models
- 12 default badges **auto-seeded on server startup** (no manual setup needed) — mix of auto-awarded (Community Helper, Project Leader, Consistency Badge) and admin-awarded (College Topper, Club President, Mentor, etc.)
- `utils/badgeAwards.js` — reusable `awardBadge()` helper, wired into:
  - Community request resolution → **Community Helper** badge after 5 resolved requests
  - Project marked completed → **Project Leader** badge for the leader
  - 7-day streak reached → **Consistency Badge**
- Daily tasks: 5 fixed tasks per day, completing one awards +5 XP and advances your streak (consecutive days only — missing a day resets it)
- Department leaderboard: aggregates points from challenges each department has won
- Admin can create challenges (assign departments, points, dates) and declare a winner

**Frontend** — new `/achievements` page with three tabs:
- **Badges** — your XP/streak/badge count at a glance, full badge grid (earned vs locked)
- **Daily Tasks** — checklist of today's 5 tasks, click to complete and earn XP, streak counter with flame icon
- **Leaderboard** — department standings by challenge points won; admins can create challenges and declare winners inline

Profile pages now also display a user's earned badges.

## Setup

Same as previous phases — `npm install` in both `server` and `client`, `.env` with `MONGO_URI` + `JWT_SECRET` (+ `DAILY_API_KEY` for video classes). No new dependencies this phase.

## Try Phase 7

1. Go to `/achievements` → **Daily Tasks** tab, complete a task, watch XP and streak update
2. **Badges** tab shows the badge grid — locked badges are greyed out until earned
3. As admin, go to **Leaderboard** tab → create a challenge, assign departments, then declare a winner — leaderboard updates immediately
4. Resolve 5 campus requests (Phase 6) as the same user → **Community Helper** badge auto-awarded with a live notification
5. Complete a project (Phase 4) as its leader → **Project Leader** badge auto-awarded

## Next: Phase 8 — Admin Dashboard
User management, verification, content moderation, and platform-wide analytics — the final phase of the original 8-phase roadmap.
