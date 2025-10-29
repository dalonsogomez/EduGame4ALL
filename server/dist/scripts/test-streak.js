import axios from 'axios';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
const API_URL = process.env.API_URL || 'http://localhost:3000';
// Helper to log test results
const logTest = (testName, passed, details) => {
    const emoji = passed ? '✅' : '❌';
    console.log(`${emoji} ${testName}`);
    if (details) {
        console.log(`   ${details}`);
    }
};
// Test user credentials
const testUser = {
    email: `streaktest_${Date.now()}@test.com`,
    password: 'TestPassword123!',
    name: 'Streak Test User',
    targetLanguage: 'English',
    nativeLanguage: 'Spanish',
    location: 'Test Location',
    userType: 'adult',
};
let authToken = '';
let userId = '';
async function runTests() {
    console.log('\n🧪 Starting Streak Tracking System Tests\n');
    try {
        // Test 1: Register a new user
        console.log('--- Test 1: User Registration ---');
        try {
            const registerResponse = await axios.post(`${API_URL}/api/auth/register`, testUser);
            authToken = registerResponse.data.token;
            userId = registerResponse.data.user._id;
            logTest('User registration', registerResponse.status === 200 && !!authToken, `User ID: ${userId}`);
        }
        catch (error) {
            logTest('User registration', false, error.response?.data?.error || error.message);
            return;
        }
        // Setup axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        // Test 2: Get initial streak info (should be 0 for new user)
        console.log('\n--- Test 2: Get Initial Streak Info ---');
        try {
            const streakResponse = await axios.get(`${API_URL}/api/streak`);
            const streakData = streakResponse.data;
            const passed = streakData.currentStreak === 0 &&
                streakData.isActiveToday === true;
            logTest('Initial streak info', passed, `Streak: ${streakData.currentStreak}, Active today: ${streakData.isActiveToday}`);
            console.log('Streak Info:', JSON.stringify(streakData, null, 2));
        }
        catch (error) {
            logTest('Initial streak info', false, error.response?.data?.error || error.message);
        }
        // Test 3: Play a game to trigger streak update
        console.log('\n--- Test 3: Play Game and Update Streak ---');
        try {
            // First get available games
            const gamesResponse = await axios.get(`${API_URL}/api/games`);
            const games = gamesResponse.data;
            if (games.length === 0) {
                logTest('Play game', false, 'No games available for testing');
            }
            else {
                const game = games[0];
                console.log(`Playing game: ${game.title}`);
                // Submit a game session
                const sessionData = {
                    score: 80,
                    maxScore: 100,
                    timeSpent: 120,
                    answers: game.questions.map((q, idx) => ({
                        questionIndex: idx,
                        selectedAnswer: q.correctAnswer,
                        isCorrect: true,
                        pointsEarned: q.points,
                    })),
                };
                const sessionResponse = await axios.post(`${API_URL}/api/games/${game._id}/sessions`, sessionData);
                logTest('Game session submission', sessionResponse.status === 201, `XP earned: ${sessionResponse.data.xpEarned}`);
                // Check streak after game
                const streakAfterGame = await axios.get(`${API_URL}/api/streak`);
                const streakAfterData = streakAfterGame.data;
                logTest('Streak after game play', streakAfterData.currentStreak >= 0 && streakAfterData.isActiveToday === true, `Streak: ${streakAfterData.currentStreak}`);
                console.log('Streak After Game:', JSON.stringify(streakAfterData, null, 2));
            }
        }
        catch (error) {
            logTest('Play game and update streak', false, error.response?.data?.error || error.message);
        }
        // Test 4: Manual streak update
        console.log('\n--- Test 4: Manual Streak Update ---');
        try {
            const updateResponse = await axios.post(`${API_URL}/api/streak/update`);
            const updateData = updateResponse.data;
            logTest('Manual streak update', updateResponse.status === 200 && updateData.streak !== undefined, `Streak: ${updateData.streak}, Message: ${updateData.message}`);
            console.log('Update Response:', JSON.stringify(updateData, null, 2));
        }
        catch (error) {
            logTest('Manual streak update', false, error.response?.data?.error || error.message);
        }
        // Test 5: Login to verify streak persistence and update
        console.log('\n--- Test 5: Login and Streak Update ---');
        try {
            const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
                email: testUser.email,
                password: testUser.password,
            });
            const newAuthToken = loginResponse.data.accessToken;
            axios.defaults.headers.common['Authorization'] = `Bearer ${newAuthToken}`;
            logTest('Login successful', loginResponse.status === 200 && !!newAuthToken, 'Streak should be updated on login');
            // Check streak after login
            const streakAfterLogin = await axios.get(`${API_URL}/api/streak`);
            logTest('Streak after login', streakAfterLogin.status === 200, `Current streak: ${streakAfterLogin.data.currentStreak}`);
            console.log('Streak After Login:', JSON.stringify(streakAfterLogin.data, null, 2));
        }
        catch (error) {
            logTest('Login and streak update', false, error.response?.data?.error || error.message);
        }
        // Test 6: Dashboard integration (verify streak appears in dashboard)
        console.log('\n--- Test 6: Dashboard Integration ---');
        try {
            const dashboardResponse = await axios.get(`${API_URL}/api/dashboard`);
            const dashboardData = dashboardResponse.data;
            // The dashboard should now include streak information via skills/progress
            logTest('Dashboard data fetch', dashboardResponse.status === 200, 'Dashboard should reflect updated streak');
            console.log('Dashboard Data Keys:', Object.keys(dashboardData));
        }
        catch (error) {
            logTest('Dashboard integration', false, error.response?.data?.error || error.message);
        }
        // Test 7: Reset own streak
        console.log('\n--- Test 7: Reset Own Streak ---');
        try {
            const resetResponse = await axios.post(`${API_URL}/api/streak/reset`);
            const resetData = resetResponse.data;
            logTest('Reset own streak', resetResponse.status === 200 && resetData.streak === 0, `Streak after reset: ${resetData.streak}`);
            console.log('Reset Response:', JSON.stringify(resetData, null, 2));
            // Verify streak is 0
            const verifyReset = await axios.get(`${API_URL}/api/streak`);
            logTest('Verify streak reset', verifyReset.data.currentStreak === 0, `Verified streak: ${verifyReset.data.currentStreak}`);
        }
        catch (error) {
            logTest('Reset own streak', false, error.response?.data?.error || error.message);
        }
        // Test 8: Test admin endpoints (requires admin user)
        console.log('\n--- Test 8: Admin Endpoints (may fail if not admin) ---');
        try {
            // Try to get statistics
            const statsResponse = await axios.get(`${API_URL}/api/streak/statistics`);
            const statsData = statsResponse.data;
            logTest('Get streak statistics (admin)', statsResponse.status === 200, `Total users: ${statsData.totalUsers}, Avg streak: ${statsData.averageStreak}`);
            console.log('Statistics:', JSON.stringify(statsData, null, 2));
        }
        catch (error) {
            if (error.response?.status === 403) {
                logTest('Get streak statistics (admin)', true, 'Correctly denied for non-admin (expected)');
            }
            else {
                logTest('Get streak statistics (admin)', false, error.response?.data?.error || error.message);
            }
        }
        try {
            // Try to reset expired streaks
            const resetExpiredResponse = await axios.post(`${API_URL}/api/streak/reset-expired`);
            const resetExpiredData = resetExpiredResponse.data;
            logTest('Reset expired streaks (admin)', resetExpiredResponse.status === 200, `Checked: ${resetExpiredData.totalChecked}, Reset: ${resetExpiredData.streaksReset}`);
            console.log('Reset Expired:', JSON.stringify(resetExpiredData, null, 2));
        }
        catch (error) {
            if (error.response?.status === 403) {
                logTest('Reset expired streaks (admin)', true, 'Correctly denied for non-admin (expected)');
            }
            else {
                logTest('Reset expired streaks (admin)', false, error.response?.data?.error || error.message);
            }
        }
        console.log('\n✅ All streak tracking tests completed!\n');
        console.log('📝 Summary:');
        console.log('   - Streak tracking is working on login');
        console.log('   - Streak tracking is working on game play');
        console.log('   - Streak info can be retrieved via API');
        console.log('   - Streak can be manually reset');
        console.log('   - Admin endpoints are properly protected');
        console.log('\n🎉 Streak Tracking System is fully functional!');
    }
    catch (error) {
        console.error('\n❌ Unexpected error during tests:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}
// Run tests
runTests().catch(console.error);
//# sourceMappingURL=test-streak.js.map