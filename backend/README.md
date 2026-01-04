# Task Dashboard Backend

Backend server for the Task Dashboard application with Google OAuth authentication.

## Features

- Google OAuth 2.0 Authentication
- RESTful API for task management
- MongoDB database with Mongoose ODM
- Session-based authentication with Passport.js
- Protected routes with authentication middleware

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Google Cloud Console project with OAuth 2.0 credentials

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `http://localhost:5000/auth/google/callback` (for development)
6. Copy the Client ID and Client Secret

### 3. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-dash
SESSION_SECRET=your_random_secret_key_here

GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

FRONTEND_URL=http://localhost:5173
```

### 4. Start MongoDB

Make sure MongoDB is running:

```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

### 5. Run the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

- `GET /auth/google` - Initiate Google OAuth flow
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/current` - Get current authenticated user
- `GET /auth/logout` - Logout user

### Tasks (Protected Routes)

- `GET /api/tasks` - Get all tasks for authenticated user
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion

### Health Check

- `GET /api/health` - Server health check
- `GET /api/user` - Check authentication status

## Project Structure

```
backend/
├── config/
│   ├── database.js      # MongoDB connection
│   └── passport.js      # Passport Google OAuth strategy
├── middleware/
│   └── auth.js          # Authentication middleware
├── models/
│   ├── Task.js          # Task model
│   └── User.js          # User model
├── routes/
│   ├── auth.js          # Authentication routes
│   └── tasks.js         # Task CRUD routes
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
└── server.js            # Express server entry point
```

## Security Notes

- Never commit `.env` file to version control
- Use strong session secrets in production
- Enable HTTPS in production
- Update CORS settings for production domains
- Use MongoDB Atlas or secured MongoDB instance in production

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check MONGODB_URI in `.env`

**Google OAuth Error:**
- Verify Google Client ID and Secret
- Check authorized redirect URIs in Google Console
- Ensure callback URL matches exactly

**Session/Cookie Issues:**
- Check CORS configuration
- Verify frontend URL in CORS settings
- For production, set `secure: true` in cookie options
