
# JE TechHub - Learning Platform

A full-stack web application for JE TechHub's educational platform with authentication, course enrollment, and user profiles.

## Features

- User Registration and Login
- JWT Authentication with Refresh Tokens
- User Profile Management
- Course Enrollment
- Progress Tracking
- Responsive Design

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MySQL (with in-memory fallback)
- Authentication: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- Node.js (v14+)
- MySQL Server (optional - fallback to in-memory storage available)

### Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd je-techhub
   ```

2. Install backend dependencies:
   ```
   cd auth-server
   npm install
   ```

3. Create a `.env` file in the `auth-server` directory (use `.env.example` as a template):
   ```
   PORT=5000
   JWT_SECRET=your_secure_jwt_secret_key
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_database_password
   DB_NAME=jetechhub
   ```

4. Start the server:
   ```
   npm run dev   # Development mode with auto-restart
   # or
   npm start     # Production mode
   ```

5. Open the frontend:
   - Simply open `index.html` in your browser, or
   - Use a simple HTTP server like `http-server` or `live-server`

## Deployment

### Backend Deployment Options

#### Render

1. Sign up for a [Render](https://render.com) account
2. Create a new Web Service and connect your repository
3. Set environment variables in the Render dashboard
4. Deploy

#### Railway

1. Sign up for a [Railway](https://railway.app) account
2. Create a new project and connect your repository
3. Add environment variables
4. Deploy

### Frontend Deployment Options

- Deploy to any static hosting service like Netlify, Vercel, or GitHub Pages
- Make sure to update the API endpoint in `js/authService.js` to point to your deployed backend

## Project Structure

```
je-techhub/
├── auth-server/             # Backend server
│   ├── middleware/          # Auth middleware
│   ├── server.js            # Main server file
│   ├── db.js                # Database connection
│   └── package.json         # Backend dependencies
├── css/                     # CSS files
├── images/                  # Image assets
├── js/                      # JavaScript files
│   └── authService.js       # Authentication service
├── index.html               # Home page
├── getStarted.html          # Login/Register page
├── dashboard.html           # User dashboard
└── README.md                # Project documentation
```

## API Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - Login a user
- `POST /api/refresh-token` - Refresh access token
- `GET /api/me` - Get current user profile (protected)
- `PUT /api/profile` - Update user profile (protected)
- `PUT /api/progress` - Update course progress (protected)
- `GET /api/courses` - Get all available courses

## License

This project is licensed under the MIT License
