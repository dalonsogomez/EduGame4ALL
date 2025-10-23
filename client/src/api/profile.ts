import api from './api';
import { UserProfile } from '@/types';

// Description: Get user profile
// Endpoint: GET /api/profile
// Request: {}
// Response: { profile: UserProfile }
export const getUserProfile = async () => {
  // Mocking the response
  return new Promise<{ profile: UserProfile }>((resolve) => {
    setTimeout(() => {
      resolve({
        profile: {
          _id: '1',
          name: 'Amira Hassan',
          email: 'amira@example.com',
          userType: 'adult',
          age: 28,
          location: 'Madrid, Spain',
          nativeLanguage: 'Arabic',
          targetLanguage: 'Spanish',
          profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amira',
          level: 5,
          xp: 1250,
          streak: 7,
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        },
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/profile');
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Update user profile
// Endpoint: PUT /api/profile
// Request: { name?: string, location?: string, profilePhoto?: string, ... }
// Response: { profile: UserProfile }
export const updateUserProfile = async (data: Partial<UserProfile>) => {
  // Mocking the response
  return new Promise<{ profile: UserProfile }>((resolve) => {
    setTimeout(() => {
      resolve({
        profile: {
          _id: '1',
          name: data.name || 'Amira Hassan',
          email: 'amira@example.com',
          userType: 'adult',
          age: data.age || 28,
          location: data.location || 'Madrid, Spain',
          nativeLanguage: data.nativeLanguage || 'Arabic',
          targetLanguage: data.targetLanguage || 'Spanish',
          profilePhoto: data.profilePhoto || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amira',
          level: 5,
          xp: 1250,
          streak: 7,
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        },
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put('/api/profile', data);
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};