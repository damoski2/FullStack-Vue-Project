# Database Seeding Guide

This guide explains how to populate the MongoDB database with sample data.

## Overview

The seeding script (`seedMongoDB.js`) populates the database with:
- **8 Categories** (Music, Math, Science, Sports, Art, Technology, Language, Dance)
- **12 Teachers** (with user accounts)
- **12 Lessons** (linked to categories and teachers)
- **4 Parent/Admin Users** (test accounts)
- **~30 Sample Reviews**
- **~20 Sample Enrollments**

## Prerequisites

1. MongoDB connection configured in `backend/config/mongo.js`
2. Environment variables set (MONGO_URI)
3. All dependencies installed (`npm install`)

## Running the Seeding Script

### Option 1: Using npm script (Recommended)
```bash
cd backend
npm run seed:mongo
```

### Option 2: Direct execution
```bash
cd backend
node scripts/seedMongoDB.js
```

## What the Script Does

1. **Connects to MongoDB** using the configured connection string
2. **Clears existing data** from all collections (reviews, enrollments, lessons, teachers, categories, users)
3. **Creates Categories** - 8 different categories for lessons
4. **Creates Teacher Users** - Creates user accounts with role "teacher" and teacher profiles
5. **Creates Parent/Admin Users** - Test accounts for parents and admin
6. **Creates Lessons** - 12 lessons linked to categories and teachers
7. **Creates Sample Reviews** - Random reviews from parents for lessons
8. **Creates Sample Enrollments** - Random enrollments with various statuses

## Test Accounts

After seeding, you can use these accounts to login:

### Parent Accounts
- **Email:** john@example.com
- **Password:** password123

- **Email:** sarah@example.com
- **Password:** password123

### Admin Account
- **Email:** admin@afterschoolhub.com
- **Password:** admin123

### Teacher Accounts
All teachers use the same password:
- **Password:** teacher123
- **Emails:** [teacher-name]@afterschoolhub.com
  - sarah.johnson@afterschoolhub.com
  - michael.chen@afterschoolhub.com
  - emma.rodriguez@afterschoolhub.com
  - david.martinez@afterschoolhub.com
  - isabella.garcia@afterschoolhub.com
  - amanda.white@afterschoolhub.com
  - alex.thompson@afterschoolhub.com
  - sophia.anderson@afterschoolhub.com
  - jake.morrison@afterschoolhub.com
  - rachel.brooks@afterschoolhub.com
  - kevin.park@afterschoolhub.com
  - maria.santos@afterschoolhub.com

## Data Structure

### Categories
- Music 🎵
- Math 🧮
- Science 🔬
- Sports ⚽
- Art 🎨
- Technology 💻
- Language 🗣️
- Dance 💃

### Lessons Included
1. Piano Lessons for Beginners
2. Advanced Math & Problem Solving
3. Creative Art & Drawing
4. Soccer Skills Academy
5. Spanish for Kids
6. Science Explorers Lab
7. Coding & Game Development
8. Ballet & Contemporary Dance
9. Guitar Masterclass
10. Creative Writing Workshop
11. Robotics & Engineering
12. Tennis Academy

## Important Notes

⚠️ **Warning:** The seeding script will **DELETE ALL EXISTING DATA** in the database before inserting new data. Only run this in development environments.

✅ **Safe to re-run:** You can run the script multiple times. It will clear and repopulate the database each time.

## Troubleshooting

### Connection Error
If you get a MongoDB connection error:
1. Check your `MONGO_URI` environment variable
2. Ensure MongoDB is accessible
3. Verify network connectivity

### Duplicate Key Error
If you see duplicate key errors:
- The script should handle this, but if it persists, manually clear the database first

### Missing Data
If some data doesn't appear:
- Check the console output for any error messages
- Verify all models are properly imported
- Ensure MongoDB collections are accessible

## Next Steps

After seeding:
1. Start the backend server: `npm run dev`
2. Start the frontend: `cd ../frontend && npm run dev`
3. Login with one of the test accounts
4. Browse lessons, add to cart, and test enrollment flow

## Customization

To modify the seed data:
1. Edit `backend/scripts/seedMongoDB.js`
2. Modify the data arrays (categories, teachersData, lessonsData, etc.)
3. Run the seeding script again

