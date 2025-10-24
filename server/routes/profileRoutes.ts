import { Router, Request, Response } from 'express';
import { requireUser } from './middlewares/auth';
import ProfileService, { UpdateProfileData } from '../services/profileService';

const router = Router();

// Description: Get current user profile with personal information, XP, level, and streak
// Endpoint: GET /api/profile
// Request: {} (requires authentication)
// Response: { profile: UserProfileResponse }
router.get('/', requireUser(), async (req: Request, res: Response) => {
  try {
    console.log(`[ProfileRoutes] GET /api/profile - User: ${req.user._id}`);

    const profile = await ProfileService.getUserProfile(req.user._id.toString());

    console.log(`[ProfileRoutes] Successfully retrieved profile for user: ${req.user._id}`);
    res.status(200).json({ profile });
  } catch (error: any) {
    console.error(`[ProfileRoutes] Error retrieving profile:`, error);
    res.status(500).json({
      error: 'Failed to retrieve profile',
      message: error.message
    });
  }
});

// Description: Update user profile including personal information and language preferences
// Endpoint: PUT /api/profile
// Request: { name?: string, location?: string, nativeLanguage?: string, targetLanguage?: string, profilePhoto?: string, age?: number, userType?: 'child' | 'adult' | 'educator' }
// Response: { profile: UserProfileResponse }
router.put('/', requireUser(), async (req: Request, res: Response) => {
  try {
    console.log(`[ProfileRoutes] PUT /api/profile - User: ${req.user._id}`);

    const updateData: UpdateProfileData = {
      name: req.body.name,
      location: req.body.location,
      nativeLanguage: req.body.nativeLanguage,
      targetLanguage: req.body.targetLanguage,
      profilePhoto: req.body.profilePhoto,
      age: req.body.age,
      userType: req.body.userType,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof UpdateProfileData] === undefined) {
        delete updateData[key as keyof UpdateProfileData];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: 'No valid fields provided for update'
      });
    }

    const profile = await ProfileService.updateUserProfile(
      req.user._id.toString(),
      updateData
    );

    console.log(`[ProfileRoutes] Successfully updated profile for user: ${req.user._id}`);
    res.status(200).json({ profile });
  } catch (error: any) {
    console.error(`[ProfileRoutes] Error updating profile:`, error);

    // Handle validation errors
    if (error.message.includes('Age must be') || error.message.includes('Invalid user type')) {
      return res.status(400).json({
        error: 'Validation error',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to update profile',
      message: error.message
    });
  }
});

export default router;
