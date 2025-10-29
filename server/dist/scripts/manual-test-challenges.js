/**
 * Manual Test Script for Challenge System
 * This script demonstrates the daily challenges system functionality
 */
import { connectDB } from '../config/database';
import { ChallengeService } from '../services/challengeService';
import { GameService } from '../services/gameService';
import User from '../models/User';
import { Game } from '../models/Game';
import { UserProgress } from '../models/UserProgress';
import { generatePasswordHash } from '../utils/password';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
async function main() {
    console.log('🚀 Manual Test: Daily Challenges System\n');
    console.log('=' + '='.repeat(50));
    // Connect to database
    await connectDB();
    console.log('✅ Connected to database\n');
    // Find or create a test user
    let user = await User.findOne({ email: 'testchallenge@example.com' });
    if (!user) {
        const hashedPassword = await generatePasswordHash('Test123456');
        user = await User.create({
            email: 'testchallenge@example.com',
            password: hashedPassword,
            name: 'Challenge Test User',
            userType: 'adult',
            nativeLanguage: 'English',
            targetLanguage: 'Spanish',
            location: 'Test City',
        });
        console.log('✅ Created test user');
    }
    else {
        console.log('✅ Found existing test user');
    }
    const userId = user._id;
    console.log(`   User ID: ${userId}\n`);
    // Test 1: Generate daily challenge
    console.log('📋 Test 1: Generate Daily Challenge');
    console.log('-'.repeat(50));
    const challenge = await ChallengeService.generateDailyChallenge();
    console.log(`✅ Challenge Created:`);
    console.log(`   Title: ${challenge.title}`);
    console.log(`   Description: ${challenge.description}`);
    console.log(`   Type: ${challenge.type}`);
    console.log(`   Target: ${challenge.requirements.targetCount || challenge.requirements.targetXP || 'N/A'}`);
    console.log(`   XP Reward: ${challenge.rewards.xp}`);
    console.log(`   Bonus Badge: ${challenge.rewards.bonusBadgeId ? 'Yes' : 'No'}\n`);
    // Test 2: Get user's daily challenge
    console.log('👤 Test 2: Get User Daily Challenge');
    console.log('-'.repeat(50));
    const { challenge: userChallenge, userChallenge: tracking } = await ChallengeService.getUserDailyChallenge(userId);
    console.log(`✅ User Challenge:`);
    console.log(`   Progress: ${tracking.progress.current}/${tracking.progress.target} (${tracking.progress.percentage}%)`);
    console.log(`   Status: ${tracking.status}\n`);
    // Test 3: Complete a game to update challenge progress
    console.log('🎮 Test 3: Complete Game Session (Update Challenge Progress)');
    console.log('-'.repeat(50));
    // Find a game that matches the challenge category
    const challengeCategory = userChallenge.category;
    let games = challengeCategory
        ? await Game.find({ isActive: true, category: challengeCategory })
        : await Game.find({ isActive: true });
    if (games.length === 0) {
        console.log('❌ No games found for challenge category. Please run seed script first.');
        process.exit(1);
    }
    const game = games[0];
    console.log(`   Playing game: ${game.title} (${game.category})`);
    // Simulate perfect game session
    const sessionData = {
        score: game.questions.length * 10,
        maxScore: game.questions.length * 10,
        timeSpent: 60,
        answers: game.questions.map((_, index) => ({
            questionIndex: index,
            selectedAnswer: game.questions[index].correctAnswer,
            isCorrect: true,
            pointsEarned: 10,
        })),
    };
    const { session, xpEarned } = await GameService.submitGameSession(userId.toString(), game._id.toString(), sessionData);
    console.log(`✅ Game Completed:`);
    console.log(`   Score: ${session.score}/${session.maxScore}`);
    console.log(`   XP Earned: ${xpEarned}\n`);
    // Test 4: Check updated challenge progress
    console.log('📊 Test 4: Verify Challenge Progress Updated');
    console.log('-'.repeat(50));
    const { userChallenge: updatedTracking } = await ChallengeService.getUserDailyChallenge(userId);
    console.log(`✅ Updated Progress:`);
    console.log(`   Progress: ${updatedTracking.progress.current}/${updatedTracking.progress.target} (${updatedTracking.progress.percentage}%)`);
    console.log(`   Status: ${updatedTracking.status}`);
    if (updatedTracking.progress.current > 0) {
        console.log(`   ✅ Challenge progress was successfully updated!\n`);
    }
    else {
        console.log(`   ⚠️  Challenge progress was not updated\n`);
    }
    // Test 5: Complete remaining games to finish challenge
    const remaining = updatedTracking.progress.target - updatedTracking.progress.current;
    if (remaining > 0) {
        console.log(`🎯 Test 5: Complete ${remaining} More Games to Finish Challenge`);
        console.log('-'.repeat(50));
        for (let i = 0; i < remaining; i++) {
            await GameService.submitGameSession(userId.toString(), game._id.toString(), sessionData);
            console.log(`   ✅ Completed game ${i + 1}/${remaining}`);
        }
        console.log();
    }
    // Test 6: Verify challenge completion
    console.log('🏆 Test 6: Verify Challenge Completion');
    console.log('-'.repeat(50));
    const { userChallenge: finalTracking } = await ChallengeService.getUserDailyChallenge(userId);
    console.log(`✅ Final Status:`);
    console.log(`   Progress: ${finalTracking.progress.current}/${finalTracking.progress.target}`);
    console.log(`   Status: ${finalTracking.status}`);
    console.log(`   XP Earned from Challenge: ${finalTracking.xpEarned}`);
    console.log(`   Bonus Badge Awarded: ${finalTracking.bonusBadgeAwarded ? 'Yes ✨' : 'No'}`);
    if (finalTracking.status === 'completed') {
        console.log(`   🎉 CHALLENGE COMPLETED SUCCESSFULLY!\n`);
    }
    else {
        console.log(`   ⚠️  Challenge not yet completed\n`);
    }
    // Test 7: Get challenge stats
    console.log('📈 Test 7: Get Challenge Statistics');
    console.log('-'.repeat(50));
    const stats = await ChallengeService.getChallengeStats(userId);
    console.log(`✅ User Stats:`);
    console.log(`   Total Completed: ${stats.totalCompleted}`);
    console.log(`   Total XP Earned: ${stats.totalXPEarned}`);
    console.log(`   Bonus Badges Earned: ${stats.bonusBadgesEarned}`);
    console.log(`   Current Streak: ${stats.currentStreak}\n`);
    // Test 8: Get challenge history
    console.log('📜 Test 8: Get Challenge History');
    console.log('-'.repeat(50));
    const history = await ChallengeService.getChallengeHistory(userId, 5);
    console.log(`✅ Challenge History (${history.length} entries):`);
    history.forEach((entry, index) => {
        console.log(`   ${index + 1}. ${entry.challenge.title}`);
        console.log(`      Status: ${entry.userChallenge.status}`);
        console.log(`      Progress: ${entry.userChallenge.progress.current}/${entry.userChallenge.progress.target}`);
    });
    console.log();
    // Test 9: Check user progress
    console.log('🎖️  Test 9: Check User Overall Progress');
    console.log('-'.repeat(50));
    const userProgress = await UserProgress.findOne({ userId });
    if (userProgress) {
        console.log(`✅ User Progress:`);
        console.log(`   Total XP: ${userProgress.totalXP}`);
        console.log(`   Level: ${userProgress.level}`);
        console.log(`   Streak: ${userProgress.streak} days`);
    }
    console.log();
    console.log('=' + '='.repeat(50));
    console.log('✨ All Tests Completed Successfully!');
    console.log('=' + '='.repeat(50));
    // Close database connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
}
// Run tests
main().catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
});
//# sourceMappingURL=manual-test-challenges.js.map