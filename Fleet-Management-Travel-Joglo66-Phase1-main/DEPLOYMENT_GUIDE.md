# 🚀 Fleet Management Deployment Guide
## Free Tier Deployment (For Campus Thesis Project)

This guide will help you deploy the Fleet Management application using **completely free tiers** of Railway (Backend), Vercel (Frontend), and MongoDB Atlas (Database).

---

## 📋 Prerequisites
- GitHub account
- MongoDB Atlas account (free)
- Railway account (free - 500 hours/month)
- Vercel account (free)

---

## 🗄️ Step 1: Set up MongoDB Atlas (Free Tier)

### 1.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Choose the **FREE M0 cluster** (512MB storage)

### 1.2 Create a Cluster
1. Click "Build a Database"
2. Choose **FREE Shared** tier
3. Select your nearest region (e.g., Singapore for Indonesia)
4. Cluster Name: `fleet-management` (or any name)
5. Click "Create"

### 1.3 Set Up Database Access
1. Go to "Database Access" in left menu
2. Click "Add New Database User"
3. Username: `fleetadmin` (or any)
4. Password: Generate a strong password (SAVE THIS!)
5. Database User Privileges: Select "Read and write to any database"
6. Click "Add User"

### 1.4 Set Up Network Access
1. Go to "Network Access" in left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This is necessary for Railway and Vercel to connect
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Database" → Click "Connect" on your cluster
2. Choose "Connect your application"
3. Driver: Python, Version: 3.12 or later
4. Copy the connection string, it looks like:
   ```
   mongodb+srv://fleetadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name at the end: `mongodb+srv://fleetadmin:yourpassword@cluster0.xxxxx.mongodb.net/fleet_management?retryWrites=true&w=majority`
7. **SAVE THIS CONNECTION STRING** - you'll need it for Railway

---

## 🚂 Step 2: Deploy Backend to Railway

### 2.1 Prepare Your Repository
1. Push your code to GitHub (if not already):
   ```bash
   cd /app
   git init
   git add .
   git commit -m "Initial commit for deployment"
   git remote add origin https://github.com/yourusername/fleet-management.git
   git push -u origin main
   ```

### 2.2 Sign Up for Railway
1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize Railway to access your repositories

### 2.3 Deploy Backend
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Select your fleet-management repository
4. Railway will auto-detect Python

### 2.4 Configure Environment Variables
1. Go to your project → Backend service → Variables
2. Add these environment variables:
   ```
   MONGO_URL = mongodb+srv://fleetadmin:yourpassword@cluster0.xxxxx.mongodb.net/fleet_management?retryWrites=true&w=majority
   DB_NAME = fleet_management
   CORS_ORIGINS = *
   PORT = 8001
   ```
3. Click "Add" for each variable

### 2.5 Configure Start Command
1. In Railway, go to Settings
2. Under "Deploy", set:
   - **Root Directory**: `/backend`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port ${PORT}`
3. Save settings

### 2.6 Create Procfile (if needed)
Create `/app/backend/Procfile`:
```
web: uvicorn server:app --host 0.0.0.0 --port ${PORT}
```

### 2.7 Get Railway Backend URL
1. After deployment, go to Settings → Domains
2. Click "Generate Domain"
3. You'll get a URL like: `https://your-app.railway.app`
4. **SAVE THIS URL** - you'll need it for Vercel

---

## 🔷 Step 3: Deploy Frontend to Vercel

### 3.1 Sign Up for Vercel
1. Go to https://vercel.com/signup
2. Sign up with GitHub
3. Authorize Vercel

### 3.2 Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Vercel will auto-detect React

### 3.3 Configure Build Settings
1. **Framework Preset**: Create React App
2. **Root Directory**: `frontend`
3. **Build Command**: `yarn build`
4. **Output Directory**: `build`

### 3.4 Set Environment Variables
1. Before deployment, add environment variable:
   ```
   REACT_APP_BACKEND_URL = https://your-app.railway.app
   ```
   (Use the Railway URL from Step 2.7)
2. Click "Deploy"

### 3.5 Get Frontend URL
After deployment, you'll get a URL like:
```
https://fleet-management.vercel.app
```

---

## 🔧 Step 4: Update CORS Settings

### 4.1 Update Railway Environment
1. Go back to Railway → Your backend project → Variables
2. Update `CORS_ORIGINS` to your Vercel URL:
   ```
   CORS_ORIGINS = https://fleet-management.vercel.app
   ```
3. Save and redeploy

---

## ✅ Step 5: Test Deployment

### 5.1 Test Backend
```bash
curl https://your-app.railway.app/api/
```
Should return: `{"message":"Fleet Management API v1.0"}`

### 5.2 Test Frontend
1. Visit your Vercel URL: `https://fleet-management.vercel.app`
2. Try logging in or accessing different pages
3. Check browser console for any errors

---

## 📊 Free Tier Limits

| Service | Free Tier | Limit |
|---------|-----------|-------|
| **MongoDB Atlas** | M0 Cluster | 512 MB storage, Shared CPU |
| **Railway** | Hobby Plan | 500 execution hours/month, $5 credit |
| **Vercel** | Free | 100 GB bandwidth, Unlimited deployments |

### Tips for Staying Within Limits:
- MongoDB: 512MB is enough for thousands of records
- Railway: 500 hours = ~20 days. App sleeps when inactive, wakes on request
- Vercel: Generous bandwidth, perfect for thesis demo

---

## 🔄 Auto-Deploy Setup

Both Railway and Vercel support auto-deployment:

1. **Railway**: Automatically redeploys on push to `main` branch
2. **Vercel**: Automatically redeploys on push to `main` branch

Every time you push to GitHub, both frontend and backend will automatically update!

---

## 🐛 Troubleshooting

### Backend won't start on Railway
- Check logs in Railway dashboard
- Verify `requirements.txt` has all dependencies
- Ensure `MONGO_URL` is correct

### Frontend can't connect to backend
- Check `REACT_APP_BACKEND_URL` in Vercel
- Verify CORS settings in Railway
- Check browser console for errors

### Database connection fails
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check username/password in connection string
- Ensure database user has correct permissions

---

## 📝 Important Files for Deployment

### Backend `/app/backend/requirements.txt`
```
fastapi==0.115.5
uvicorn==0.32.1
motor==3.6.0
python-dotenv==1.0.1
pydantic==2.10.3
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.20
```

### Backend `/app/backend/Procfile`
```
web: uvicorn server:app --host 0.0.0.0 --port ${PORT}
```

---

## 🎓 For Your Thesis Defense

When presenting, mention:
- ✅ Cloud-hosted production application
- ✅ Secure MongoDB Atlas database
- ✅ Scalable microservices architecture (FastAPI + React)
- ✅ CI/CD pipeline with GitHub auto-deployment
- ✅ CORS and security best practices implemented

---

## 💡 Cost Breakdown
- **Total Monthly Cost**: **$0 (FREE)** ✅
- Perfect for thesis/campus project!

---

## 🆘 Need Help?
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://www.mongodb.com/docs/atlas

---

**Good luck with your thesis defense! 🎓**
