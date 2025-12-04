# API Migration Script Guide

This script migrates static data from the frontend store to the database by making HTTP requests to the API endpoints. This approach ensures all data goes through proper validation and business logic.

## Why Use API Migration?

✅ **Validates API endpoints** - Ensures all endpoints work correctly  
✅ **Tests business logic** - Data goes through all validation rules  
✅ **Real-world flow** - Simulates actual user interactions  
✅ **No direct DB access** - Uses only public API endpoints  
✅ **Error handling** - Catches API-level errors and validation issues  

## Prerequisites

1. **Backend server must be running**
   ```bash
   cd backend
   npm run dev
   ```

2. **Node.js 18+** (for built-in fetch API)

3. **MongoDB connection** configured and working

4. **API accessible** at `http://localhost:8080/api` (or set `API_BASE_URL` env variable)

## Usage

### Option 1: Using npm script (Recommended)
```bash
cd backend
npm run migrate:api
```

### Option 2: Direct execution
```bash
cd backend
node scripts/migrateViaAPI.js
```

### Option 3: With custom API URL
```bash
cd backend
API_BASE_URL=http://localhost:8080/api node scripts/migrateViaAPI.js
```

## What the Script Does

The script performs the following steps in order:

1. **Creates/Logs in as Admin**
   - Creates admin account if it doesn't exist
   - Logs in to get admin token

2. **Creates Categories** (requires admin)
   - Creates 8 categories: Music, Math, Science, Sports, Art, Technology, Language, Dance
   - Uses existing categories if they already exist

3. **Registers Teacher Users**
   - Creates 12 teacher user accounts via registration endpoint
   - All teachers use password: `teacher123`

4. **Creates Teacher Profiles** (requires teacher login)
   - Each teacher logs in
   - Creates their teacher profile with bio, credentials, etc.

5. **Creates Lessons** (requires teacher login)
   - Each teacher creates their lessons
   - Lessons are linked to categories and teacher profiles

6. **Registers Parent Users**
   - Creates 3 parent user accounts
   - All parents use password: `password123`

7. **Creates Enrollments & Reviews** (requires parent login)
   - Parents enroll in random lessons
   - Parents create reviews for enrolled lessons

## Data Created

- **8 Categories**
- **12 Teachers** (with user accounts and profiles)
- **12 Lessons**
- **3 Parent Users**
- **6-9 Sample Enrollments** (2-3 per parent)
- **6-9 Sample Reviews** (one per enrollment)

## Test Accounts

After migration, you can use these accounts:

### Admin
- **Email:** admin@afterschoolhub.com
- **Password:** admin123

### Parents
- **Email:** john@example.com
- **Password:** password123

- **Email:** sarah@example.com
- **Password:** password123

- **Email:** mike@example.com
- **Password:** password123

### Teachers
All teachers use: **Password:** teacher123

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

## Important Notes

⚠️ **Backend must be running** - The script makes HTTP requests to your API

⚠️ **Idempotent** - Can be run multiple times safely. Existing data will be reused.

⚠️ **No data deletion** - This script only creates data, it doesn't delete existing data

✅ **Safe to re-run** - If data already exists, the script will use it instead of creating duplicates

## Troubleshooting

### "Failed to connect to API"
- Ensure backend server is running on port 8080
- Check `API_BASE_URL` environment variable
- Verify network connectivity

### "Access token required" errors
- Check that authentication endpoints are working
- Verify JWT_SECRET is set in environment variables
- Ensure auth middleware is properly configured

### "Category/Teacher already exists" warnings
- This is normal - the script will use existing data
- No action needed

### "Failed to create lesson"
- Check that teacher profiles were created successfully
- Verify category IDs are correct
- Check lesson creation endpoint logs

### "Failed to create enrollment"
- Ensure lessons were created successfully
- Check enrollment endpoint validation
- Verify payment method validation

## Comparison: API Migration vs Direct DB Seeding

| Feature | API Migration | Direct DB Seeding |
|---------|--------------|-------------------|
| Validates API | ✅ Yes | ❌ No |
| Tests business logic | ✅ Yes | ❌ No |
| Requires running server | ✅ Yes | ❌ No |
| Speed | Slower | Faster |
| Error detection | API-level | DB-level only |
| Real-world testing | ✅ Yes | ❌ No |

## Next Steps

After migration:

1. **Verify data in frontend**
   - Start frontend: `cd ../frontend && npm run dev`
   - Browse lessons
   - Test login with test accounts

2. **Test API endpoints**
   - Use Postman or curl to test endpoints
   - Verify all CRUD operations work

3. **Check database**
   - Verify data in MongoDB
   - Check relationships between collections

## Customization

To modify the migration data:

1. Edit `backend/scripts/migrateViaAPI.js`
2. Modify the data arrays at the top of the file
3. Ensure backend server is running
4. Run the migration script again

## Environment Variables

- `API_BASE_URL` - Base URL for API (default: `http://localhost:8080/api`)
- `MONGO_URI` - MongoDB connection string (used by backend, not script)

