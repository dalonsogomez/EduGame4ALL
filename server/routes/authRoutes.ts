import express from 'express';
import { Request, Response } from 'express';
import UserService from '../services/userService';
import { requireUser } from './middlewares/auth';
import User from '../models/User';
import { UserProgress } from '../models/UserProgress';
import { generateAccessToken, generateRefreshToken } from '../utils/auth';
import jwt from 'jsonwebtoken';
import { ALL_ROLES } from 'shared';
import mongoose from 'mongoose';

const router = express.Router();

interface AuthRequest extends Request {
  user?: Record<string, unknown>;
}

router.post('/login', async (req: Request, res: Response) => {
  const sendError = (msg: string) => res.status(400).json({ message: msg });
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError('Email and password are required');
  }

  const user = await UserService.authenticateWithPassword(email, password);

  if (user) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();
    return res.json({...user.toObject(), accessToken, refreshToken});
  } else {
    return sendError('Email or password is incorrect');

  }
});

router.post('/register', async (req: AuthRequest, res: Response) => {
  if (req.user) {
    return res.json({ user: req.user });
  }
  try {
    console.log(`[AuthRoutes] Registering new user: ${req.body.email}`);
    const user = await UserService.create(req.body);

    // Create default user progress
    const userProgress = await UserProgress.findOne({ userId: user._id });
    if (!userProgress) {
      console.log(`[AuthRoutes] Creating default progress for user: ${user._id}`);
      await UserProgress.create({
        userId: new mongoose.Types.ObjectId(user._id.toString()),
        totalXP: 0,
        level: 1,
        streak: 0,
        lastActivityDate: new Date(),
        weeklyGoal: 5,
        weeklyProgress: 0,
        skills: {
          language: { xp: 0, level: 1 },
          culture: { xp: 0, level: 1 },
          softSkills: { xp: 0, level: 1 },
        },
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    console.log(`[AuthRoutes] User registered successfully: ${user._id}`);
    return res.status(200).json({ user: user.toObject(), token: accessToken, refreshToken });
  } catch (error) {
    console.error(`Error while registering user: ${error}`);
    return res.status(400).json({ error });
  }
});

router.post('/logout', async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.status(200).json({ message: 'User logged out successfully.' });
});

router.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token is required'
    });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as jwt.JwtPayload;

    // Find the user
    const user = await UserService.get(decoded.sub);

    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(403).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Update user's refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save();

    // Return new tokens
    return res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    console.error(`Token refresh error: ${errorMessage}`);

    if (errorName === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        message: 'Refresh token has expired'
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

router.get('/me', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  return res.status(200).json(req.user);
});

export default router;
