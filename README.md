# conNECt — Phase 1: Foundation

College Professional Networking & Collaboration Platform (NEC).

This phase delivers: project setup, MongoDB connection, JWT authentication, all four roles (student/teacher/alumni/admin), the professional User profile model, and the Department model — fully wired frontend to backend.

## What's included

**Backend (`/server`)**
- Express + MongoDB (Mongoose) connection
- `User` model — profile fields, role enum, password hashing, safe JSON output
- `Department` model
- JWT auth: register, login, logout, `/me`
- Role-based authorization middleware (`authorize("admin", "teacher", ...)`)
- Centralized error handling
- Socket.IO initialized (wired into features from Phase 5 onward)

**Frontend (`/client`)**
- Vite + React + Tailwind, custom design system (see `tailwind.config.js`)
- `AuthContext` — login/register/logout, persisted session
- Axios instance with auto token attach + auto-logout on 401
- Login & Register pages (role selection, department dropdown) — designed, not generic
- Protected routes with role support
- Dashboard placeholder confirming the full auth flow

## Setup

### 1. Backend
```bash
cd server
npm install
cp .env.example .env
# Fill in MONGO_URI (MongoDB Atlas connection string) and JWT_SECRET
npm run dev
```
Server runs on `http://localhost:5000`.

### 2. Frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev
```
Client runs on `http://localhost:5173`.

### 3. Seed at least one Department
Departments are needed for registration. Easiest way for now — POST directly (you'll need an admin JWT once one exists, or temporarily open the route while seeding):
```bash
POST http://localhost:5000/api/departments
{ "name": "Computer Science", "code": "CSE", "themeColor": "#1E3A8A" }
```
Or insert a few rows directly via MongoDB Compass to get started quickly.

### 4. Try the flow
1. Visit `http://localhost:5173/register`
2. Create a student, teacher, and alumni account
3. Confirm login persists and `/dashboard` shows correct role/department

## Next: Phase 2 — Social Network
Posts, likes, comments, follow system, and profile activity feed.
