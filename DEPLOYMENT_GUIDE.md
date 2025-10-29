# 🚀 EduGame4ALL - Deployment Guide

## Overview
Complete deployment guide for EduGame4ALL educational gaming platform.

## 📋 Prerequisites

### Required
- **Node.js**: v18+
- **npm**: v9+
- **MongoDB**: v6+ (local or Atlas)

### Optional (for AI features)
- **Python**: 3.10+ (for AI services)
- **CUDA**: For GPU-accelerated AI
- API keys: OpenAI or Anthropic

## 🔧 Environment Configuration

### 1. Server Environment Variables

Create `server/.env`:

```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# Database - Use MongoDB Atlas for production
DATABASE_URL=mongodb://localhost:27017/edugame4all
# Production example:
# DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/edugame4all?retryWrites=true&w=majority

# JWT Authentication (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
SESSION_SECRET=your-session-secret-minimum-32-characters-long

# AI Services (Optional - has intelligent fallback)
OPENAI_API_KEY=sk-...                    # Optional
ANTHROPIC_API_KEY=sk-ant-...             # Optional
AI_SERVICE_URL=http://localhost:8001     # URL to Python AI services

# CORS (adjust for your domain)
CORS_ORIGIN=https://yourdomain.com
```

### 2. Client Environment Variables

Create `client/.env`:

```bash
# API Configuration
VITE_API_URL=https://api.yourdomain.com
VITE_AI_SERVICE_URL=https://ai.yourdomain.com
```

### 3. AI Services (Optional)

Create `ai-services/.env`:

```bash
HUGGINGFACE_TOKEN=hf_...
OPENAI_API_KEY=sk-...
AI_SERVICE_PORT=8001
LLM_MODEL=meta-llama/Llama-3.1-8B-Instruct
USE_GPU=true
```

## 📦 Installation

### 1. Install Dependencies

```bash
# Install all dependencies (root, client, server, shared)
npm install
```

### 2. Build Shared Package

```bash
npm run shared-build
```

### 3. Build Server

```bash
cd server
npm run build
```

### 4. Build Client (for production)

```bash
cd client
npm run build
```

## 🗄️ Database Setup

### Option 1: Local MongoDB

```bash
# Install MongoDB Community Edition
# https://www.mongodb.com/docs/manual/installation/

# Start MongoDB
mongod --dbpath /path/to/data

# Seed database
npm run seed
```

### Option 2: MongoDB Atlas (Recommended for Production)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Update `DATABASE_URL` in `.env`
5. Whitelist your IP address
6. Run seed: `npm run seed`

## 🌱 Seeding Database

Populate with sample data:

```bash
npm run seed
```

This creates:
- **Admin user**: `admin@edugame4all.com` / `Admin@123`
- **Test users**: `user1@test.com`, `user2@test.com` / `Test@123`
- **15 games** across 3 categories
- **14 badges** across 4 categories
- **12 rewards** in 4 categories
- **50+ resources** (jobs, grants, services, news)

## 🚀 Running the Application

### Development Mode

```bash
# Run all services (shared, client, server)
npm run dev
```

This starts:
- **Client**: http://localhost:5173
- **Server**: http://localhost:3000
- **Shared**: Watch mode

### Production Mode

#### Server
```bash
cd server
npm start
# Or with PM2:
pm2 start dist/server.js --name edugame4all-api
```

#### Client (served by static hosting)
```bash
# Build client
cd client
npm run build

# Deploy dist/ folder to:
# - Vercel
# - Netlify
# - AWS S3 + CloudFront
# - Your preferred static host
```

#### AI Services (Optional)
```bash
cd ai-services
python api/main.py
# Or with gunicorn:
gunicorn -w 4 -k uvicorn.workers.UvicornWorker api.main:app -b 0.0.0.0:8001
```

## 🧪 Testing Features

### Test Scripts Available

```bash
# XP System
npm run test:xp

# Streak Tracking
npm run test:streak

# Games CRUD
npm run test:games

# Progress & Badges
npm run test:progress

# Challenges System
npm run test:challenges

# Resources Hub
npm run test:resources

# Rewards System
npm run test:rewards

# Dashboard
npm run test:dashboard

# Profile
npm run test:profile
```

### Manual Testing

1. **Register a user**: POST `/api/auth/register`
2. **Login**: POST `/api/auth/login`
3. **Browse games**: GET `/api/games`
4. **Play a game**: POST `/api/games/:id/session`
5. **Check progress**: GET `/api/progress/badges`
6. **View dashboard**: GET `/api/dashboard`

## 🐳 Docker Deployment (Alternative)

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: edugame4all

  api:
    build: ./server
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: mongodb://mongodb:27017/edugame4all
      NODE_ENV: production
    depends_on:
      - mongodb

  client:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - api

volumes:
  mongodb_data:
```

Run with:
```bash
docker-compose up -d
```

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to strong random string (32+ chars)
- [ ] Change `SESSION_SECRET` to strong random string
- [ ] Use HTTPS in production
- [ ] Configure CORS for your domain only
- [ ] Set `NODE_ENV=production`
- [ ] Enable MongoDB authentication
- [ ] Use environment variables, never commit secrets
- [ ] Set up rate limiting (already included)
- [ ] Configure firewall rules
- [ ] Regular database backups

## 📊 Monitoring & Logs

### Server Logs
```bash
# View logs with PM2
pm2 logs edugame4all-api

# Or standard output
npm start
```

### Database Monitoring
```bash
# MongoDB Atlas Dashboard
# Or use MongoDB Compass
```

## 🔧 Maintenance

### Database Cleanup

```bash
# Soft cleanup (keeps recent data)
npm run cleanup-db

# Full cleanup (removes old data)
npm run cleanup-db:all

# Complete reset (WARNING: deletes everything)
npm run cleanup-db:full
```

### Backup Database

```bash
# Export
mongodump --uri="mongodb://localhost:27017/edugame4all" --out=./backup

# Import
mongorestore --uri="mongodb://localhost:27017/edugame4all" ./backup/edugame4all
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB is running
mongosh mongodb://localhost:27017/edugame4all

# Check connection string format
# Ensure IP whitelist (Atlas)
# Verify credentials
```

### Build Errors
```bash
# Clear and rebuild
rm -rf node_modules package-lock.json
npm install
npm run shared-build
cd server && npm run build
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in .env
PORT=3001
```

## 📈 Performance Optimization

### Production Recommendations

1. **Enable MongoDB indexes** (already configured)
2. **Use connection pooling**
3. **Enable compression** for API responses
4. **Use Redis** for session storage (optional)
5. **CDN** for static assets
6. **Load balancer** for multiple server instances

### Caching Strategy

- Static assets: 1 year cache
- API responses: Case-by-case (some with short TTL)
- Database queries: Use aggregation pipelines

## 🆘 Support

### Documentation
- See all `*_IMPLEMENTATION.md` files in root
- Check `ai-services/README.md` for AI setup
- Review API endpoints in route files

### Test Credentials

**Admin:**
- Email: `admin@edugame4all.com`
- Password: `Admin@123`

**Test Users:**
- Email: `user1@test.com`, `user2@test.com`
- Password: `Test@123`

---

## 🎯 Quick Start Checklist

1. ✅ Install Node.js 18+
2. ✅ Install MongoDB
3. ✅ Clone repository
4. ✅ Run `npm install`
5. ✅ Create `.env` files (use `.env.example`)
6. ✅ Update `DATABASE_URL`
7. ✅ Run `npm run seed`
8. ✅ Run `npm run dev`
9. ✅ Access http://localhost:5173
10. ✅ Login with test credentials

**You're ready to go!** 🚀

---

Generated for EduGame4ALL - Hack4Edu 2025
