import dotenv from 'dotenv';
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import basicRoutes from './routes/index';
import authRoutes from './routes/authRoutes';
import gameRoutes from './routes/gameRoutes';
import progressRoutes from './routes/progressRoutes';
import rewardRoutes from './routes/rewardRoutes';
import resourceRoutes from './routes/resourceRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import profileRoutes from './routes/profileRoutes';
import challengeRoutes from './routes/challengeRoutes';
import xpRoutes from './routes/xpRoutes';
import streakRoutes from './routes/streakRoutes';
import { connectDB } from './config/database';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'REFRESH_TOKEN_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(`Error: Required environment variables missing: ${missingEnvVars.join(', ')}`);
  console.error('Please ensure all required variables are set in your .env file.');
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000;

// Pretty-print JSON responses
app.enable('json spaces');
// We want to be consistent with URL paths, so we enable strict routing
app.enable('strict routing');

// CORS configuration - restrict to specific origins in production
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security: Set request size limits to prevent DoS attacks
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
connectDB();

app.on("error", (error: Error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

// Basic Routes
app.use(basicRoutes);
// Authentication Routes
app.use('/api/auth', authRoutes);
// Profile Routes
app.use('/api/profile', profileRoutes);
// Game Routes
app.use('/api/games', gameRoutes);
// Progress Routes
app.use('/api/progress', progressRoutes);
// Reward Routes
app.use('/api/rewards', rewardRoutes);
// Resource Routes
app.use('/api/resources', resourceRoutes);
// Dashboard Routes
app.use('/api/dashboard', dashboardRoutes);
// Challenge Routes
app.use('/api/challenges', challengeRoutes);
// XP Routes
app.use('/api/xp', xpRoutes);
// Streak Routes
app.use('/api/streak', streakRoutes);

// If no routes handled the request, it's a 404
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Page not found.",
    path: req.path
  });
});

// Error handling middleware - must have 4 parameters
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(500).json({
    success: false,
    message: isDevelopment ? err.message : "There was an error serving your request.",
    ...(isDevelopment && { stack: err.stack })
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});