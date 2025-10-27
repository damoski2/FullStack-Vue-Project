# AfterSchool Hub Backend API

A comprehensive Node.js/Express backend API for the AfterSchool Hub - an after-school classes marketplace platform.

## 🚀 Features

### Authentication & User Management
- User registration and login with JWT tokens
- Password hashing with bcrypt
- Role-based access control (parent, student, teacher, admin)
- User profile management
- Password change functionality

### Lessons Management
- Complete CRUD operations for lessons
- Category-based filtering
- Search functionality
- Featured lessons
- Teacher and category associations
- Image upload support
- Rating and review system

### Cart & Enrollment System
- Add/remove items from cart
- Quantity management
- Cart persistence
- Enrollment processing
- Payment integration ready
- Student information collection

### Database & Security
- SQLite database with comprehensive schema
- Data validation with express-validator
- CORS configuration
- Rate limiting
- Security headers with Helmet
- File upload handling

## 📁 Project Structure

```
server/
├── config/
│   └── database.js          # Database configuration and helpers
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── errorHandler.js       # Error handling middleware
│   └── upload.js            # File upload middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── lessons.js           # Lessons CRUD routes
│   ├── cart.js              # Cart management routes
│   ├── enrollment.js        # Enrollment/checkout routes
│   └── users.js             # User management routes
├── scripts/
│   └── seedDatabase.js      # Database seeding script
├── uploads/                  # File upload directory
├── database/                 # SQLite database files
├── server.js                 # Main server file
└── package.json              # Dependencies and scripts
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v20.19.0 or higher)
- npm or yarn

### Installation

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   DB_PATH=./database/afterschool_hub.db
   ```

4. **Seed the database:**
   ```bash
   npm run seed
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

### Lessons
- `GET /api/lessons` - Get all lessons (with filtering)
- `GET /api/lessons/categories` - Get all categories
- `GET /api/lessons/featured` - Get featured lessons
- `GET /api/lessons/:id` - Get single lesson
- `POST /api/lessons` - Create lesson (Teacher/Admin)
- `PUT /api/lessons/:id` - Update lesson (Teacher/Admin)
- `DELETE /api/lessons/:id` - Delete lesson (Admin)

### Cart Management
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart
- `GET /api/cart/count` - Get cart item count

### Enrollments
- `POST /api/enrollments/checkout` - Process enrollment checkout
- `GET /api/enrollments` - Get user's enrollments
- `GET /api/enrollments/:id` - Get single enrollment
- `PUT /api/enrollments/:id/cancel` - Cancel enrollment
- `GET /api/enrollments/summary` - Get enrollment summary

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users/enrollments` - Get user's enrollments
- `GET /api/users/reviews` - Get user's reviews
- `POST /api/users/reviews` - Add review
- `GET /api/users/dashboard` - Get user dashboard
- `GET /api/users` - Get all users (Admin)

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRE` - JWT expiration time
- `DB_PATH` - SQLite database path
- `MAX_FILE_SIZE` - Maximum file upload size

### Database Schema

#### Users Table
- id, name, email, password, role, phone, address, city, state, zip
- created_at, updated_at

#### Teachers Table
- id, name, title, avatar, bio, credentials, experience_years
- rating, total_reviews, created_at, updated_at

#### Categories Table
- id, name, description, icon, created_at

#### Lessons Table
- id, title, category_id, teacher_id, price, price_unit
- rating, reviews, duration, schedule, age_group
- students_enrolled, max_students, description, image, features
- featured, available, created_at, updated_at

#### Cart Items Table
- id, user_id, lesson_id, quantity, created_at

#### Enrollments Table
- id, user_id, lesson_id, student_name, student_age, student_grade
- special_notes, quantity, total_amount, status, payment_status
- payment_method, payment_id, enrolled_at

#### Reviews Table
- id, user_id, lesson_id, rating, comment, created_at

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **parent** - Can browse, enroll, and manage their children's enrollments
- **student** - Same as parent (for older students)
- **teacher** - Can create and manage lessons
- **admin** - Full access to all features

## 📝 Example Usage

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "parent"
  }'
```

### Get all lessons
```bash
curl http://localhost:5000/api/lessons
```

### Add item to cart (requires authentication)
```bash
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "lesson_id": 1,
    "quantity": 1
  }'
```

## 🧪 Testing

### Test Accounts (after seeding)
- **Parent**: john@example.com / password123
- **Admin**: admin@afterschoolhub.com / admin123

### Health Check
```bash
curl http://localhost:5000/health
```

## 🚀 Production Deployment

1. **Set production environment variables**
2. **Use a production database (PostgreSQL/MySQL)**
3. **Set up proper JWT secrets**
4. **Configure CORS for production domain**
5. **Set up file storage (AWS S3, etc.)**
6. **Add monitoring and logging**
7. **Set up SSL/HTTPS**

## 🔄 Database Seeding

The database comes with sample data including:
- 8 categories (Music, Math, Science, Sports, Art, Technology, Language, Dance)
- 12 teachers with profiles and credentials
- 12 sample lessons across all categories
- 4 test users (including admin)

To reseed the database:
```bash
npm run seed
```

## 📊 API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if any)
  ]
}
```

## 🔧 Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed the database with sample data

### Adding New Features
1. Create route files in `routes/` directory
2. Add middleware in `middleware/` directory
3. Update database schema in `config/database.js`
4. Add validation with express-validator
5. Update API documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the example requests

---

**AfterSchool Hub Backend API** - Powering the future of after-school education! 🎓
