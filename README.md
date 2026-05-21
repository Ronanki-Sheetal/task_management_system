# TaskTrack - Enterprise Task Management System

A modern, full-stack task management application built with React and Node.js/Express. TaskTrack enables teams to efficiently organize, track, and collaborate on tasks with real-time updates, advanced analytics, and comprehensive admin controls.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![React](https://img.shields.io/badge/React-v18.2-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-v4.4+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🎯 Features

### Core Task Management
- ✅ **Create, Read, Update, Delete (CRUD)** tasks with full control
- 📊 **Multiple Task Views**: List view, Table view, and Kanban board
- 🏷️ **Task Organization**: Categories, tags, priorities (low, medium, high, urgent)
- 📅 **Due Dates & Scheduling**: Set deadlines and track progress
- 👤 **Task Assignment**: Assign tasks to team members
- 💬 **Comments & Collaboration**: Add comments on tasks for team discussion
- 📎 **Attachments**: Upload and manage task attachments
- 📈 **Progress Tracking**: Monitor task completion percentage

### Analytics & Insights
- 📊 **Dashboard Analytics**: Real-time task statistics and metrics
- 📉 **Performance Charts**: Visualize task completion trends
- 🎯 **Task Distribution**: Analyze task load across team members
- 📋 **Detailed Reports**: Export and analyze task data
- 🔍 **Daily Analytics**: Track daily task activity

### User Authentication & Authorization
- 🔐 **JWT-Based Authentication**: Secure token-based login
- 👤 **User Registration & Login**: Support for OAuth-ready architecture
- 🔑 **Password Management**: Reset password via email verification
- 👥 **Role-Based Access Control**: User and Admin roles with different permissions
- 📝 **User Profiles**: Customize user information and preferences

### Admin Features
- 👨‍💼 **Admin Dashboard**: Comprehensive admin panel
- 👥 **User Management**: View, manage, and control user accounts
- 📊 **System Analytics**: Monitor entire system performance
- 🔧 **Configuration Controls**: Manage system-wide settings

### Security & Performance
- 🛡️ **Helmet.js**: HTTP security headers
- 🚦 **Rate Limiting**: Prevent abuse with request rate limiting
- 🧹 **Input Sanitization**: Protection against NoSQL injection and XSS
- 🔐 **Password Hashing**: bcryptjs for secure password storage
- 📡 **Real-time Updates**: Socket.IO for instant notifications

### User Experience
- 🎨 **Modern UI**: Built with Tailwind CSS and Framer Motion
- 🔍 **Search Functionality**: Quick task search with filtering
- 🌓 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ⚡ **Fast Performance**: Optimized with Vite for rapid development

---

## 🏗️ Tech Stack

### Frontend
- **React 18.2** - UI library
- **React Router DOM 6** - Client-side routing
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Data visualization library
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications
- **React Beautiful DnD** - Drag and drop for Kanban
- **Vite** - Build tool
- **PostCSS & Autoprefixer** - CSS processing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB & Mongoose** - NoSQL database and ODM
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management
- **Helmet** - Security headers
- **Nodemailer** - Email sending
- **Express Rate Limit** - Rate limiting
- **Morgan** - HTTP logging
- **Nodemon** - Development auto-reload

---

## 📂 Project Structure

```
thiranex1/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── AnalyticsCard.jsx
│   │   │   ├── FilterDropdown.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskModal.jsx
│   │   │   └── TaskTable.jsx
│   │   ├── context/                # React Context for state management
│   │   │   ├── AuthContext.jsx     # Authentication state
│   │   │   └── TaskContext.jsx     # Task management state
│   │   ├── layouts/
│   │   │   └── AppLayout.jsx       # Main app layout wrapper
│   │   ├── pages/                  # Page components
│   │   │   ├── Dashboard.jsx       # Main dashboard
│   │   │   ├── AnalyticsPage.jsx   # Analytics page
│   │   │   ├── AdminPage.jsx       # Admin panel
│   │   │   ├── KanbanPage.jsx      # Kanban board view
│   │   │   ├── ProfilePage.jsx     # User profile
│   │   │   ├── LandingPage.jsx     # Home page
│   │   │   ├── NotFoundPage.jsx    # 404 page
│   │   │   ├── auth/               # Authentication pages
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── RegisterPage.jsx
│   │   │   │   ├── ForgotPasswordPage.jsx
│   │   │   │   └── ResetPasswordPage.jsx
│   │   │   └── tasks/              # Task-related pages
│   │   │       ├── TasksPage.jsx   # Task list page
│   │   │       └── TaskDetailPage.jsx
│   │   ├── services/               # API and Socket services
│   │   │   ├── api.js              # Axios API configuration
│   │   │   └── socket.js           # Socket.IO setup
│   │   ├── App.jsx                 # Main app component with routes
│   │   ├── main.jsx                # React DOM entry point
│   │   └── index.css               # Global styles
│   ├── package.json
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   └── postcss.config.js           # PostCSS configuration
│
├── server/                          # Node.js Backend
│   ├── config/
│   │   └── db.js                   # MongoDB connection setup
│   ├── controllers/                # Business logic
│   │   ├── authController.js       # Auth operations
│   │   ├── taskController.js       # Task CRUD operations
│   │   ├── userController.js       # User management
│   │   └── analyticsController.js  # Analytics logic
│   ├── middleware/                 # Express middleware
│   │   ├── auth.js                 # JWT authentication
│   │   ├── errorHandler.js         # Global error handling
│   │   ├── asyncHandler.js         # Async function wrapper
│   │   └── rateLimiter.js          # Rate limiting configuration
│   ├── models/                     # Mongoose schemas
│   │   ├── User.js                 # User schema with auth methods
│   │   └── Task.js                 # Task schema with relations
│   ├── routes/                     # API route handlers
│   │   ├── auth.js                 # Authentication routes
│   │   ├── tasks.js                # Task management routes
│   │   ├── users.js                # User management routes
│   │   └── analytics.js            # Analytics routes
│   ├── sockets/
│   │   └── taskSocket.js           # Socket.IO event handlers
│   ├── utils/
│   │   └── errorResponse.js        # Custom error response class
│   ├── server.js                   # Express app entry point
│   ├── package.json
│   └── .env                        # Environment variables
│
└── README.md                        # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18.0.0 or higher
- **MongoDB** v4.4 or higher (running locally or Atlas)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd thiranex1
```

#### 2. Setup Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=mongodb://localhost:27017/SheetalThiranex

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# Email (Optional - for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@tasktrack.com
```

#### 3. Install Server Dependencies
```bash
cd server
npm install
```

#### 4. Install Client Dependencies
```bash
cd ../client
npm install
```

---

## 🎮 Running the Project

### Start MongoDB
Before running the application, ensure MongoDB is running:

```bash
# If MongoDB is installed locally
mongod

# Or use MongoDB Atlas for cloud-based database
```

### Start the Backend Server
```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

### Start the Frontend Client (in another terminal)
```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173`

### Verify Everything is Running
- Visit `http://localhost:5173` in your browser
- Check server health: `http://localhost:5000/api/health`

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: { token, user }
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /auth/updateprofile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "avatar": "url-to-avatar"
}
```

### Task Endpoints

#### Get All Tasks
```http
GET /tasks?status=pending&priority=high&sortBy=dueDate
Authorization: Bearer <token>
```

#### Get Single Task
```http
GET /tasks/:id
Authorization: Bearer <token>
```

#### Create Task
```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive docs",
  "priority": "high",
  "dueDate": "2024-12-31",
  "category": "Documentation",
  "tags": ["docs", "important"]
}
```

#### Update Task
```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "in-progress",
  "progress": 50
}
```

#### Change Task Status
```http
PUT /tasks/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

#### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

#### Add Comment
```http
POST /tasks/:id/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "This task looks good!"
}
```

#### Get Task Statistics
```http
GET /tasks/stats
Authorization: Bearer <token>

Response: {
  total,
  pending,
  inProgress,
  completed,
  cancelled,
  byPriority,
  byCategory
}
```

### Analytics Endpoints

#### Get Daily Analytics
```http
GET /analytics/daily?days=7
Authorization: Bearer <token>
```

#### Get Task Metrics
```http
GET /analytics/metrics
Authorization: Bearer <token>
```

### User Endpoints

#### Get All Users (Admin Only)
```http
GET /users
Authorization: Bearer <token>
```

#### Get User by ID
```http
GET /users/:id
Authorization: Bearer <token>
```

---

## 💾 Database Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required, max 50),
  email: String (required, unique, validated),
  password: String (required, hashed, min 6),
  role: String (enum: ['user', 'admin'], default: 'user'),
  avatar: String,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  _id: ObjectId,
  title: String (required, max 200),
  description: String (max 2000),
  priority: String (enum: ['low', 'medium', 'high', 'urgent']),
  status: String (enum: ['pending', 'in-progress', 'completed', 'cancelled']),
  dueDate: Date,
  category: String (default: 'General'),
  tags: [String],
  assignedTo: ObjectId (ref: User),
  createdBy: ObjectId (ref: User, required),
  completedAt: Date,
  progress: Number (0-100),
  attachments: [{
    name: String,
    url: String,
    uploadedAt: Date
  }],
  comments: [{
    user: ObjectId (ref: User),
    text: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Security Features

1. **JWT Authentication** - Secure token-based authentication
2. **Password Hashing** - bcryptjs with salt rounds of 12
3. **Rate Limiting** - Prevent brute force attacks on auth endpoints
4. **CORS Protection** - Configure allowed origins
5. **Helmet.js** - Set security HTTP headers
6. **Input Sanitization** - Protect against NoSQL injection and XSS
7. **MongoDB Sanitization** - Prevent NoSQL injection attacks
8. **Environment Variables** - Never expose sensitive data

---

## 🎨 Key Features Explained

### Real-Time Updates with Socket.IO
Tasks update in real-time across all connected clients when changes are made:
```javascript
// Server emits updates
io.emit('task:updated', updatedTask);

// Client listens for updates
socket.on('task:updated', (task) => {
  updateLocalTaskData(task);
});
```

### Dashboard Analytics
The dashboard displays comprehensive task metrics:
- Total tasks count
- Tasks by status (Pending, In Progress, Completed, Cancelled)
- Tasks by priority distribution
- Task completion trends
- Team performance metrics

### Kanban Board
Organize tasks using a drag-and-drop Kanban board:
- Visual task organization by status
- Easy drag-and-drop status changes
- Quick task preview cards
- Intuitive workflow management

### Search & Filter
Powerful search and filtering capabilities:
- Full-text search across task titles and descriptions
- Filter by priority, status, category, dates
- Sort options (due date, created date, priority)
- Tag-based filtering

---

## 🛠️ Development

### Available Scripts

#### Server
```bash
npm run dev     # Start with nodemon (auto-restart)
npm start       # Start production server
npm test        # Run tests (when configured)
```

#### Client
```bash
npm run dev     # Start Vite dev server
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Run ESLint
```

### Code Organization Best Practices
- Components are modular and reusable
- Context API for global state management
- Separation of concerns (routes, controllers, models)
- Error handling with custom error classes
- Async/await for cleaner async code

---

## 📝 Environment Variables Reference

### Server `.env`
```
PORT              - Server port (default: 5000)
NODE_ENV          - Environment (development/production)
CLIENT_URL        - Frontend URL for CORS
MONGO_URI         - MongoDB connection string
JWT_SECRET        - JWT signing secret
JWT_EXPIRE        - Token expiration time
EMAIL_*           - Email configuration for password reset
```

### Client `.env.local` (if needed)
```
VITE_API_URL      - Backend API base URL
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check `MONGO_URI` in `.env` file
- Verify MongoDB is accessible on localhost:27017

### Port Already in Use
```bash
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# For port 5173
netstat -ano | findstr :5173
```

### CORS Errors
- Verify `CLIENT_URL` in server `.env`
- Check origin settings in Express CORS middleware
- Ensure client and server URLs match configuration

### Authentication Issues
- Clear browser cookies and localStorage
- Verify JWT_SECRET is set in `.env`
- Check token expiration settings

---

## 📦 Build & Deployment

### Build for Production

#### Server
```bash
cd server
npm install --production
```

#### Client
```bash
cd client
npm run build
```

Production files will be in `client/dist/`

### Environment for Production
Update `.env` for production:
```env
NODE_ENV=production
PORT=5000
JWT_EXPIRE=30d
```

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Sheetal Thiranex**
- GitHub: [@yourprofile]
- Email: sheetal@example.com

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

For issues, questions, or suggestions:
- Create an Issue on GitHub
- Email: support@tasktrack.com
- Documentation: [Full Docs](./docs)

---

## 🚀 Future Enhancements

- [ ] Team collaboration features
- [ ] Email notifications
- [ ] Advanced scheduling
- [ ] Time tracking integration
- [ ] File storage integration
- [ ] Mobile app
- [ ] Dark mode
- [ ] Automated task workflows
- [ ] API documentation with Swagger
- [ ] Unit and integration tests

---

**Happy Task Tracking! 🎉**

Last updated: May 21, 2026
