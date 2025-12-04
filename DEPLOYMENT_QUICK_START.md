# Quick Start: Deploy to Render

## 🚀 Fast Track Deployment (5 Steps)

### Step 1: Set Up MongoDB
- Create account at https://www.mongodb.com/cloud/atlas
- Create free cluster
- Copy connection string (MONGO_URI)
- Whitelist IP: `0.0.0.0/0` (allows all IPs)

### Step 2: Deploy Backend
1. Render Dashboard → New → Web Service
2. Connect repository
3. Settings:
   - **Name:** `afterschool-hub-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/health`
4. Environment Variables:
   ```
   NODE_ENV=production
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET=your-random-secret-key-min-32-chars
   JWT_EXPIRE=7d
   FRONTEND_URL=https://afterschool-hub-frontend.onrender.com
   ```
5. Deploy and copy backend URL

### Step 3: Deploy Frontend
1. Render Dashboard → New → Static Site
2. Connect repository
3. Settings:
   - **Name:** `afterschool-hub-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
   ```
5. Deploy and copy frontend URL

### Step 4: Update Backend CORS
- Go back to Backend service
- Update `FRONTEND_URL` with your actual frontend URL
- Service will auto-redeploy

### Step 5: Test
- Visit frontend URL
- Test login/registration
- Browse lessons
- Check browser console for errors

## ✅ Done!

For detailed instructions, see `RENDER_DEPLOYMENT.md`

