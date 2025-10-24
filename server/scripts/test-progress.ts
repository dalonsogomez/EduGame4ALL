import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

function log(message: string) {
  console.log(`[Test] ${message}`);
}

function logResult(name: string, passed: boolean, message: string) {
  results.push({ name, passed, message });
  const status = passed ? '✓ PASS' : '✗ FAIL';
  console.log(`${status}: ${name} - ${message}`);
}

async function testProgressEndpoints() {
  log('Starting Progress Endpoints Test Suite');
  console.log('=====================================\n');

  let accessToken: string;
  let testUserId: string;

  try {
    // Step 1: Create test user and login
    log('Step 1: Creating test user and logging in');

    const timestamp = Date.now();
    const testUser = {
      email: `progress-test-${timestamp}@test.com`,
      password: 'TestPassword123!',
      name: 'Progress Test User',
      userType: 'adult' as const,
      location: 'Test City',
      nativeLanguage: 'Spanish',
      targetLanguage: 'English',
    };

    try {
      const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
      logResult('User Registration', true, 'Test user registered successfully');
      testUserId = registerResponse.data._id;

      // Login to get access token
      const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: testUser.email,
        password: testUser.password,
      });
      accessToken = loginResponse.data.accessToken;
      logResult('User Login', true, 'Test user logged in successfully');
    } catch (error: any) {
      logResult('User Registration/Login', false, error.response?.data?.error || error.message);
      throw error;
    }

    // Step 2: Test GET /api/progress/badges
    log('\nStep 2: Testing GET /api/progress/badges');

    try {
      const badgesResponse = await axios.get(`${BASE_URL}/api/progress/badges`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { badges } = badgesResponse.data;

      if (!Array.isArray(badges)) {
        logResult('Get Badges - Structure', false, 'Badges should be an array');
      } else {
        logResult('Get Badges - Structure', true, `Received ${badges.length} badges`);

        if (badges.length > 0) {
          const badge = badges[0];
          const hasRequiredFields =
            badge.hasOwnProperty('_id') &&
            badge.hasOwnProperty('name') &&
            badge.hasOwnProperty('description') &&
            badge.hasOwnProperty('category') &&
            badge.hasOwnProperty('icon') &&
            badge.hasOwnProperty('progress') &&
            badge.hasOwnProperty('isEarned');

          if (hasRequiredFields) {
            logResult('Get Badges - Fields', true, 'Badge has all required fields');
            log(`  Sample badge: ${badge.name} - ${badge.progress}% complete, earned: ${badge.isEarned}`);
          } else {
            logResult('Get Badges - Fields', false, 'Badge missing required fields');
          }
        }
      }
    } catch (error: any) {
      logResult('Get Badges', false, error.response?.data?.error || error.message);
    }

    // Step 3: Create some game sessions for history testing
    log('\nStep 3: Creating game sessions for testing');

    try {
      // Get a game to play
      const gamesResponse = await axios.get(`${BASE_URL}/api/games`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (gamesResponse.data.games && gamesResponse.data.games.length > 0) {
        const game = gamesResponse.data.games[0];

        // Submit 2 game sessions
        for (let i = 0; i < 2; i++) {
          const sessionData = {
            gameId: game._id,
            score: 7 + i,
            maxScore: 10,
            timeSpent: 300 + (i * 50),
            answers: game.questions?.slice(0, 3).map((q: any, idx: number) => ({
              questionId: q._id || `q${idx}`,
              question: q.question,
              selectedAnswer: idx === 0 ? q.correctAnswer : q.options[0],
              correctAnswer: q.correctAnswer,
              isCorrect: idx === 0,
            })) || [],
          };

          await axios.post(`${BASE_URL}/api/games/sessions`, sessionData, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        }

        logResult('Create Game Sessions', true, 'Created 2 game sessions for testing');
      } else {
        logResult('Create Game Sessions', false, 'No games available for testing');
      }
    } catch (error: any) {
      logResult('Create Game Sessions', false, error.response?.data?.error || error.message);
    }

    // Step 4: Test GET /api/progress/history
    log('\nStep 4: Testing GET /api/progress/history');

    try {
      const historyResponse = await axios.get(`${BASE_URL}/api/progress/history`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { history } = historyResponse.data;

      if (!Array.isArray(history)) {
        logResult('Get History - Structure', false, 'History should be an array');
      } else {
        logResult('Get History - Structure', true, `Received ${history.length} game sessions`);

        if (history.length > 0) {
          const session = history[0];
          const hasRequiredFields =
            session.hasOwnProperty('id') &&
            session.hasOwnProperty('game') &&
            session.game.hasOwnProperty('id') &&
            session.game.hasOwnProperty('title') &&
            session.game.hasOwnProperty('category') &&
            session.hasOwnProperty('score') &&
            session.hasOwnProperty('maxScore') &&
            session.hasOwnProperty('xpEarned') &&
            session.hasOwnProperty('completedAt') &&
            session.hasOwnProperty('accuracy');

          if (hasRequiredFields) {
            logResult('Get History - Fields', true, 'Session has all required fields');
            log(`  Sample session: ${session.game.title} - Score: ${session.score}/${session.maxScore} (${session.accuracy}%)`);
          } else {
            logResult('Get History - Fields', false, 'Session missing required fields');
          }
        }
      }
    } catch (error: any) {
      logResult('Get History', false, error.response?.data?.error || error.message);
    }

    // Step 5: Test GET /api/progress/history with limit
    log('\nStep 5: Testing GET /api/progress/history with limit parameter');

    try {
      const historyResponse = await axios.get(`${BASE_URL}/api/progress/history?limit=1`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { history } = historyResponse.data;

      if (history.length <= 1) {
        logResult('Get History - Limit', true, `Limit parameter working, received ${history.length} session(s)`);
      } else {
        logResult('Get History - Limit', false, 'Limit parameter not working correctly');
      }
    } catch (error: any) {
      logResult('Get History - Limit', false, error.response?.data?.error || error.message);
    }

    // Step 6: Test GET /api/progress/weekly-report
    log('\nStep 6: Testing GET /api/progress/weekly-report');

    try {
      const reportResponse = await axios.get(`${BASE_URL}/api/progress/weekly-report`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { report } = reportResponse.data;

      // Check structure
      const hasRequiredFields =
        report.hasOwnProperty('gamesPlayed') &&
        report.hasOwnProperty('totalTime') &&
        report.hasOwnProperty('xpEarned') &&
        report.hasOwnProperty('avgAccuracy') &&
        report.hasOwnProperty('period') &&
        report.hasOwnProperty('categoryBreakdown') &&
        report.hasOwnProperty('weeklyActivity') &&
        report.hasOwnProperty('strengths') &&
        report.hasOwnProperty('improvements') &&
        report.hasOwnProperty('insights') &&
        report.hasOwnProperty('aiSummary');

      if (hasRequiredFields) {
        logResult('Get Weekly Report - Structure', true, 'Report has all required fields');
      } else {
        logResult('Get Weekly Report - Structure', false, 'Report missing required fields');
      }

      // Check summary fields (now at top level)
      const summaryValid =
        typeof report.gamesPlayed === 'number' &&
        typeof report.xpEarned === 'number' &&
        typeof report.totalTime === 'number' &&
        typeof report.avgAccuracy === 'number';

      if (summaryValid) {
        logResult('Get Weekly Report - Summary', true,
          `Games: ${report.gamesPlayed}, XP: ${report.xpEarned}, Time: ${report.totalTime}min, Accuracy: ${report.avgAccuracy}%`);
      } else {
        logResult('Get Weekly Report - Summary', false, 'Summary fields have incorrect types');
      }

      // Check AI insights
      if (Array.isArray(report.strengths) && Array.isArray(report.improvements) && Array.isArray(report.insights)) {
        logResult('Get Weekly Report - AI Insights', true,
          `Strengths: ${report.strengths.length}, Improvements: ${report.improvements.length}, Insights: ${report.insights.length}`);

        if (report.aiSummary && report.aiSummary.length > 0) {
          log(`  AI Summary: "${report.aiSummary.substring(0, 100)}..."`);
          logResult('Get Weekly Report - AI Summary', true, 'AI-generated summary present');
        } else {
          logResult('Get Weekly Report - AI Summary', false, 'AI summary missing or empty');
        }
      } else {
        logResult('Get Weekly Report - AI Insights', false, 'AI insights are not arrays');
      }

      // Check weekly activity
      if (Array.isArray(report.weeklyActivity) && report.weeklyActivity.length === 7) {
        logResult('Get Weekly Report - Activity', true, `7 days of activity data present`);

        const activityValid = report.weeklyActivity.every((day: any) =>
          day.hasOwnProperty('day') &&
          day.hasOwnProperty('xp') &&
          typeof day.xp === 'number'
        );

        if (activityValid) {
          logResult('Get Weekly Report - Activity Structure', true, 'Activity data structure valid');
        } else {
          logResult('Get Weekly Report - Activity Structure', false, 'Activity data structure invalid');
        }
      } else {
        logResult('Get Weekly Report - Activity', false, `Expected 7 days, got ${report.weeklyActivity?.length || 0}`);
      }

      // Check category breakdown
      if (report.categoryBreakdown) {
        const hasCategories =
          report.categoryBreakdown.hasOwnProperty('language') &&
          report.categoryBreakdown.hasOwnProperty('culture') &&
          report.categoryBreakdown.hasOwnProperty('soft-skills');

        if (hasCategories) {
          logResult('Get Weekly Report - Categories', true, 'All category breakdowns present');
        } else {
          logResult('Get Weekly Report - Categories', false, 'Missing category breakdowns');
        }
      }

    } catch (error: any) {
      logResult('Get Weekly Report', false, error.response?.data?.error || error.message);
    }

    // Step 7: Test authentication requirement
    log('\nStep 7: Testing authentication requirement');

    try {
      await axios.get(`${BASE_URL}/api/progress/badges`);
      logResult('Authentication Required', false, 'Endpoint accessible without token');
    } catch (error: any) {
      if (error.response?.status === 401) {
        logResult('Authentication Required', true, 'Endpoint properly protected');
      } else {
        logResult('Authentication Required', false, 'Unexpected error: ' + error.message);
      }
    }

  } catch (error: any) {
    console.error('\n❌ Test suite failed with error:', error.message);
  }

  // Summary
  console.log('\n=====================================');
  console.log('Test Summary');
  console.log('=====================================');

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;

  console.log(`Total Tests: ${total}`);
  console.log(`Passed: ${passed} ✓`);
  console.log(`Failed: ${failed} ✗`);
  console.log(`Success Rate: ${Math.round((passed / total) * 100)}%`);

  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}: ${r.message}`);
    });
  }

  console.log('\n=====================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
testProgressEndpoints().catch((error) => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
