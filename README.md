# Task Management System

A full-stack web application for task management with user authentication, task CRUD operations, file uploads, and more.

## Features

- User authentication with JWT
- User management (CRUD operations)
- Task management (CRUD operations)
- File uploads (PDF documents)
- Task filtering and sorting
- Responsive UI with Tailwind CSS
- Dockerized application

## Tech Stack

### Frontend
- React
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- Multer (for file uploads)

### DevOps
- Docker
- Docker Compose

## Getting Started

### Prerequisites
- Docker and Docker Compose

### Installation

1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/task-management-system.git
cd task-management-system
\`\`\`

2. Start the application with Docker Compose
\`\`\`bash
docker-compose up
\`\`\`

3. Access the application
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Documentation

### Authentication Endpoints

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user

### User Endpoints

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user (admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Task Endpoints

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/:id/documents/:docId` - Get task document

## Testing

Run tests for the backend:

\`\`\`bash
cd backend
npm test
\`\`\`

## Project Structure

\`\`\`
task-management-system/
├── frontend/                # React frontend
│   ├── public/              # Public assets
│   ├── src/                 # Source files
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── redux/           # Redux store and slices
│   │   ├── App.jsx          # Main App component
│   │   └── index.jsx        # Entry point
│   ├── Dockerfile           # Frontend Docker configuration
│   └── package.json         # Frontend dependencies
├── backend/                 # Node.js backend
│   ├── config/              # Configuration files
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── tests/               # Test files
│   ├── uploads/             # Uploaded files
│   ├── Dockerfile           # Backend Docker configuration
│   └── package.json         # Backend dependencies
├── docker-compose.yml       # Docker Compose configuration
└── README.md                # Project documentation
\`\`\`

## License

This project is licensed under the MIT License.
# Assignment-18
