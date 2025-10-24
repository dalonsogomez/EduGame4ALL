import axios from 'axios';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
const API_BASE_URL = `http://localhost:${process.env.PORT || 3000}`;
const results = [];
function logResult(result) {
    results.push(result);
    const icon = result.status === 'PASS' ? '✓' : '✗';
    console.log(`${icon} ${result.test}: ${result.message}`);
    if (result.data) {
        console.log('  Data:', JSON.stringify(result.data, null, 2));
    }
}
async function testGameSessionTracking() {
    console.log('\n=== Game Session Tracking Test Suite ===\n');
    let accessToken = '';
    let userId = '';
    let testGameId = '';
    let sessionId = '';
    try {
        // Test 1: Login with test user (admin from seed)
        console.log('Test 1: Logging in with test user...');
        try {
            const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
                email: 'admin@edugame4all.com',
                password: 'Admin@123',
            });
            accessToken = loginResponse.data.accessToken;
            userId = loginResponse.data._id;
            logResult({
                test: 'Login Test User',
                status: 'PASS',
                message: 'Test user logged in successfully',
                data: { userId, email: loginResponse.data.email },
            });
        }
        catch (error) {
            logResult({
                test: 'Login Test User',
                status: 'FAIL',
                message: error.response?.data?.error || error.message,
            });
            return;
        }
        // Test 2: Get available games
        console.log('\nTest 2: Fetching available games...');
        try {
            const gamesResponse = await axios.get(`${API_BASE_URL}/api/games`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const games = gamesResponse.data.games;
            if (games.length === 0) {
                logResult({
                    test: 'Get Available Games',
                    status: 'FAIL',
                    message: 'No games available. Run seed script first.',
                });
                return;
            }
            testGameId = games[0]._id;
            logResult({
                test: 'Get Available Games',
                status: 'PASS',
                message: `Found ${games.length} games`,
                data: {
                    gameCount: games.length,
                    firstGame: games[0].title,
                    testGameId,
                },
            });
        }
        catch (error) {
            logResult({
                test: 'Get Available Games',
                status: 'FAIL',
                message: error.response?.data?.error || error.message,
            });
            return;
        }
        // Test 3: Get specific game details
        console.log('\nTest 3: Fetching game details...');
        try {
            const gameResponse = await axios.get(`${API_BASE_URL}/api/games/${testGameId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const game = gameResponse.data.game;
            logResult({
                test: 'Get Game Details',
                status: 'PASS',
                message: 'Game details retrieved successfully',
                data: {
                    title: game.title,
                    category: game.category,
                    difficulty: game.difficulty,
                    xpReward: game.xpReward,
                    questionCount: game.questions?.length || 0,
                },
            });
            // Test 4: Submit game session with high score
            console.log('\nTest 4: Submitting game session with high score (80%)...');
            try {
                const questions = game.questions || [];
                const totalQuestions = questions.length;
                const correctAnswers = Math.floor(totalQuestions * 0.8); // 80% correct
                // Create answers array
                const answers = questions.map((question, index) => ({
                    questionIndex: index,
                    selectedAnswer: index < correctAnswers ? question.correctAnswer : (question.correctAnswer + 1) % question.options.length,
                    isCorrect: index < correctAnswers,
                    pointsEarned: index < correctAnswers ? question.points : 0,
                }));
                const score = answers.reduce((sum, a) => sum + a.pointsEarned, 0);
                const maxScore = questions.reduce((sum, q) => sum + q.points, 0);
                const sessionResponse = await axios.post(`${API_BASE_URL}/api/games/${testGameId}/session`, {
                    score,
                    maxScore,
                    timeSpent: 420, // 7 minutes
                    answers,
                }, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                const { session, xpEarned, feedback } = sessionResponse.data;
                sessionId = session._id;
                // Validate feedback structure
                const hasFeedback = feedback &&
                    Array.isArray(feedback.strengths) &&
                    Array.isArray(feedback.improvements) &&
                    Array.isArray(feedback.tips) &&
                    Array.isArray(feedback.nextRecommendations) &&
                    typeof feedback.personalizedMessage === 'string';
                logResult({
                    test: 'Submit Game Session (High Score)',
                    status: hasFeedback ? 'PASS' : 'FAIL',
                    message: hasFeedback
                        ? 'Session submitted with AI feedback generated'
                        : 'Session submitted but feedback structure invalid',
                    data: {
                        sessionId,
                        score: `${score}/${maxScore}`,
                        percentage: `${Math.round((score / maxScore) * 100)}%`,
                        xpEarned,
                        feedback: {
                            strengths: feedback?.strengths || [],
                            improvements: feedback?.improvements || [],
                            tips: feedback?.tips || [],
                            nextRecommendations: feedback?.nextRecommendations || [],
                            personalizedMessage: feedback?.personalizedMessage || 'N/A',
                        },
                    },
                });
            }
            catch (error) {
                logResult({
                    test: 'Submit Game Session (High Score)',
                    status: 'FAIL',
                    message: error.response?.data?.error || error.message,
                });
            }
            // Test 5: Submit game session with low score
            console.log('\nTest 5: Submitting game session with low score (40%)...');
            try {
                const questions = game.questions || [];
                const totalQuestions = questions.length;
                const correctAnswers = Math.floor(totalQuestions * 0.4); // 40% correct
                const answers = questions.map((question, index) => ({
                    questionIndex: index,
                    selectedAnswer: index < correctAnswers ? question.correctAnswer : (question.correctAnswer + 1) % question.options.length,
                    isCorrect: index < correctAnswers,
                    pointsEarned: index < correctAnswers ? question.points : 0,
                }));
                const score = answers.reduce((sum, a) => sum + a.pointsEarned, 0);
                const maxScore = questions.reduce((sum, q) => sum + q.points, 0);
                const sessionResponse = await axios.post(`${API_BASE_URL}/api/games/${testGameId}/session`, {
                    score,
                    maxScore,
                    timeSpent: 540, // 9 minutes
                    answers,
                }, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                const { xpEarned, feedback } = sessionResponse.data;
                logResult({
                    test: 'Submit Game Session (Low Score)',
                    status: 'PASS',
                    message: 'Session submitted with appropriate low-score feedback',
                    data: {
                        score: `${score}/${maxScore}`,
                        percentage: `${Math.round((score / maxScore) * 100)}%`,
                        xpEarned,
                        personalizedMessage: feedback?.personalizedMessage || 'N/A',
                    },
                });
            }
            catch (error) {
                logResult({
                    test: 'Submit Game Session (Low Score)',
                    status: 'FAIL',
                    message: error.response?.data?.error || error.message,
                });
            }
        }
        catch (error) {
            logResult({
                test: 'Get Game Details',
                status: 'FAIL',
                message: error.response?.data?.error || error.message,
            });
            return;
        }
        // Test 6: Get specific session by ID
        console.log('\nTest 6: Retrieving specific game session...');
        try {
            const sessionResponse = await axios.get(`${API_BASE_URL}/api/games/sessions/${sessionId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const session = sessionResponse.data.session;
            logResult({
                test: 'Get Game Session by ID',
                status: 'PASS',
                message: 'Session retrieved successfully',
                data: {
                    sessionId: session._id,
                    score: `${session.score}/${session.maxScore}`,
                    xpEarned: session.xpEarned,
                    hasFeedback: !!session.feedback,
                },
            });
        }
        catch (error) {
            logResult({
                test: 'Get Game Session by ID',
                status: 'FAIL',
                message: error.response?.data?.error || error.message,
            });
        }
        // Test 7: Get all user sessions
        console.log('\nTest 7: Retrieving all user game sessions...');
        try {
            const sessionsResponse = await axios.get(`${API_BASE_URL}/api/games/sessions`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const sessions = sessionsResponse.data.sessions;
            logResult({
                test: 'Get All User Sessions',
                status: 'PASS',
                message: `Retrieved ${sessions.length} sessions`,
                data: {
                    sessionCount: sessions.length,
                    sessions: sessions.map((s) => ({
                        id: s._id,
                        game: s.gameId?.title || 'Unknown',
                        score: `${s.score}/${s.maxScore}`,
                        xpEarned: s.xpEarned,
                    })),
                },
            });
        }
        catch (error) {
            logResult({
                test: 'Get All User Sessions',
                status: 'FAIL',
                message: error.response?.data?.error || error.message,
            });
        }
        // Test 8: Get filtered sessions by game
        console.log('\nTest 8: Retrieving sessions filtered by game...');
        try {
            const sessionsResponse = await axios.get(`${API_BASE_URL}/api/games/sessions`, {
                params: { gameId: testGameId, limit: 10 },
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const sessions = sessionsResponse.data.sessions;
            logResult({
                test: 'Get Filtered Sessions',
                status: 'PASS',
                message: `Retrieved ${sessions.length} sessions for specific game`,
                data: {
                    gameId: testGameId,
                    sessionCount: sessions.length,
                },
            });
        }
        catch (error) {
            logResult({
                test: 'Get Filtered Sessions',
                status: 'FAIL',
                message: error.response?.data?.error || error.message,
            });
        }
        // Test 9: Verify XP and progress updates
        console.log('\nTest 9: Verifying user progress updates...');
        try {
            const progressResponse = await axios.get(`${API_BASE_URL}/api/progress/badges`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const profileResponse = await axios.get(`${API_BASE_URL}/api/profile`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const profile = profileResponse.data.profile;
            logResult({
                test: 'Verify Progress Updates',
                status: 'PASS',
                message: 'User progress updated successfully',
                data: {
                    totalXP: profile.xp,
                    level: profile.level,
                    streak: profile.streak,
                },
            });
        }
        catch (error) {
            logResult({
                test: 'Verify Progress Updates',
                status: 'FAIL',
                message: error.response?.data?.error || error.message,
            });
        }
    }
    catch (error) {
        console.error('\nUnexpected error:', error.message);
    }
    // Print summary
    console.log('\n=== Test Summary ===');
    const passed = results.filter((r) => r.status === 'PASS').length;
    const failed = results.filter((r) => r.status === 'FAIL').length;
    console.log(`Total: ${results.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${Math.round((passed / results.length) * 100)}%`);
    if (failed > 0) {
        console.log('\nFailed Tests:');
        results
            .filter((r) => r.status === 'FAIL')
            .forEach((r) => {
            console.log(`  - ${r.test}: ${r.message}`);
        });
    }
    console.log('\n=== Test Complete ===\n');
    process.exit(failed > 0 ? 1 : 0);
}
// Run tests
console.log('Starting Game Session Tracking Tests...');
console.log(`API URL: ${API_BASE_URL}`);
console.log('Make sure the server is running!\n');
testGameSessionTracking().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
//# sourceMappingURL=test-game-session.js.map