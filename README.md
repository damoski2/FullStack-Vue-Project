# AfterSchool Hub - Complete Full-Stack Application

A comprehensive after-school classes marketplace platform built with Vue.js frontend and Node.js/Express backend.

## 🎯 Project Overview

AfterSchool Hub is a full-stack web application that connects parents with quality after-school programs for their children. The platform features a modern Vue.js frontend with a robust Node.js/Express backend API.

### Key Features
- **Frontend**: Vue.js 3 with Composition API, Tailwind CSS, Vue Router
- **Backend**: Node.js/Express with SQLite database
- **Authentication**: JWT-based authentication system
- **Database**: SQLite with comprehensive schema
- **File Upload**: Image upload support for lessons
- **Payment Ready**: Integration-ready payment system
- **Responsive Design**: Mobile-first responsive design

## 📁 Project Structure

```
sem1-project/
├── src/                          # Vue.js frontend
│   ├── components/               # Vue components
│   ├── views/                    # Page components
│   ├── router/                   # Vue Router configuration
│   ├── store/                    # State management
│   └── assets/                   # Static assets
├── server/                       # Node.js backend
│   ├── config/                   # Database configuration
│   ├── middleware/                # Express middleware
│   ├── routes/                   # API routes
│   ├── scripts/                  # Database seeding
│   └── uploads/                  # File uploads
├── public/                       # Static files
├── package.json                  # Frontend dependencies
├── server/package.json           # Backend dependencies
└── start-backend.sh              # Backend startup script
```

## 🚀 Quick Start

### Prerequisites
- Node.js v20.19.0 or higher
- npm or yarn

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd sem1-project
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   npm run backend:install
   ```

4. **Set up backend environment:**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your configuration
   cd ..
   ```

5. **Seed the database:**
   ```bash
   npm run backend:seed
   ```

6. **Start both frontend and backend:**
   ```bash
   npm run full:dev
   ```

   Or start them separately:
   ```bash
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend
   npm run backend:dev
   ```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/health

## 🔧 Available Scripts

### Frontend Scripts
- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build

### Backend Scripts
- `npm run backend:install` - Install backend dependencies
- `npm run backend:dev` - Start backend development server
- `npm run backend:start` - Start backend production server
- `npm run backend:seed` - Seed database with sample data
- `npm run backend:setup` - Run backend setup script

### Full-Stack Scripts
- `npm run full:dev` - Start both frontend and backend
- `npm run full:build` - Build both frontend and backend

## 🎨 Frontend Features

### Pages & Components
- **Home Page**: Browse lessons with category filtering
- **Lesson Detail**: Detailed lesson information and enrollment
- **Cart**: Manage selected lessons
- **Checkout**: Complete enrollment process
- **Authentication**: Login and registration
- **Responsive Design**: Mobile-first approach

### State Management
- Vue 3 Composition API with reactive store
- Cart management with localStorage persistence
- User authentication state
- Lesson data management

### Styling
- Tailwind CSS for utility-first styling
- Responsive design with mobile breakpoints
- Modern UI components with hover effects
- Consistent color scheme and typography

## 🔌 Backend API Features

### Authentication System
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- User profile management

### Database Schema
- **Users**: User accounts and profiles
- **Teachers**: Instructor information
- **Categories**: Lesson categories
- **Lessons**: Course information
- **Cart Items**: Shopping cart management
- **Enrollments**: Student enrollments
- **Reviews**: User reviews and ratings

### API Endpoints
- **Authentication**: `/api/auth/*`
- **Lessons**: `/api/lessons/*`
- **Cart**: `/api/cart/*`
- **Enrollments**: `/api/enrollments/*`
- **Users**: `/api/users/*`

### Security Features
- CORS configuration
- Rate limiting
- Security headers with Helmet
- Input validation
- File upload security

## 🗄️ Database

### Sample Data
The database comes pre-seeded with:
- 8 categories (Music, Math, Science, Sports, Art, Technology, Language, Dance)
- 12 teachers with detailed profiles
- 12 sample lessons across all categories
- 4 test users (including admin account)

### Test Accounts
- **Parent**: john@example.com / password123
- **Admin**: admin@afterschoolhub.com / admin123

## 🔐 Authentication

### User Roles
- **parent** - Browse and enroll children
- **student** - Same as parent (for older students)
- **teacher** - Create and manage lessons
- **admin** - Full system access

### JWT Tokens
- Secure token-based authentication
- Configurable expiration time
- Automatic token validation

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px (Single column)
- **Tablet**: 640px - 1024px (2 columns)
- **Desktop**: > 1024px (3-4 columns)

### Features
- Mobile-first design approach
- Touch-friendly interface
- Optimized images and loading
- Smooth animations and transitions

## 🛠️ Development

### Frontend Development
```bash
npm run dev
```
- Hot module replacement
- Vue DevTools integration
- Tailwind CSS compilation
- TypeScript support ready

### Backend Development
```bash
npm run backend:dev
```
- Nodemon for auto-restart
- SQLite database
- File upload handling
- Comprehensive logging

### Database Management
```bash
npm run backend:seed
```
- Reset and seed database
- Sample data generation
- Test user creation

## 🚀 Production Deployment

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy `dist/` folder to your hosting service
3. Configure environment variables

### Backend Deployment
1. Set production environment variables
2. Use production database (PostgreSQL/MySQL)
3. Configure proper JWT secrets
4. Set up file storage (AWS S3, etc.)
5. Deploy to cloud platform (Heroku, AWS, etc.)

### Environment Variables
```env
# Backend (.env)
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=your-production-secret
JWT_EXPIRE=7d
DB_PATH=./database/afterschool_hub.db
```

## 📊 API Documentation

### Authentication Flow
1. Register/Login to get JWT token
2. Include token in Authorization header
3. Access protected endpoints

### Example API Calls
```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Get lessons
curl http://localhost:3000/api/lessons

# Add to cart (requires auth)
curl -X POST http://localhost:3000/api/cart/add \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"lesson_id":1,"quantity":1}'
```

## 🧪 Testing

### Manual Testing
1. Use test accounts provided
2. Test all user flows
3. Verify responsive design
4. Test API endpoints

### Health Checks
- Frontend: http://localhost:5173
- Backend: http://localhost:3000/health

## 🔄 Database Management

### Backup Database
```bash
cp server/database/afterschool_hub.db backup/
```

### Reset Database
```bash
npm run backend:seed
```

### Add New Data
- Modify `server/scripts/seedDatabase.js`
- Run seeding script
- Update API endpoints if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

### Common Issues
- **Port conflicts**: Change ports in configuration
- **Database errors**: Run `npm run backend:seed`
- **CORS issues**: Check FRONTEND_URL in .env
- **File uploads**: Ensure uploads directory exists

### Getting Help
- Check the README files
- Review API documentation
- Check console logs for errors
- Create an issue in the repository

---

**AfterSchool Hub** - Empowering after-school education with modern technology! 🎓✨