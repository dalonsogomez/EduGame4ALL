import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { profileService } from '../services/profileService';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setUserProfile(null);
      setLoading(false);
      return;
    }

    loadProfile();
  }, [user]);

  async function loadProfile() {
    if (!user) return;

    try {
      setLoading(true);
      const [profileData, userProfileData] = await Promise.all([
        profileService.getProfile(user.id),
        profileService.getUserProfile(user.id),
      ]);
      setProfile(profileData);
      setUserProfile(userProfileData);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(updates: any) {
    if (!user) return;

    try {
      const updated = await profileService.updateProfile(user.id, updates);
      setProfile(updated);
      return updated;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }

  async function updateUserProfile(updates: any) {
    if (!user) return;

    try {
      const updated = await profileService.upsertUserProfile(user.id, updates);
      setUserProfile(updated);
      return updated;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }

  return {
    profile,
    userProfile,
    loading,
    error,
    updateProfile,
    updateUserProfile,
    refreshProfile: loadProfile,
  };
}
