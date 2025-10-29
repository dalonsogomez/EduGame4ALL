import axios from 'axios';
const BASE_URL = 'http://localhost:3000';
const results = [];
// Test user credentials
const testUser = {
    email: `xptest_${Date.now()}@example.com`,
    password: 'testpass123',
    name: 'XP Test User',
    location: 'Test City',
    nativeLanguage: 'English',
    targetLanguage: 'Spanish',
    userType: 'adult',
};
const adminUser = {
    email: 'admin@edugame4all.com',
    password: 'Admin@123',
};
let userAuthToken = '';
let adminAuthToken = '';
let userId = '';
// Helper function to log test results
function logTest(name, passed, message) {
    results.push({ name, passed, message });
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status}: ${name}${message ? ` - ${message}` : ''}`);
}
async function runTests() {
    console.log('\n🚀 Starting XP & Leveling System Tests...\n');
    try {
        // Test 1: Register a test user
        console.log('📝 Test 1: Registering test user...');
        try {
            const registerRes = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
            // Login to get auth token and userId
            const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
                email: testUser.email,
                password: testUser.password,
            });
            userAuthToken = loginRes.data.accessToken;
            userId = loginRes.data._id;
            logTest('User Registration & Login', true, `User ID: ${userId}`);
        }
        catch (error) {
            logTest('User Registration & Login', false, error.response?.data?.error || error.message);
            return;
        }
        // Test 2: Get initial XP profile (should be all zeros)
        console.log('\n📊 Test 2: Fetching initial XP profile...');
        try {
            const profileRes = await axios.get(`${BASE_URL}/api/xp/profile`, {
                headers: { Authorization: `Bearer ${userAuthToken}` },
            });
            const profile = profileRes.data;
            const isInitialState = profile.totalXP === 0 &&
                profile.level.currentLevel === 1 &&
                profile.skills.language.currentLevel === 1 &&
                profile.skills.culture.currentLevel === 1 &&
                profile.skills.softSkills.currentLevel === 1;
            logTest('Get Initial XP Profile', isInitialState, `Total XP: ${profile.totalXP}, Level: ${profile.level.currentLevel}`);
        }
        catch (error) {
            logTest('Get Initial XP Profile', false, error.response?.data?.error || error.message);
        }
        // Test 3: Calculate level from XP (utility function)
        console.log('\n🧮 Test 3: Testing level calculation utility...');
        try {
            const testXPs = [0, 100, 250, 500, 1000];
            let allCorrect = true;
            for (const xp of testXPs) {
                const levelRes = await axios.get(`${BASE_URL}/api/xp/calculate-level`, {
                    headers: { Authorization: `Bearer ${userAuthToken}` },
                    params: { xp },
                });
                const levelInfo = levelRes.data;
                console.log(`   XP ${xp} → Level ${levelInfo.currentLevel} (${levelInfo.progressPercentage.toFixed(1)}% to next)`);
                if (!levelInfo.currentLevel || levelInfo.currentXP !== xp) {
                    allCorrect = false;
                }
            }
            logTest('Calculate Level from XP', allCorrect, 'All calculations correct');
        }
        catch (error) {
            logTest('Calculate Level from XP', false, error.response?.data?.error || error.message);
        }
        // Test 4: Login as admin to award XP
        console.log('\n👑 Test 4: Admin login for XP awarding...');
        try {
            const adminLoginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
                email: adminUser.email,
                password: adminUser.password,
            });
            adminAuthToken = adminLoginRes.data.accessToken;
            logTest('Admin Login', true, 'Admin authenticated');
        }
        catch (error) {
            logTest('Admin Login', false, error.response?.data?.error || error.message);
            console.log('\n⚠️  Note: Make sure admin user exists (run seed script)');
            return;
        }
        // Test 5: Award total XP (no category)
        console.log('\n🎁 Test 5: Awarding total XP...');
        try {
            const awardRes = await axios.post(`${BASE_URL}/api/xp/award`, {
                userId,
                xpAmount: 150,
            }, {
                headers: { Authorization: `Bearer ${adminAuthToken}` },
            });
            const result = awardRes.data.result;
            const leveledUp = result.leveledUp;
            logTest('Award Total XP', result.totalXP === 150, `Awarded 150 XP. Level: ${result.oldLevel} → ${result.newLevel}${leveledUp ? ' (LEVELED UP!)' : ''}`);
        }
        catch (error) {
            logTest('Award Total XP', false, error.response?.data?.error || error.message);
        }
        // Test 6: Award category-specific XP (language)
        console.log('\n🗣️  Test 6: Awarding language category XP...');
        try {
            const awardRes = await axios.post(`${BASE_URL}/api/xp/award`, {
                userId,
                xpAmount: 100,
                category: 'language',
            }, {
                headers: { Authorization: `Bearer ${adminAuthToken}` },
            });
            const result = awardRes.data.result;
            logTest('Award Language XP', result.categoryXP === 100, `Language XP: ${result.categoryXP}, Level: ${result.newCategoryLevel}`);
        }
        catch (error) {
            logTest('Award Language XP', false, error.response?.data?.error || error.message);
        }
        // Test 7: Award culture category XP
        console.log('\n🌍 Test 7: Awarding culture category XP...');
        try {
            const awardRes = await axios.post(`${BASE_URL}/api/xp/award`, {
                userId,
                xpAmount: 75,
                category: 'culture',
            }, {
                headers: { Authorization: `Bearer ${adminAuthToken}` },
            });
            const result = awardRes.data.result;
            logTest('Award Culture XP', result.categoryXP === 75, `Culture XP: ${result.categoryXP}, Level: ${result.newCategoryLevel}`);
        }
        catch (error) {
            logTest('Award Culture XP', false, error.response?.data?.error || error.message);
        }
        // Test 8: Award soft skills category XP
        console.log('\n🤝 Test 8: Awarding soft skills category XP...');
        try {
            const awardRes = await axios.post(`${BASE_URL}/api/xp/award`, {
                userId,
                xpAmount: 50,
                category: 'softSkills',
            }, {
                headers: { Authorization: `Bearer ${adminAuthToken}` },
            });
            const result = awardRes.data.result;
            logTest('Award Soft Skills XP', result.categoryXP === 50, `Soft Skills XP: ${result.categoryXP}, Level: ${result.newCategoryLevel}`);
        }
        catch (error) {
            logTest('Award Soft Skills XP', false, error.response?.data?.error || error.message);
        }
        // Test 9: Verify updated XP profile
        console.log('\n📊 Test 9: Verifying updated XP profile...');
        try {
            const profileRes = await axios.get(`${BASE_URL}/api/xp/profile`, {
                headers: { Authorization: `Bearer ${userAuthToken}` },
            });
            const profile = profileRes.data;
            // Total should be 150 (total) + 100 (lang) + 75 (culture) + 50 (soft) = 375
            const expectedTotal = 375;
            const totalCorrect = profile.totalXP === expectedTotal;
            console.log('\n   📈 XP Profile Summary:');
            console.log(`   Total XP: ${profile.totalXP} (Level ${profile.level.currentLevel})`);
            console.log(`   Language: ${profile.skills.language.currentXP} XP (Level ${profile.skills.language.currentLevel})`);
            console.log(`   Culture: ${profile.skills.culture.currentXP} XP (Level ${profile.skills.culture.currentLevel})`);
            console.log(`   Soft Skills: ${profile.skills.softSkills.currentXP} XP (Level ${profile.skills.softSkills.currentLevel})`);
            console.log(`   Progress to next level: ${profile.level.progressPercentage.toFixed(1)}%`);
            logTest('Verify Updated Profile', totalCorrect, `Total XP: ${profile.totalXP} (expected ${expectedTotal})`);
        }
        catch (error) {
            logTest('Verify Updated Profile', false, error.response?.data?.error || error.message);
        }
        // Test 10: Get total leaderboard
        console.log('\n🏆 Test 10: Fetching total XP leaderboard...');
        try {
            const leaderboardRes = await axios.get(`${BASE_URL}/api/xp/leaderboard`, {
                headers: { Authorization: `Bearer ${userAuthToken}` },
                params: { limit: 10 },
            });
            const data = leaderboardRes.data;
            const hasLeaderboard = Array.isArray(data.leaderboard) && data.leaderboard.length > 0;
            if (hasLeaderboard) {
                console.log(`\n   🥇 Top ${Math.min(3, data.leaderboard.length)} Players:`);
                data.leaderboard.slice(0, 3).forEach((entry) => {
                    console.log(`   #${entry.rank} - ${entry.userId.name}: ${entry.xp} XP (Level ${entry.level})`);
                });
            }
            logTest('Get Total Leaderboard', hasLeaderboard, `Found ${data.leaderboard.length} players`);
        }
        catch (error) {
            logTest('Get Total Leaderboard', false, error.response?.data?.error || error.message);
        }
        // Test 11: Get language category leaderboard
        console.log('\n🗣️  Test 11: Fetching language leaderboard...');
        try {
            const leaderboardRes = await axios.get(`${BASE_URL}/api/xp/leaderboard/language`, {
                headers: { Authorization: `Bearer ${userAuthToken}` },
                params: { limit: 5 },
            });
            const data = leaderboardRes.data;
            const hasLeaderboard = Array.isArray(data.leaderboard) && data.category === 'language';
            logTest('Get Language Leaderboard', hasLeaderboard, `Category: ${data.category}, Entries: ${data.leaderboard.length}`);
        }
        catch (error) {
            logTest('Get Language Leaderboard', false, error.response?.data?.error || error.message);
        }
        // Test 12: Get culture category leaderboard
        console.log('\n🌍 Test 12: Fetching culture leaderboard...');
        try {
            const leaderboardRes = await axios.get(`${BASE_URL}/api/xp/leaderboard/culture`, {
                headers: { Authorization: `Bearer ${userAuthToken}` },
                params: { limit: 5 },
            });
            const data = leaderboardRes.data;
            const hasLeaderboard = Array.isArray(data.leaderboard) && data.category === 'culture';
            logTest('Get Culture Leaderboard', hasLeaderboard, `Category: ${data.category}, Entries: ${data.leaderboard.length}`);
        }
        catch (error) {
            logTest('Get Culture Leaderboard', false, error.response?.data?.error || error.message);
        }
        // Test 13: Get soft skills category leaderboard
        console.log('\n🤝 Test 13: Fetching soft skills leaderboard...');
        try {
            const leaderboardRes = await axios.get(`${BASE_URL}/api/xp/leaderboard/softSkills`, {
                headers: { Authorization: `Bearer ${userAuthToken}` },
                params: { limit: 5 },
            });
            const data = leaderboardRes.data;
            const hasLeaderboard = Array.isArray(data.leaderboard) && data.category === 'softSkills';
            logTest('Get Soft Skills Leaderboard', hasLeaderboard, `Category: ${data.category}, Entries: ${data.leaderboard.length}`);
        }
        catch (error) {
            logTest('Get Soft Skills Leaderboard', false, error.response?.data?.error || error.message);
        }
        // Test 14: Test level-up mechanics (award enough XP to level up)
        console.log('\n⬆️  Test 14: Testing automatic level-up...');
        try {
            // Award 500 more XP to trigger level-up
            const awardRes = await axios.post(`${BASE_URL}/api/xp/award`, {
                userId,
                xpAmount: 500,
            }, {
                headers: { Authorization: `Bearer ${adminAuthToken}` },
            });
            const result = awardRes.data.result;
            const leveledUp = result.leveledUp;
            logTest('Automatic Level-Up', leveledUp, `Level: ${result.oldLevel} → ${result.newLevel} (${result.totalXP} total XP)`);
            if (result.badgesEarned && result.badgesEarned.length > 0) {
                console.log(`   🏅 Badges earned: ${result.badgesEarned.map((b) => b.title).join(', ')}`);
            }
        }
        catch (error) {
            logTest('Automatic Level-Up', false, error.response?.data?.error || error.message);
        }
        // Test 15: Test authentication requirement
        console.log('\n🔒 Test 15: Testing authentication requirement...');
        try {
            await axios.get(`${BASE_URL}/api/xp/profile`);
            logTest('Authentication Requirement', false, 'Endpoint accessible without auth');
        }
        catch (error) {
            const isUnauthorized = error.response?.status === 401 || error.response?.status === 403;
            logTest('Authentication Requirement', isUnauthorized, 'Endpoint properly secured');
        }
        // Test 16: Test admin-only XP awarding
        console.log('\n👮 Test 16: Testing admin-only XP awarding...');
        try {
            await axios.post(`${BASE_URL}/api/xp/award`, {
                userId,
                xpAmount: 100,
            }, {
                headers: { Authorization: `Bearer ${userAuthToken}` },
            });
            logTest('Admin-Only Award', false, 'Non-admin can award XP');
        }
        catch (error) {
            const isForbidden = error.response?.status === 403;
            logTest('Admin-Only Award', isForbidden, 'Non-admin properly blocked');
        }
        // Test 17: Test invalid category rejection
        console.log('\n❌ Test 17: Testing invalid category rejection...');
        try {
            await axios.post(`${BASE_URL}/api/xp/award`, {
                userId,
                xpAmount: 100,
                category: 'invalid-category',
            }, {
                headers: { Authorization: `Bearer ${adminAuthToken}` },
            });
            logTest('Invalid Category Rejection', false, 'Invalid category accepted');
        }
        catch (error) {
            const isBadRequest = error.response?.status === 400;
            logTest('Invalid Category Rejection', isBadRequest, 'Invalid category properly rejected');
        }
    }
    catch (error) {
        console.error('\n❌ Unexpected error during tests:', error.message);
    }
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    const passed = results.filter((r) => r.passed).length;
    const failed = results.filter((r) => r.passed === false).length;
    const total = results.length;
    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    if (failed > 0) {
        console.log('\nFailed Tests:');
        results
            .filter((r) => !r.passed)
            .forEach((r) => {
            console.log(`  - ${r.name}: ${r.message || 'No message'}`);
        });
    }
    console.log('\n' + '='.repeat(60));
    process.exit(failed > 0 ? 1 : 0);
}
// Run the tests
runTests();
//# sourceMappingURL=test-xp-system.js.map