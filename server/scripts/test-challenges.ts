import axios from 'axios';
import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import mongoose from 'mongoose';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:3000';

// Test data
let testUser = {
  email: `test-challenges-${Date.now()}@example.com`,
  password: 'Test123456!',
  name: 'Challenge Tester',
  userType: 'adult' as const,
  nativeLanguage: 'English',
  targetLanguage: 'Spanish',
  location: 'New York, USA',
};

let authToken = '';
let userId = '';
let challengeId = '';
let gameId = '';

// Helper function to make authenticated requests
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Test functions
async function testRegister() {
  console.log('\n🧪 Testing: User Registration');
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, testUser);

    if (response.data.user && response.data.accessToken) {
      authToken = response.data.accessToken;
      userId = response.data.user._id;
      console.log('✅ User registered successfully');
      console.log(`   User ID: ${userId}`);
      return true;
    } else {
      console.error('❌ Registration failed: Invalid response structure');
      return false;
    }
  } catch (error: any) {
    console.error('❌ Registration failed:', error.response?.data?.error || error.message);
    return false;
  }
}

async function testGetDailyChallenge() {
  console.log('\n🧪 Testing: Get Daily Challenge');
  try {
    const response = await apiClient.get('/api/challenges/daily');

    if (response.data.challenge && response.data.userChallenge && response.data.stats) {
      challengeId = response.data.challenge._id;
      console.log('✅ Daily challenge retrieved successfully');
      console.log(`   Challenge: ${response.data.challenge.title}`);
      console.log(`   Description: ${response.data.challenge.description}`);
      console.log(`   Type: ${response.data.challenge.type}`);
      console.log(`   Progress: ${response.data.userChallenge.progress.current}/${response.data.userChallenge.progress.target}`);
      console.log(`   XP Reward: ${response.data.challenge.rewards.xp}`);
      console.log(`   Stats - Completed: ${response.data.stats.totalCompleted}`);
      console.log(`   Stats - Total XP: ${response.data.stats.totalXPEarned}`);
      console.log(`   Stats - Bonus Badges: ${response.data.stats.bonusBadgesEarned}`);
      console.log(`   Stats - Streak: ${response.data.stats.currentStreak}`);
      return true;
    } else {
      console.error('❌ Invalid challenge response structure');
      return false;
    }
  } catch (error: any) {
    console.error('❌ Failed to get daily challenge:', error.response?.data?.error || error.message);
    return false;
  }
}

async function testGetActiveGame() {
  console.log('\n🧪 Testing: Get Active Game (for challenge progress)');
  try {
    const response = await apiClient.get('/api/games');

    if (response.data.games && response.data.games.length > 0) {
      gameId = response.data.games[0]._id;
      console.log('✅ Active game retrieved successfully');
      console.log(`   Game ID: ${gameId}`);
      console.log(`   Game Title: ${response.data.games[0].title}`);
      return true;
    } else {
      console.error('❌ No active games found');
      return false;
    }
  } catch (error: any) {
    console.error('❌ Failed to get games:', error.response?.data?.error || error.message);
    return false;
  }
}

async function testSubmitGameSessionForChallenge() {
  console.log('\n🧪 Testing: Submit Game Session (should update challenge progress)');
  try {
    // Get game details first
    const gameResponse = await apiClient.get(`/api/games/${gameId}`);
    const game = gameResponse.data.game;

    // Create a session with perfect score
    const sessionData = {
      score: game.questions.length * 10,
      maxScore: game.questions.length * 10,
      timeSpent: 60,
      answers: game.questions.map((_: any, index: number) => ({
        questionIndex: index,
        selectedAnswer: game.questions[index].correctAnswer,
        isCorrect: true,
        pointsEarned: 10,
      })),
    };

    const response = await apiClient.post(`/api/games/${gameId}/sessions`, sessionData);

    if (response.data.session && response.data.xpEarned) {
      console.log('✅ Game session submitted successfully');
      console.log(`   Session ID: ${response.data.session._id}`);
      console.log(`   Score: ${response.data.session.score}/${response.data.session.maxScore}`);
      console.log(`   XP Earned: ${response.data.xpEarned}`);
      return true;
    } else {
      console.error('❌ Invalid session response structure');
      return false;
    }
  } catch (error: any) {
    console.error('❌ Failed to submit game session:', error.response?.data?.error || error.message);
    return false;
  }
}

async function testChallengeProgressUpdated() {
  console.log('\n🧪 Testing: Verify Challenge Progress Updated');
  try {
    const response = await apiClient.get('/api/challenges/daily');

    if (response.data.userChallenge) {
      const progress = response.data.userChallenge.progress;
      console.log('✅ Challenge progress retrieved');
      console.log(`   Progress: ${progress.current}/${progress.target} (${progress.percentage}%)`);
      console.log(`   Status: ${response.data.userChallenge.status}`);

      if (progress.current > 0) {
        console.log('✅ Challenge progress was updated after game completion');
        return true;
      } else {
        console.error('❌ Challenge progress was not updated');
        return false;
      }
    } else {
      console.error('❌ Invalid challenge response');
      return false;
    }
  } catch (error: any) {
    console.error('❌ Failed to verify challenge progress:', error.response?.data?.error || error.message);
    return false;
  }
}

async function testCompleteMultipleGamesForChallenge() {
  console.log('\n🧪 Testing: Complete Multiple Games to Finish Challenge');
  try {
    const challengeResponse = await apiClient.get('/api/challenges/daily');
    const target = challengeResponse.data.userChallenge.progress.target;
    const current = challengeResponse.data.userChallenge.progress.current;
    const remaining = target - current;

    console.log(`   Need to complete ${remaining} more games to finish challenge`);

    for (let i = 0; i < remaining; i++) {
      const gameResponse = await apiClient.get(`/api/games/${gameId}`);
      const game = gameResponse.data.game;

      const sessionData = {
        score: game.questions.length * 10,
        maxScore: game.questions.length * 10,
        timeSpent: 60,
        answers: game.questions.map((_: any, index: number) => ({
          questionIndex: index,
          selectedAnswer: game.questions[index].correctAnswer,
          isCorrect: true,
          pointsEarned: 10,
        })),
      };

      await apiClient.post(`/api/games/${gameId}/sessions`, sessionData);
      console.log(`   ✅ Completed game ${i + 1}/${remaining}`);

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return true;
  } catch (error: any) {
    console.error('❌ Failed to complete games:', error.response?.data?.error || error.message);
    return false;
  }
}

async function testChallengeCompletion() {
  console.log('\n🧪 Testing: Verify Challenge Completion');
  try {
    const response = await apiClient.get('/api/challenges/daily');

    if (response.data.userChallenge) {
      const userChallenge = response.data.userChallenge;
      console.log('✅ Challenge status retrieved');
      console.log(`   Progress: ${userChallenge.progress.current}/${userChallenge.progress.target}`);
      console.log(`   Status: ${userChallenge.status}`);
      console.log(`   XP Earned: ${userChallenge.xpEarned}`);
      console.log(`   Bonus Badge Awarded: ${userChallenge.bonusBadgeAwarded}`);

      if (userChallenge.status === 'completed') {
        console.log('✅ Challenge was completed successfully!');
        if (userChallenge.completedAt) {
          console.log(`   Completed at: ${userChallenge.completedAt}`);
        }
        return true;
      } else {
        console.log('⚠️  Challenge not yet completed');
        return false;
      }
    } else {
      console.error('❌ Invalid challenge response');
      return false;
    }
  } catch (error: any) {
    console.error('❌ Failed to verify challenge completion:', error.response?.data?.error || error.message);
    return false;
  }
}

async function testChallengeHistory() {
  console.log('\n🧪 Testing: Get Challenge History');
  try {
    const response = await apiClient.get('/api/challenges/history', { params: { limit: 5 } });

    if (response.data.history && response.data.stats) {
      console.log('✅ Challenge history retrieved successfully');
      console.log(`   Total entries: ${response.data.history.length}`);

      response.data.history.forEach((entry: any, index: number) => {
        console.log(`   ${index + 1}. ${entry.challenge.title} - ${entry.userChallenge.status}`);
      });

      console.log(`   Overall Stats:`);
      console.log(`     - Total Completed: ${response.data.stats.totalCompleted}`);
      console.log(`     - Total XP: ${response.data.stats.totalXPEarned}`);
      console.log(`     - Bonus Badges: ${response.data.stats.bonusBadgesEarned}`);
      console.log(`     - Current Streak: ${response.data.stats.currentStreak}`);

      return true;
    } else {
      console.error('❌ Invalid history response structure');
      return false;
    }
  } catch (error: any) {
    console.error('❌ Failed to get challenge history:', error.response?.data?.error || error.message);
    return false;
  }
}

async function testChallengeStats() {
  console.log('\n🧪 Testing: Get Challenge Stats');
  try {
    const response = await apiClient.get('/api/challenges/stats');

    if (response.data.stats) {
      console.log('✅ Challenge stats retrieved successfully');
      console.log(`   Total Completed: ${response.data.stats.totalCompleted}`);
      console.log(`   Total XP Earned: ${response.data.stats.totalXPEarned}`);
      console.log(`   Bonus Badges Earned: ${response.data.stats.bonusBadgesEarned}`);
      console.log(`   Current Streak: ${response.data.stats.currentStreak}`);
      return true;
    } else {
      console.error('❌ Invalid stats response structure');
      return false;
    }
  } catch (error: any) {
    console.error('❌ Failed to get challenge stats:', error.response?.data?.error || error.message);
    return false;
  }
}

async function testDashboardWithChallenge() {
  console.log('\n🧪 Testing: Dashboard with Challenge Data');
  try {
    const response = await apiClient.get('/api/dashboard');

    if (response.data.dailyChallenge) {
      console.log('✅ Dashboard challenge data retrieved successfully');
      console.log(`   Challenge: ${response.data.dailyChallenge.title}`);
      console.log(`   Progress: ${response.data.dailyChallenge.progress}/${response.data.dailyChallenge.total}`);
      console.log(`   XP Reward: ${response.data.dailyChallenge.xpReward}`);
      return true;
    } else {
      console.error('❌ Dashboard missing challenge data');
      return false;
    }
  } catch (error: any) {
    console.error('❌ Failed to get dashboard:', error.response?.data?.error || error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Challenge System Tests');
  console.log('====================================');

  // Connect to database
  try {
    await connectDB();
    console.log('✅ Connected to database');
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }

  const results = {
    passed: 0,
    failed: 0,
    total: 0,
  };

  const tests = [
    { name: 'User Registration', fn: testRegister },
    { name: 'Get Daily Challenge', fn: testGetDailyChallenge },
    { name: 'Get Active Game', fn: testGetActiveGame },
    { name: 'Submit Game Session', fn: testSubmitGameSessionForChallenge },
    { name: 'Verify Challenge Progress', fn: testChallengeProgressUpdated },
    { name: 'Complete Multiple Games', fn: testCompleteMultipleGamesForChallenge },
    { name: 'Verify Challenge Completion', fn: testChallengeCompletion },
    { name: 'Get Challenge History', fn: testChallengeHistory },
    { name: 'Get Challenge Stats', fn: testChallengeStats },
    { name: 'Dashboard Integration', fn: testDashboardWithChallenge },
  ];

  for (const test of tests) {
    results.total++;
    const passed = await test.fn();
    if (passed) {
      results.passed++;
    } else {
      results.failed++;
    }
  }

  console.log('\n====================================');
  console.log('📊 Test Results Summary');
  console.log('====================================');
  console.log(`Total Tests: ${results.total}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${Math.round((results.passed / results.total) * 100)}%`);

  // Close database connection
  await mongoose.connection.close();
  console.log('\n✅ Database connection closed');

  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
