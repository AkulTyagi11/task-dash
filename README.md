# Task Dash

AI-enhanced task management with a modern dashboard, calendar view, and Google OAuth.

## Highlights

- Streamlined task creation, filtering, and prioritization
- Google OAuth authentication with session-based security
- Dashboard analytics and activity summaries
- Calendar view and AI chat entry point

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, MongoDB, Mongoose, Passport.js
- Auth: Google OAuth 2.0

## Project Structure

```
backend/   Express API + Auth + MongoDB models
frontend/  React app (Vite)
```

## Getting Started

### Prerequisites

- Node.js 16+
- MongoDB (local or Atlas)
- Google Cloud Console project with OAuth credentials

### 1) Backend Setup

```bash
cd backend
npm install
```

Create a backend/.env file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-dash
SESSION_SECRET=replace_with_a_long_random_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

FRONTEND_URL=http://localhost:5173
```

Start MongoDB (local):

```bash
mongod
```

Run the server:

```bash
npm run dev
```

### 2) Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173

## Core API Endpoints

Authentication:

- GET /auth/google
- GET /auth/google/callback
- GET /auth/current
- GET /auth/logout

Tasks (authenticated):

- GET /api/tasks
- GET /api/tasks/:id
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id
- PATCH /api/tasks/:id/toggle

## Scripts

Backend:

- npm run dev
- npm start

Frontend:

- npm run dev
- npm run build
- npm run preview

## Deployment Notes

- Set NODE_ENV=production and use a secure SESSION_SECRET
- Configure HTTPS and update cookie settings in production
- Update FRONTEND_URL and Google OAuth callback URL to your production domain

## Roadmap Ideas

- Task editing and quick inline updates
- Due-soon and overdue indicators
- Category and priority insights
- Calendar sync and reminders
