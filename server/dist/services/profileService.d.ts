export interface UserProfileResponse {
    _id: string;
    name: string;
    email: string;
    userType: 'child' | 'adult' | 'educator';
    age?: number;
    location: string;
    nativeLanguage: string;
    targetLanguage: string;
    profilePhoto?: string;
    level: number;
    xp: number;
    streak: number;
    createdAt: string;
}
export interface UpdateProfileData {
    name?: string;
    location?: string;
    nativeLanguage?: string;
    targetLanguage?: string;
    profilePhoto?: string;
    age?: number;
    userType?: 'child' | 'adult' | 'educator';
}
declare class ProfileService {
    /**
     * Get user profile with progress data
     */
    static getUserProfile(userId: string): Promise<UserProfileResponse>;
    /**
     * Update user profile
     */
    static updateUserProfile(userId: string, updateData: UpdateProfileData): Promise<UserProfileResponse>;
}
export default ProfileService;
//# sourceMappingURL=profileService.d.ts.map