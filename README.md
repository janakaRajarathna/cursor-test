# Student Assignment Marks Analyzing & Management System

A web-based system for managing student assignments, grading, and performance analytics.

## Features

- Secure login system for lecturers and students
- Online assignment submission (PDF/DOCX)
- Online marking system with feedback
- Performance analytics with graphical reports
- Role-based access control

## Prerequisites

- Node.js (v14 or higher)
- MySQL
- Modern web browser

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=assignment_system
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```
4. Set up the database using the SQL scripts in the `database` folder
5. Start the server:
   ```bash
   npm run dev
   ```

## Project Structure

```
├── public/           # Static files
├── src/
│   ├── config/      # Configuration files
│   ├── controllers/ # Route controllers
│   ├── models/      # Database models
│   ├── routes/      # API routes
│   └── utils/       # Utility functions
├── views/           # Frontend views
├── database/        # Database scripts
└── server.js        # Main application file
```

## API Endpoints

### Authentication
- POST /api/auth/login
- POST /api/auth/register

### Assignments
- GET /api/assignments
- POST /api/assignments
- GET /api/assignments/:id
- PUT /api/assignments/:id
- DELETE /api/assignments/:id

### Submissions
- POST /api/submissions
- GET /api/submissions
- GET /api/submissions/:id
- PUT /api/submissions/:id

### Analytics
- GET /api/analytics/student/:id
- GET /api/analytics/class/:id

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 