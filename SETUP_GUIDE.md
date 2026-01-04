# Task Dashboard - Complete Setup Guide

This guide will help you set up both the backend and frontend for the Task Dashboard application with Google OAuth authentication.

## Overview

- **Backend**: Node.js + Express + MongoDB + Passport.js (Google OAuth)
- **Frontend**: React + TypeScript + Vite + Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Google Cloud Console account for OAuth credentials

---

## Backend Setup

### 1. Set Up Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen if not already done
6. For Application type, select **Web application**
7. Add authorized redirect URIs:
   - `http://localhost:5000/auth/google/callback`
8. Copy the **Client ID** and **Client Secret**

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-dash
SESSION_SECRET=your_random_secret_key_here_change_in_production

GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

FRONTEND_URL=http://localhost:5173
```

### 4. Start MongoDB

Local MongoDB:
```bash
mongod
```

Or use MongoDB Atlas connection string in the `.env` file.

### 5. Run the Backend Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

---

## Frontend Setup

### 1. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 2. Run the Frontend Development Server

```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

---

## Testing the Application

### 1. Start Both Servers

Make sure both backend (port 5000) and frontend (port 5173) are running.

### 2. Access the Application

1. Open browser and go to `http://localhost:5173`
2. Click on **Login** or **Sign Up** in the header
3. Click **Sign in with Google** button
4. Authenticate with your Google account
5. You'll be redirected to the Dashboard after successful authentication

### 3. Test Features

- **Dashboard**: View task overview and statistics
- **Tasks**: Create, view, update, and delete tasks
- **Profile**: View your name and avatar in the header
- **Logout**: Click your profile icon and select logout

---

## Project Structure

```
task-dash/
├── backend/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── passport.js          # Google OAuth strategy
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── models/
│   │   ├── User.js              # User model
│   │   └── Task.js              # Task model
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   └── tasks.js             # Task CRUD routes
│   ├── .env                     # Environment variables (create this)
│   ├── .env.example             # Environment template
│   ├── package.json
│   └── server.js                # Express server
│
└── frontend/
    ├── src/
    │   ├── components/          # Reusable components
    │   ├── context/
    │   │   ├── AuthContext.tsx  # Authentication state
    │   │   └── ThemeContext.tsx # Dark mode
    │   ├── pages/               # Page components
    │   ├── utils/
    │   │   └── api.ts           # Backend API client
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

---

## API Endpoints

### Authentication

- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/current` - Get current user
- `GET /auth/logout` - Logout

### Tasks (Authenticated)

- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle completion

---

## Common Issues & Solutions

### Backend Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check MONGODB_URI in `.env`
- For MongoDB Atlas, ensure IP address is whitelisted

**Google OAuth Error:**
- Verify Client ID and Secret are correct
- Check authorized redirect URIs match exactly
- Ensure Google+ API is enabled

### Frontend Issues

**Cannot connect to backend:**
- Verify backend is running on port 5000
- Check CORS settings in backend
- Ensure credentials are included in API calls

**Authentication not persisting:**
- Check browser cookies are enabled
- Verify session configuration in backend
- Clear browser cookies and try again

---

## Production Deployment

### Backend

1. Set `NODE_ENV=production` in environment
2. Use secure session secret (long random string)
3. Enable HTTPS and update cookie settings:
   ```javascript
   cookie: {
     secure: true,
     sameSite: 'none'
   }
   ```
4. Update CORS settings for production domain
5. Use MongoDB Atlas or secured MongoDB instance
6. Update Google OAuth callback URL to production domain

### Frontend

1. Build the frontend:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to hosting service (Vercel, Netlify, etc.)
3. Update API URLs in frontend code to production backend URL

---

## Support

For issues or questions, please check:
- Backend README: `backend/README.md`
- Frontend README: `frontend/README.md`
- Google OAuth Setup: [Google Identity Platform](https://developers.google.com/identity)

---

## Features

- ✅ Google OAuth 2.0 authentication
- ✅ User session management
- ✅ Protected routes
- ✅ Task CRUD operations
- ✅ User-specific task isolation
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Task filtering and search
- ✅ Task categories and priorities

## Future Enhancements

- Email/password authentication
- Task sharing and collaboration
- Calendar integration
- AI chat functionality
- Email notifications
- Task reminders
- Export tasks to CSV/PDF
