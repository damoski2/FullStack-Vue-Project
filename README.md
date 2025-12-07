# AfterSchool Hub - Full-Stack Application Submission

A comprehensive after-school classes marketplace platform built with Vue.js frontend and Node.js/Express backend with MongoDB Atlas.

## 📋 Submission Information

### Repository Links

#### Vue.js App
- **GitHub Repository**: https://github.com/damoski2/FullStack-Vue-Project.git
- **GitHub Pages**: https://afterschool-hub-frontend.onrender.com/

#### Express.js App
- **GitHub Repository**: https://github.com/damoski2/FullStack-Vue-Project.git
- **Deployed API (Render.com)**: https://fullstack-vue-project-10x2.onrender.com/api

### API Endpoint for All Lessons

The following endpoint returns all lessons from the deployed Express.js application:

**GET** `https://fullstack-vue-project-10x2.onrender.com/api/lessons`

This endpoint returns a JSON response with all available lessons including:
- Lesson details (title, description, price, duration, schedule)
- Teacher information
- Category information
- Enrollment data (students enrolled, max students)
- Ratings and reviews

Example response structure:
```json
{
  "success": true,
  "data": {
    "lessons": [
      {
        "id": "...",
        "title": "Piano Lessons for Beginners",
        "price": 45,
        "category_name": "Music",
        "teacher_name": "Sarah Johnson",
        ...
      }
    ],
    "pagination": {
      "totalItems": 12,
      "totalPages": 1
    }
  }
}
```

## 📦 Project Structure

```
sem1-project/
├── frontend/                    # Vue.js Application
│   ├── src/
│   │   ├── components/         # Vue components
│   │   ├── views/               # Page components
│   │   ├── router/              # Vue Router configuration
│   │   ├── store/               # State management
│   │   ├── services/            # API service layer
│   │   └── assets/              # Static assets
│   ├── public/                  # Public static files
│   ├── package.json             # Frontend dependencies
│   └── vite.config.js           # Vite configuration
│
├── backend/                     # Express.js Application
│   ├── config/                  # Database configuration
│   │   └── mongo.js             # MongoDB connection
│   ├── middleware/              # Express middleware
│   │   ├── auth.js              # Authentication middleware
│   │   ├── errorHandler.js      # Error handling
│   │   └── upload.js            # File upload handling
│   ├── models/                  # MongoDB Mongoose models
│   │   ├── User.js
│   │   ├── Lesson.js
│   │   ├── Category.js
│   │   ├── Teacher.js
│   │   ├── CartItem.js
│   │   ├── Enrollment.js
│   │   └── Review.js
│   ├── routes/                  # API routes
│   │   ├── auth.js              # Authentication routes
│   │   ├── lessons.js           # Lessons CRUD routes
│   │   ├── cart.js              # Cart management routes
│   │   ├── enrollment.js        # Enrollment/checkout routes
│   │   ├── categories.js        # Category routes
│   │   └── users.js             # User management routes
│   ├── scripts/                 # Database scripts
│   │   ├── seedMongoDB.js       # MongoDB seeding script
│   │   └── migrateViaAPI.js     # Migration script
│   ├── uploads/                 # File upload directory
│   ├── server.js                # Main server file
│   └── package.json             # Backend dependencies
│
├── README.md                    # This file
└── [MongoDB Collections]       # Exported collections (see below)
```

## 🗄️ MongoDB Atlas Collections

The following collections are exported from MongoDB Atlas and included in the submission:

### 1. **lessons** Collection
Contains all lesson/class data including:
- Lesson details (title, description, price, duration, schedule)
- Category and teacher references
- Enrollment information (students_enrolled, max_students)
- Availability status
- Ratings and reviews count
- Images and features

**Export Location**: `[Include path to exported lessons collection JSON file]`

### 2. **orders** Collection
Contains all enrollment/order records with the following **required minimal fields**:

#### Required Fields (as per module requirements):
- ✅ **name** (`student_name`): Student's full name
- ✅ **phone number** (`phone_number`): Contact phone number
- ✅ **lesson IDs** (`lesson_id`): Reference to lesson(s) - see note below
- ✅ **number of spaces** (`quantity`): Number of spaces/spots enrolled

#### Additional Fields:
- `user_id`: Reference to the user who placed the order
- `student_age`: Student's age
- `student_grade`: Student's grade level
- `special_notes`: Special requirements or notes
- `total_amount`: Total cost for this enrollment
- `payment_id`: Unique identifier grouping multiple enrollments into one order
- `payment_method`: Payment method used (card, paypal, bank_transfer)
- `payment_status`: Payment status (pending, paid, failed, refunded)
- `status`: Enrollment status (pending, confirmed, cancelled, completed)
- `enrolled_at`: Timestamp of enrollment
- `created_at`, `updated_at`: Automatic timestamps

**Order Structure Design**:
When a user checks out with multiple different lessons, the system creates **one enrollment record per lesson**, all sharing the same `payment_id`. This `payment_id` groups them into a single order. For example:
- Order with `payment_id: "abc-123"` contains:
  - Enrollment 1: `lesson_id: "lesson1"`, `quantity: 2` (2 spaces)
  - Enrollment 2: `lesson_id: "lesson2"`, `quantity: 1` (1 space)
  
This design allows:
- ✅ Multiple lesson IDs per order (via shared `payment_id`)
- ✅ Individual quantity tracking per lesson
- ✅ Flexible querying (by order via `payment_id` or by lesson via `lesson_id`)
- ✅ Proper normalization and data integrity

**Export Location**: `[Include path to exported orders collection JSON file]`

**Note**: The `orders` collection stores all order records. To retrieve a complete order with multiple lessons, query all orders with the same `payment_id`.

### Collection Export Instructions
Collections were exported using MongoDB Compass:
1. Connected to MongoDB Atlas cluster
2. Selected the database
3. Right-clicked on each collection
4. Selected "Export Collection"
5. Exported as JSON format
6. Included in submission zip file

## 📮 Postman Collection

A complete Postman collection is included in the submission with all API endpoints configured and tested.

**Postman Collection Location**: `[Include path to exported Postman collection JSON file]`

### Included API Requests

#### Authentication
- POST Register User
- POST Login User
- GET Current User
- PUT Update Profile
- POST Logout

#### Lessons
- GET All Lessons
- GET Lesson by ID
- GET Categories
- GET Featured Lessons
- POST Create Lesson (Teacher/Admin)
- PUT Update Lesson (Teacher/Admin)
- DELETE Lesson (Admin)

#### Cart Management
- GET User Cart
- POST Add to Cart
- PUT Update Cart Item
- DELETE Remove from Cart
- DELETE Clear Cart
- GET Cart Count

#### Enrollments
- POST Checkout/Process Enrollment
- GET User Enrollments
- GET Enrollment by ID
- PUT Cancel Enrollment
- GET Enrollment Summary

#### Users
- GET User Profile
- GET User Enrollments
- GET User Reviews
- POST Add Review
- GET User Dashboard

### Postman Export Instructions
The collection was exported from Postman:
1. Opened Postman application
2. Selected the collection
3. Clicked "..." menu
4. Selected "Export"
5. Chose "Collection v2.1" format
6. Exported as JSON file
7. Included in submission zip file

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v20.19.0 or higher
- npm or yarn
- MongoDB Atlas account (for production)
- Git

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd sem1-project
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd ../backend
   npm install
   ```

4. **Set up environment variables:**
   
   Create `backend/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/afterschool_hub
   ```

   Create `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

5. **Seed the database:**
   ```bash
   cd backend
   npm run seed
   ```

6. **Start the development servers:**
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

## 🎯 Key Features

### Frontend (Vue.js)
- ✅ Modern Vue.js 3 with Composition API
- ✅ Responsive design with Tailwind CSS
- ✅ Vue Router for navigation
- ✅ State management with reactive store
- ✅ Cart persistence with backend sync
- ✅ User authentication flow
- ✅ Lesson browsing and filtering
- ✅ Checkout and enrollment process
- ✅ Mobile-first responsive design

### Backend (Express.js)
- ✅ RESTful API with Express.js
- ✅ MongoDB Atlas integration with Mongoose
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ File upload support
- ✅ Input validation with express-validator
- ✅ Error handling middleware
- ✅ CORS configuration
- ✅ Cart and enrollment management
- ✅ Lesson spaces tracking

### Database (MongoDB Atlas)
- ✅ User management
- ✅ Lesson catalog
- ✅ Category organization
- ✅ Teacher profiles
- ✅ Cart items persistence
- ✅ Enrollment/order tracking
- ✅ Review system

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Users can register and login to access protected features.

### Test Accounts (after seeding)
- **Parent**: john@example.com / password123
- **Admin**: admin@afterschoolhub.com / admin123

## 📊 API Documentation

### Base URL
- **Local**: http://localhost:5000/api
- **Production**: https://fullstack-vue-project-10x2.onrender.com/api

### Main Endpoints

#### Lessons
- `GET /api/lessons` - Get all lessons (with filtering, pagination)
- `GET /api/lessons/:id` - Get single lesson details
- `GET /api/lessons/categories` - Get all categories
- `GET /api/lessons/featured` - Get featured lessons

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

#### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove` - Remove item from cart

#### Enrollments
- `POST /api/enrollments/checkout` - Process enrollment checkout
- `GET /api/enrollments` - Get user's enrollments
- `GET /api/enrollments/:id` - Get enrollment details

## 🛠️ Technology Stack

### Frontend
- Vue.js 3 (Composition API)
- Vue Router 4
- Tailwind CSS
- Vite
- Axios (via fetch API)

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose ODM
- JWT (jsonwebtoken)
- bcrypt
- express-validator
- multer (file uploads)

## 📝 Submission Checklist

- ✅ Vue.js App code in `frontend/` folder
- ✅ Express.js App code in `backend/` folder (without node_modules)
- ✅ README.md with all required links
- ✅ MongoDB collections exported (lessons, enrollments)
- ✅ Postman collection exported
- ✅ All code properly organized
- ✅ Submission zip file under 10MB

## 🔗 Important Links Summary

- **Vue.js GitHub Repository**: [Your Vue.js App GitHub Repository URL]
- **Vue.js GitHub Pages**: [Your Vue.js App GitHub Pages URL]
- **Express.js GitHub Repository**: [Your Express.js App GitHub Repository URL]
- **Express.js API (Render.com)**: https://fullstack-vue-project-10x2.onrender.com/api
- **Lessons Endpoint**: https://fullstack-vue-project-10x2.onrender.com/api/lessons

## 📄 License

This project is licensed under the MIT License.

---

**AfterSchool Hub** - Empowering after-school education with modern technology! 🎓✨

**Submission Date**: [Date]
**Student Name**: [Your Name]
**Course**: [Course Name]
