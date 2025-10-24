import User from '../models/User';
import { UserProgress } from '../models/UserProgress';
import mongoose from 'mongoose';
class ProfileService {
    /**
     * Get user profile with progress data
     */
    static async getUserProfile(userId) {
        try {
            console.log(`[ProfileService] Fetching profile for user: ${userId}`);
            // Fetch user data
            const user = await User.findById(userId).exec();
            if (!user) {
                throw new Error('User not found');
            }
            // Fetch user progress data
            let userProgress = await UserProgress.findOne({ userId: new mongoose.Types.ObjectId(userId) }).exec();
            // If no progress exists, create default progress
            if (!userProgress) {
                console.log(`[ProfileService] Creating default progress for user: ${userId}`);
                userProgress = new UserProgress({
                    userId: new mongoose.Types.ObjectId(userId),
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
                await userProgress.save();
            }
            // Construct profile response
            const profile = {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                userType: user.userType,
                age: user.age,
                location: user.location,
                nativeLanguage: user.nativeLanguage,
                targetLanguage: user.targetLanguage,
                profilePhoto: user.profilePhoto,
                level: userProgress.level,
                xp: userProgress.totalXP,
                streak: userProgress.streak,
                createdAt: user.createdAt.toISOString(),
            };
            console.log(`[ProfileService] Successfully fetched profile for user: ${userId}`);
            return profile;
        }
        catch (err) {
            console.error(`[ProfileService] Error fetching profile for user ${userId}:`, err);
            throw new Error(`Failed to fetch user profile: ${err}`);
        }
    }
    /**
     * Update user profile
     */
    static async updateUserProfile(userId, updateData) {
        try {
            console.log(`[ProfileService] Updating profile for user: ${userId}`);
            // Validate update data
            const allowedFields = ['name', 'location', 'nativeLanguage', 'targetLanguage', 'profilePhoto', 'age', 'userType'];
            const filteredData = {};
            for (const key of Object.keys(updateData)) {
                if (allowedFields.includes(key) && updateData[key] !== undefined) {
                    filteredData[key] = updateData[key];
                }
            }
            // Validate age if provided
            if (filteredData.age !== undefined) {
                if (filteredData.age < 1 || filteredData.age > 120) {
                    throw new Error('Age must be between 1 and 120');
                }
            }
            // Validate userType if provided
            if (filteredData.userType && !['child', 'adult', 'educator'].includes(filteredData.userType)) {
                throw new Error('Invalid user type');
            }
            // Update user
            const user = await User.findByIdAndUpdate(userId, { $set: filteredData }, { new: true, runValidators: true }).exec();
            if (!user) {
                throw new Error('User not found');
            }
            console.log(`[ProfileService] Successfully updated profile for user: ${userId}`);
            // Return updated profile with progress data
            return await ProfileService.getUserProfile(userId);
        }
        catch (err) {
            console.error(`[ProfileService] Error updating profile for user ${userId}:`, err);
            throw new Error(`Failed to update user profile: ${err}`);
        }
    }
}
export default ProfileService;
//# sourceMappingURL=profileService.js.map