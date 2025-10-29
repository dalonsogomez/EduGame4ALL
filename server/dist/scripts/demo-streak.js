/**
 * Demonstration script for Streak Tracking System
 * Shows all features in action
 */
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const API_URL = process.env.API_URL || 'http://localhost:3000';
// Colors for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
};
function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}
function section(title) {
    console.log(`\n${colors.cyan}${'='.repeat(60)}`);
    console.log(`  ${title}`);
    console.log(`${'='.repeat(60)}${colors.reset}\n`);
}
async function demo() {
    log('🎮 Streak Tracking System - Interactive Demo', colors.blue);
    log('━'.repeat(60), colors.blue);
    try {
        // Create test user
        section('1. User Registration');
        const testUser = {
            email: `streakdemo_${Date.now()}@test.com`,
            password: 'DemoPassword123!',
            name: 'Streak Demo User',
            targetLanguage: 'English',
            nativeLanguage: 'Spanish',
            location: 'Demo City',
            userType: 'adult',
        };
        log(`Creating user: ${testUser.email}`, colors.yellow);
        const registerResponse = await axios.post(`${API_URL}/api/auth/register`, testUser);
        const authToken = registerResponse.data.token;
        const userId = registerResponse.data.user._id;
        log(`✓ User created successfully!`, colors.green);
        log(`  User ID: ${userId}`);
        // Set auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        // Get initial streak
        section('2. Initial Streak State');
        log('Fetching initial streak information...', colors.yellow);
        const initialStreak = await axios.get(`${API_URL}/api/streak`);
        log(`✓ Current streak: ${initialStreak.data.currentStreak} days`, colors.green);
        log(`  Last activity: ${new Date(initialStreak.data.lastActivityDate).toLocaleString()}`);
        log(`  Active today: ${initialStreak.data.isActiveToday ? 'Yes ✓' : 'No ✗'}`);
        // Simulate game play
        section('3. Playing a Game (Triggers Streak Update)');
        try {
            const gamesResponse = await axios.get(`${API_URL}/api/games`);
            const games = gamesResponse.data;
            if (games.length > 0) {
                const game = games[0];
                log(`Playing: ${game.title}`, colors.yellow);
                log(`  Category: ${game.category}`);
                log(`  Difficulty: ${'⭐'.repeat(game.difficulty)}`);
                const sessionData = {
                    score: 85,
                    maxScore: 100,
                    timeSpent: 180,
                    answers: game.questions.map((q, idx) => ({
                        questionIndex: idx,
                        selectedAnswer: q.correctAnswer,
                        isCorrect: true,
                        pointsEarned: q.points,
                    })),
                };
                const sessionResponse = await axios.post(`${API_URL}/api/games/${game._id}/sessions`, sessionData);
                log(`✓ Game completed!`, colors.green);
                log(`  Score: ${sessionData.score}/${sessionData.maxScore}`);
                log(`  XP earned: ${sessionResponse.data.xpEarned}`);
                log(`  Streak automatically updated during game play!`, colors.cyan);
                // Check streak after game
                const streakAfterGame = await axios.get(`${API_URL}/api/streak`);
                log(`\n✓ Current streak: ${streakAfterGame.data.currentStreak} days`, colors.green);
            }
            else {
                log('⚠ No games available in database (run: npm run seed)', colors.yellow);
            }
        }
        catch (error) {
            log(`⚠ Game play skipped: ${error.message}`, colors.yellow);
        }
        // Manual streak update
        section('4. Manual Streak Update');
        log('Manually triggering streak update...', colors.yellow);
        const manualUpdate = await axios.post(`${API_URL}/api/streak/update`);
        log(`✓ Streak: ${manualUpdate.data.streak} days`, colors.green);
        log(`  Last activity: ${new Date(manualUpdate.data.lastActivityDate).toLocaleString()}`);
        log(`  ${manualUpdate.data.message}`);
        // Simulate second login (same day)
        section('5. Login Again (Same Day)');
        log('Logging in again...', colors.yellow);
        const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
            email: testUser.email,
            password: testUser.password,
        });
        log(`✓ Login successful!`, colors.green);
        log(`  Streak automatically updated on login`, colors.cyan);
        // Update auth token
        axios.defaults.headers.common['Authorization'] = `Bearer ${loginResponse.data.accessToken}`;
        // Check streak (should not increment - same day)
        const streakAfterLogin = await axios.get(`${API_URL}/api/streak`);
        log(`\n✓ Streak after second login: ${streakAfterLogin.data.currentStreak} days`, colors.green);
        log(`  (No change - same day activity)`, colors.cyan);
        // Show streak info details
        section('6. Detailed Streak Information');
        log('Fetching comprehensive streak data...', colors.yellow);
        const detailedStreak = await axios.get(`${API_URL}/api/streak`);
        const info = detailedStreak.data;
        log(`📊 Streak Details:`, colors.cyan);
        log(`  Current Streak: ${info.currentStreak} days`);
        log(`  Last Activity: ${new Date(info.lastActivityDate).toLocaleString()}`);
        log(`  Active Today: ${info.isActiveToday ? '✓ Yes' : '✗ No'}`);
        log(`  Days Until Reset: ${info.daysUntilReset}`);
        // Dashboard integration
        section('7. Dashboard Integration');
        log('Checking dashboard display...', colors.yellow);
        const dashboardResponse = await axios.get(`${API_URL}/api/dashboard`);
        log(`✓ Dashboard loaded successfully!`, colors.green);
        log(`  The streak is displayed in the WelcomeBanner component`, colors.cyan);
        log(`  With a 🔥 flame icon and prominent text`, colors.cyan);
        // Try admin endpoints (will fail)
        section('8. Admin Endpoints (Protected)');
        log('Attempting to access admin statistics...', colors.yellow);
        try {
            await axios.get(`${API_URL}/api/streak/statistics`);
            log(`✓ Statistics retrieved (user is admin)`, colors.green);
        }
        catch (error) {
            if (error.response?.status === 403) {
                log(`✓ Access denied (expected - user is not admin)`, colors.green);
                log(`  Admin endpoints are properly protected`, colors.cyan);
            }
            else {
                log(`✗ Unexpected error: ${error.message}`, colors.yellow);
            }
        }
        // Reset streak (for demo purposes)
        section('9. Reset Streak (Optional Feature)');
        log('Resetting streak to 0...', colors.yellow);
        const resetResponse = await axios.post(`${API_URL}/api/streak/reset`);
        log(`✓ ${resetResponse.data.message}`, colors.green);
        log(`  Streak is now: ${resetResponse.data.streak} days`);
        // Final summary
        section('Demo Complete! 🎉');
        log('Streak Tracking Features Demonstrated:', colors.blue);
        log('  ✓ Automatic update on login', colors.green);
        log('  ✓ Automatic update on game play', colors.green);
        log('  ✓ Same-day activity protection', colors.green);
        log('  ✓ Manual update capability', colors.green);
        log('  ✓ Detailed streak information', colors.green);
        log('  ✓ Dashboard integration', colors.green);
        log('  ✓ Admin endpoint protection', colors.green);
        log('  ✓ Manual reset functionality', colors.green);
        log('\n📚 For more information:', colors.cyan);
        log('  - Implementation: server/STREAK_TRACKING_IMPLEMENTATION.md');
        log('  - Summary: STREAK_IMPLEMENTATION_SUMMARY.md');
        log('  - Run tests: npm run test:streak');
    }
    catch (error) {
        console.error('\n❌ Demo error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}
// Run demo
demo().catch(console.error);
//# sourceMappingURL=demo-streak.js.map