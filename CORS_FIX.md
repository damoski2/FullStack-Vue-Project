# CORS Error Fix Guide

## Problem
Your frontend is getting CORS errors when trying to call the backend API, even though the API works fine in Postman.

## Root Cause
The backend's CORS configuration needs to explicitly allow your frontend's origin (`https://afterschool-hub-frontend.onrender.com`).

## Solution

### Step 1: Update Backend Environment Variables in Render

1. Go to your **Backend Service** in Render Dashboard
2. Click **Settings** → **Environment**
3. Add or update the `FRONTEND_URL` variable:
   ```
   FRONTEND_URL=https://afterschool-hub-frontend.onrender.com
   ```
   **Important:** Replace `afterschool-hub-frontend.onrender.com` with your actual frontend URL if it's different.

4. **Save** - Render will automatically redeploy

### Step 2: Verify Frontend Environment Variable

1. Go to your **Frontend Service** in Render Dashboard
2. Click **Settings** → **Environment**
3. Ensure `VITE_API_BASE_URL` is set to your backend URL:
   ```
   VITE_API_BASE_URL=https://your-backend-service.onrender.com/api
   ```
   **Important:** Replace `your-backend-service.onrender.com` with your actual backend URL.

### Step 3: Test

1. Wait for both services to redeploy (check the "Events" tab)
2. Visit your frontend URL
3. Open browser DevTools → Network tab
4. Try loading the page - API calls should now work without CORS errors

## Why Postman Works But Browser Doesn't

- **Postman**: Doesn't enforce CORS (it's a tool, not a browser)
- **Browser**: Enforces CORS security policy - backend must explicitly allow the frontend origin

## Updated CORS Configuration

The backend code has been updated to:
- Allow multiple origins (your frontend URL + localhost for development)
- Handle requests with no origin (like Postman)
- Include proper headers and methods

## Troubleshooting

If you still see CORS errors:

1. **Check backend logs** in Render Dashboard → Logs
   - Look for "CORS: Blocked origin" messages
   - Verify the frontend URL matches exactly

2. **Verify URLs match exactly:**
   - Frontend URL: `https://afterschool-hub-frontend.onrender.com` (no trailing slash)
   - Backend URL: `https://your-backend.onrender.com` (no trailing slash)
   - `FRONTEND_URL` should match frontend URL exactly
   - `VITE_API_BASE_URL` should be `https://your-backend.onrender.com/api`

3. **Clear browser cache** - Old CORS errors might be cached

4. **Check browser console** for exact error message

## Quick Checklist

- [ ] `FRONTEND_URL` set in backend environment variables
- [ ] `VITE_API_BASE_URL` set in frontend environment variables  
- [ ] Both services redeployed after environment variable changes
- [ ] URLs match exactly (no trailing slashes, correct protocol https://)
- [ ] Browser cache cleared

