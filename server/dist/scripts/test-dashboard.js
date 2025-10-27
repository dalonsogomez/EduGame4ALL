import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });
const API_URL = process.env.API_URL || 'http://localhost:3000';
let authToken = '';
let testUserId = '';
async function testDashboardEndpoint() {
    console.log('\n🧪 Starting Dashboard API Tests...\n');
    const results = [];
    try {
        // Test 1: Login/Register test user
        console.log('📝 Test 1: Authenticating test user...');
        try {
            const testEmail = `test-dashboard-${Date.now()}@example.com`;
            const testPassword = 'TestPassword123!';
            // Register user
            const registerRes = await axios.post(`${API_URL}/api/auth/register`, {
                email: testEmail,
                password: testPassword,
                name: 'Dashboard Test User',
            });
            testUserId = registerRes.data._id;
            // Login to get access token
            const loginRes = await axios.post(`${API_URL}/api/auth/login`, {
                email: testEmail,
                password: testPassword,
            });
            authToken = loginRes.data.accessToken;
            console.log('✅ Test 1 Passed: User authenticated successfully');
            console.log(`   User ID: ${testUserId}`);
            results.push({
                success: true,
                message: 'User authentication successful',
                data: { userId: testUserId },
            });
        }
        catch (error) {
            console.log('❌ Test 1 Failed:', error.response?.data || error.message);
            results.push({
                success: false,
                message: `Authentication failed: ${error.response?.data?.error || error.message}`,
            });
            return;
        }
        // Test 2: Get dashboard data
        console.log('\n📊 Test 2: Fetching dashboard data...');
        try {
            const dashboardRes = await axios.get(`${API_URL}/api/dashboard`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            const dashboardData = dashboardRes.data;
            console.log('✅ Test 2 Passed: Dashboard data retrieved');
            console.log('   Dashboard structure:', JSON.stringify(dashboardData, null, 2));
            // Validate structure
            const requiredFields = ['skills', 'dailyChallenge', 'recentActivity', 'leaderboard'];
            const missingFields = requiredFields.filter((field) => !(field in dashboardData));
            if (missingFields.length > 0) {
                console.log(`⚠️  Warning: Missing fields: ${missingFields.join(', ')}`);
            }
            results.push({
                success: true,
                message: 'Dashboard data retrieved successfully',
                data: dashboardData,
            });
        }
        catch (error) {
            console.log('❌ Test 2 Failed:', error.response?.data || error.message);
            results.push({
                success: false,
                message: `Dashboard fetch failed: ${error.response?.data?.error || error.message}`,
            });
        }
        // Test 3: Validate skills structure
        console.log('\n🎯 Test 3: Validating skills structure...');
        try {
            const dashboardRes = await axios.get(`${API_URL}/api/dashboard`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            const { skills } = dashboardRes.data;
            if (!Array.isArray(skills)) {
                throw new Error('Skills should be an array');
            }
            const requiredCategories = ['language', 'culture', 'softSkills'];
            const categories = skills.map((s) => s.category);
            requiredCategories.forEach((category) => {
                if (!categories.includes(category)) {
                    throw new Error(`Missing skill category: ${category}`);
                }
            });
            skills.forEach((skill) => {
                const requiredProps = ['category', 'level', 'xp', 'xpToNextLevel', 'percentage'];
                requiredProps.forEach((prop) => {
                    if (!(prop in skill)) {
                        throw new Error(`Skill missing property: ${prop}`);
                    }
                });
            });
            console.log('✅ Test 3 Passed: Skills structure is valid');
            console.log('   Skills:', JSON.stringify(skills, null, 2));
            results.push({
                success: true,
                message: 'Skills structure validated',
                data: skills,
            });
        }
        catch (error) {
            console.log('❌ Test 3 Failed:', error.message);
            results.push({
                success: false,
                message: `Skills validation failed: ${error.message}`,
            });
        }
        // Test 4: Validate daily challenge structure
        console.log('\n🎮 Test 4: Validating daily challenge structure...');
        try {
            const dashboardRes = await axios.get(`${API_URL}/api/dashboard`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            const { dailyChallenge } = dashboardRes.data;
            const requiredProps = ['_id', 'title', 'description', 'progress', 'total', 'xpReward'];
            requiredProps.forEach((prop) => {
                if (!(prop in dailyChallenge)) {
                    throw new Error(`Daily challenge missing property: ${prop}`);
                }
            });
            console.log('✅ Test 4 Passed: Daily challenge structure is valid');
            console.log('   Daily Challenge:', JSON.stringify(dailyChallenge, null, 2));
            results.push({
                success: true,
                message: 'Daily challenge structure validated',
                data: dailyChallenge,
            });
        }
        catch (error) {
            console.log('❌ Test 4 Failed:', error.message);
            results.push({
                success: false,
                message: `Daily challenge validation failed: ${error.message}`,
            });
        }
        // Test 5: Validate leaderboard structure
        console.log('\n🏆 Test 5: Validating leaderboard structure...');
        try {
            const dashboardRes = await axios.get(`${API_URL}/api/dashboard`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            const { leaderboard } = dashboardRes.data;
            if (!Array.isArray(leaderboard)) {
                throw new Error('Leaderboard should be an array');
            }
            if (leaderboard.length > 0) {
                const entry = leaderboard[0];
                const requiredProps = ['rank', 'userId', 'username', 'xp'];
                requiredProps.forEach((prop) => {
                    if (!(prop in entry)) {
                        throw new Error(`Leaderboard entry missing property: ${prop}`);
                    }
                });
            }
            console.log('✅ Test 5 Passed: Leaderboard structure is valid');
            console.log(`   Leaderboard entries: ${leaderboard.length}`);
            results.push({
                success: true,
                message: 'Leaderboard structure validated',
                data: { count: leaderboard.length },
            });
        }
        catch (error) {
            console.log('❌ Test 5 Failed:', error.message);
            results.push({
                success: false,
                message: `Leaderboard validation failed: ${error.message}`,
            });
        }
        // Test 6: Validate recent activity structure
        console.log('\n📜 Test 6: Validating recent activity structure...');
        try {
            const dashboardRes = await axios.get(`${API_URL}/api/dashboard`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            const { recentActivity } = dashboardRes.data;
            if (!Array.isArray(recentActivity)) {
                throw new Error('Recent activity should be an array');
            }
            if (recentActivity.length > 0) {
                const activity = recentActivity[0];
                const requiredProps = ['_id', 'type', 'message', 'timestamp', 'icon'];
                requiredProps.forEach((prop) => {
                    if (!(prop in activity)) {
                        throw new Error(`Activity missing property: ${prop}`);
                    }
                });
            }
            console.log('✅ Test 6 Passed: Recent activity structure is valid');
            console.log(`   Activity entries: ${recentActivity.length}`);
            results.push({
                success: true,
                message: 'Recent activity structure validated',
                data: { count: recentActivity.length },
            });
        }
        catch (error) {
            console.log('❌ Test 6 Failed:', error.message);
            results.push({
                success: false,
                message: `Recent activity validation failed: ${error.message}`,
            });
        }
        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 Test Summary');
        console.log('='.repeat(50));
        const passed = results.filter((r) => r.success).length;
        const failed = results.filter((r) => !r.success).length;
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);
        console.log('\n' + '='.repeat(50));
        console.log('Detailed Results:');
        console.log('='.repeat(50));
        results.forEach((result, index) => {
            console.log(`\nTest ${index + 1}: ${result.success ? '✅' : '❌'} ${result.message}`);
            if (result.data) {
                console.log(`Data: ${JSON.stringify(result.data, null, 2)}`);
            }
        });
        process.exit(failed === 0 ? 0 : 1);
    }
    catch (error) {
        console.error('\n❌ Fatal error during testing:', error.message);
        process.exit(1);
    }
}
// Run tests
testDashboardEndpoint();
//# sourceMappingURL=test-dashboard.js.map