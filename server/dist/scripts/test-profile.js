/**
 * Test script for user profile management endpoints
 *
 * This script tests the profile GET and PUT endpoints with a test user.
 * It creates a test user, fetches the profile, updates it, and verifies the changes.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import { UserProgress } from '../models/UserProgress';
import { generatePasswordHash } from '../utils/password';
import { generateAccessToken } from '../utils/auth';
dotenv.config();
const TEST_USER_EMAIL = 'profile-test@example.com';
const TEST_USER_PASSWORD = 'testPassword123';
async function testProfileEndpoints() {
    try {
        console.log('\n🚀 Starting Profile Endpoints Test Script...\n');
        // Connect to database
        console.log('📦 Connecting to database...');
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL not found in environment variables');
        }
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('✅ Connected to database\n');
        // Clean up test user if exists
        console.log('🧹 Cleaning up existing test user...');
        await User.deleteOne({ email: TEST_USER_EMAIL });
        await UserProgress.deleteMany({
            userId: { $in: await User.find({ email: TEST_USER_EMAIL }).distinct('_id') }
        });
        console.log('✅ Cleanup complete\n');
        // Create test user
        console.log('👤 Creating test user...');
        const hashedPassword = await generatePasswordHash(TEST_USER_PASSWORD);
        const testUser = new User({
            email: TEST_USER_EMAIL,
            password: hashedPassword,
            name: 'Test User',
            userType: 'adult',
            age: 25,
            location: 'Test City',
            nativeLanguage: 'English',
            targetLanguage: 'Spanish',
            profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TestUser',
        });
        await testUser.save();
        console.log('✅ Test user created:', testUser.email);
        console.log('   User ID:', testUser._id.toString());
        console.log('   Name:', testUser.name);
        console.log('   Location:', testUser.location, '\n');
        // Create user progress
        console.log('📊 Creating user progress...');
        const userProgress = new UserProgress({
            userId: testUser._id,
            totalXP: 500,
            level: 3,
            streak: 5,
            lastActivityDate: new Date(),
            weeklyGoal: 5,
            weeklyProgress: 2,
            skills: {
                language: { xp: 200, level: 2 },
                culture: { xp: 150, level: 2 },
                softSkills: { xp: 150, level: 2 },
            },
        });
        await userProgress.save();
        console.log('✅ User progress created');
        console.log('   Total XP:', userProgress.totalXP);
        console.log('   Level:', userProgress.level);
        console.log('   Streak:', userProgress.streak, '\n');
        // Generate access token for API calls
        const accessToken = generateAccessToken(testUser);
        console.log('🔑 Access token generated\n');
        // Test 1: Get user profile
        console.log('📥 TEST 1: Fetching user profile...');
        const BASE_URL = `http://localhost:${process.env.PORT || 3000}`;
        const getResponse = await fetch(`${BASE_URL}/api/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        if (!getResponse.ok) {
            const errorData = await getResponse.json();
            throw new Error(`GET request failed: ${JSON.stringify(errorData)}`);
        }
        const getResult = await getResponse.json();
        console.log('✅ Profile fetched successfully:');
        console.log('   ID:', getResult.profile._id);
        console.log('   Name:', getResult.profile.name);
        console.log('   Email:', getResult.profile.email);
        console.log('   User Type:', getResult.profile.userType);
        console.log('   Age:', getResult.profile.age);
        console.log('   Location:', getResult.profile.location);
        console.log('   Native Language:', getResult.profile.nativeLanguage);
        console.log('   Target Language:', getResult.profile.targetLanguage);
        console.log('   Level:', getResult.profile.level);
        console.log('   XP:', getResult.profile.xp);
        console.log('   Streak:', getResult.profile.streak, '\n');
        // Test 2: Update user profile
        console.log('📝 TEST 2: Updating user profile...');
        const updateData = {
            name: 'Updated Test User',
            location: 'New Test City',
            nativeLanguage: 'French',
            targetLanguage: 'German',
            age: 26,
        };
        const putResponse = await fetch(`${BASE_URL}/api/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });
        if (!putResponse.ok) {
            const errorData = await putResponse.json();
            throw new Error(`PUT request failed: ${JSON.stringify(errorData)}`);
        }
        const putResult = await putResponse.json();
        console.log('✅ Profile updated successfully:');
        console.log('   Name:', putResult.profile.name);
        console.log('   Location:', putResult.profile.location);
        console.log('   Native Language:', putResult.profile.nativeLanguage);
        console.log('   Target Language:', putResult.profile.targetLanguage);
        console.log('   Age:', putResult.profile.age, '\n');
        // Verify updates
        console.log('✔️  Verifying updates...');
        if (putResult.profile.name !== updateData.name) {
            throw new Error(`Name mismatch: expected ${updateData.name}, got ${putResult.profile.name}`);
        }
        if (putResult.profile.location !== updateData.location) {
            throw new Error(`Location mismatch: expected ${updateData.location}, got ${putResult.profile.location}`);
        }
        if (putResult.profile.nativeLanguage !== updateData.nativeLanguage) {
            throw new Error(`Native language mismatch: expected ${updateData.nativeLanguage}, got ${putResult.profile.nativeLanguage}`);
        }
        if (putResult.profile.targetLanguage !== updateData.targetLanguage) {
            throw new Error(`Target language mismatch: expected ${updateData.targetLanguage}, got ${putResult.profile.targetLanguage}`);
        }
        if (putResult.profile.age !== updateData.age) {
            throw new Error(`Age mismatch: expected ${updateData.age}, got ${putResult.profile.age}`);
        }
        console.log('✅ All updates verified successfully!\n');
        // Test 3: Verify XP, level, and streak remain unchanged
        console.log('✔️  TEST 3: Verifying XP, level, and streak...');
        if (putResult.profile.xp !== getResult.profile.xp) {
            throw new Error(`XP changed unexpectedly: ${getResult.profile.xp} -> ${putResult.profile.xp}`);
        }
        if (putResult.profile.level !== getResult.profile.level) {
            throw new Error(`Level changed unexpectedly: ${getResult.profile.level} -> ${putResult.profile.level}`);
        }
        if (putResult.profile.streak !== getResult.profile.streak) {
            throw new Error(`Streak changed unexpectedly: ${getResult.profile.streak} -> ${putResult.profile.streak}`);
        }
        console.log('✅ XP, level, and streak remained unchanged');
        console.log('   XP:', putResult.profile.xp);
        console.log('   Level:', putResult.profile.level);
        console.log('   Streak:', putResult.profile.streak, '\n');
        console.log('🎉 All tests passed successfully!\n');
        // Cleanup
        console.log('🧹 Cleaning up test data...');
        await User.deleteOne({ email: TEST_USER_EMAIL });
        await UserProgress.deleteOne({ userId: testUser._id });
        console.log('✅ Cleanup complete\n');
    }
    catch (error) {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    }
    finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected from database\n');
    }
}
// Run the test
testProfileEndpoints();
//# sourceMappingURL=test-profile.js.map