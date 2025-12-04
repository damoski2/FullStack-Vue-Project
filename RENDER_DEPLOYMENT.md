# Render Deployment Guide for AfterSchool Hub

This guide will walk you through deploying your AfterSchool Hub application to Render.

## 📋 Prerequisites

1. A Render account (sign up at https://render.com)
2. MongoDB Atlas account (or use Render's MongoDB service)
3. Git repository (GitHub, GitLab, or Bitbucket)

## 🏗️ Architecture Overview

You'll deploy two separate services on Render:
1. **Backend Service** - Node.js/Express API
2. **Frontend Service** - Vue.js static site

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your MongoDB Database

1. **Option A: MongoDB Atlas (Recommended)**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get your connection string (MONGO_URI)
   - Whitelist Render IPs (0.0.0.0/0 for development)

2. **Option B: Render MongoDB**
   - In Render dashboard, create a new MongoDB service
   - Copy the connection string

### Step 2: Deploy Backend Service

1. **Create New Web Service**
   - Go to Render Dashboard → New → Web Service
   - Connect your Git repository
   - Select the repository

2. **Configure Backend Service:**
   ```
   Name: afterschool-hub-backend
   Environment: Node
   Region: Choose closest to your users
   Branch: main (or your main branch)
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

3. **Set Environment Variables:**
   Click "Environment" tab and add:
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters
   JWT_EXPIRE=7d
   FRONTEND_URL=https://your-frontend-service.onrender.com
   ```
   **Important:** Replace `your-frontend-service.onrender.com` with your actual frontend URL (you'll get this after deploying frontend)

4. **Advanced Settings:**
   - Auto-Deploy: Yes
   - Health Check Path: `/health`

5. **Click "Create Web Service"**
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://afterschool-hub-backend.onrender.com`)

### Step 3: Deploy Frontend Service

1. **Create New Static Site**
   - Go to Render Dashboard → New → Static Site
   - Connect your Git repository
   - Select the repository

2. **Configure Frontend Service:**
   ```
   Name: afterschool-hub-frontend
   Branch: main (or your main branch)
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **Set Environment Variables:**
   Click "Environment" tab and add:
   ```
   VITE_API_BASE_URL=https://your-backend-service.onrender.com/api
   ```
   **Important:** Replace `your-backend-service.onrender.com` with your actual backend URL from Step 2

4. **Click "Create Static Site"**
   - Wait for build and deployment to complete
   - Copy your frontend URL (e.g., `https://afterschool-hub-frontend.onrender.com`)

### Step 4: Update CORS Configuration

1. Go back to your **Backend Service** settings
2. Update the `FRONTEND_URL` environment variable with your actual frontend URL:
   ```
   FRONTEND_URL=https://afterschool-hub-frontend.onrender.com
   ```
3. Render will automatically redeploy with the new setting

### Step 5: Verify Deployment

1. **Test Backend:**
   - Visit: `https://your-backend.onrender.com/health`
   - Should return: `{"status":"OK","message":"AfterSchool Hub API is running",...}`

2. **Test Frontend:**
   - Visit: `https://your-frontend.onrender.com`
   - Should load your Vue.js application

3. **Test API Connection:**
   - Try logging in or browsing lessons
   - Check browser console for any CORS errors

## 🔧 Using render.yaml (Alternative Method)

If you prefer using a configuration file, you can use the `render.yaml` file included in this project.

1. Push `render.yaml` to your repository
2. In Render Dashboard → New → Blueprint
3. Connect your repository
4. Render will automatically detect and use `render.yaml`

**Note:** You'll still need to set environment variables manually in the Render dashboard.

## 📝 Environment Variables Reference

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (Render sets this automatically) | `10000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key-32-chars-min` |
| `JWT_EXPIRE` | JWT token expiration | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-frontend.onrender.com` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `https://your-backend.onrender.com/api` |

## 🐛 Troubleshooting

### Backend Issues

1. **Build Fails**
   - Check build logs in Render dashboard
   - Ensure `package.json` has correct scripts
   - Verify Node.js version compatibility

2. **Database Connection Errors**
   - Verify `MONGO_URI` is correct
   - Check MongoDB Atlas IP whitelist (should allow 0.0.0.0/0)
   - Ensure MongoDB cluster is running

3. **CORS Errors**
   - Verify `FRONTEND_URL` matches your frontend URL exactly
   - Check backend logs for CORS errors
   - Ensure no trailing slashes in URLs

### Frontend Issues

1. **Build Fails**
   - Check build logs
   - Verify all dependencies are in `package.json`
   - Check for TypeScript/ESLint errors

2. **API Calls Fail**
   - Verify `VITE_API_BASE_URL` is set correctly
   - Check browser console for errors
   - Ensure backend is running and accessible

3. **404 Errors on Routes**
   - This is normal for Vue Router
   - Render Static Sites need special configuration
   - See "Handling Vue Router" section below

### Handling Vue Router (SPA Routing)

Vue Router uses client-side routing, which can cause 404 errors on direct URL access. To fix this:

1. In Render Dashboard → Static Site → Settings
2. Add a **Redirect/Rewrite** rule:
   ```
   Source: /*
   Destination: /index.html
   Status Code: 200
   ```

Or create a `_redirects` file in your `frontend/public` folder (already included in this project).

## 🔒 Security Best Practices

1. **JWT Secret:**
   - Use a strong, random secret (minimum 32 characters)
   - Never commit secrets to Git
   - Use Render's environment variables

2. **MongoDB:**
   - Use strong database passwords
   - Restrict IP access when possible
   - Enable MongoDB Atlas authentication

3. **CORS:**
   - Only allow your frontend domain
   - Don't use wildcards in production

4. **Environment Variables:**
   - Never expose sensitive data
   - Use Render's secure environment variable storage

## 📊 Monitoring

1. **Logs:**
   - View logs in Render Dashboard → Your Service → Logs
   - Monitor for errors and performance issues

2. **Health Checks:**
   - Backend has `/health` endpoint
   - Render automatically monitors this

3. **Metrics:**
   - Render provides basic metrics in dashboard
   - Monitor CPU, memory, and response times

## 🚀 Post-Deployment

1. **Seed Database (Optional):**
   - SSH into backend service (if available)
   - Or create a one-time script endpoint
   - Run: `npm run seed:mongo`

2. **Test All Features:**
   - User registration/login
   - Browse lessons
   - Add to cart
   - Checkout process
   - Teacher profiles

3. **Set Up Custom Domain (Optional):**
   - In Render Dashboard → Your Service → Settings
   - Add custom domain
   - Update DNS records
   - Update `FRONTEND_URL` and `VITE_API_BASE_URL` accordingly

## 💰 Render Pricing

- **Free Tier:** Available for both Web Services and Static Sites
- **Limitations:** 
  - Services spin down after 15 minutes of inactivity
  - First request after spin-down may be slow
- **Paid Plans:** Start at $7/month for always-on services

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/getting-started/)
- [Vue.js Deployment Guide](https://vuejs.org/guide/scaling-up/deployment.html)

## ✅ Deployment Checklist

- [ ] MongoDB database set up and accessible
- [ ] Backend service deployed and healthy
- [ ] Frontend service deployed
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] Vue Router redirects configured
- [ ] Health check endpoint working
- [ ] API calls working from frontend
- [ ] Authentication flow tested
- [ ] Database seeded (if needed)
- [ ] Custom domain configured (optional)

---

**Need Help?** Check Render's logs and documentation, or review the troubleshooting section above.

