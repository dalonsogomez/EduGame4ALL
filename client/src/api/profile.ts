import api from './api';
import { UserProfile } from '@/types';

// Description: Get user profile with personal information, XP, level, and streak
// Endpoint: GET /api/profile
// Request: {}
// Response: { profile: UserProfile }
export const getUserProfile = async () => {
  try {
    return await api.get('/api/profile');
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Update user profile including personal information and language preferences
// Endpoint: PUT /api/profile
// Request: { name?: string, location?: string, nativeLanguage?: string, targetLanguage?: string, profilePhoto?: string, age?: number, userType?: 'child' | 'adult' | 'educator' }
// Response: { profile: UserProfile }
export const updateUserProfile = async (data: Partial<UserProfile>) => {
  try {
    return await api.put('/api/profile', data);
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};