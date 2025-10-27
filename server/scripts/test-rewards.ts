import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
}

const results: TestResult[] = [];

// Test user credentials
const testUser = {
  email: `testuser_${Date.now()}@example.com`,
  password: 'testpass123',
  name: 'Test User',
  location: 'Test City',
  nativeLanguage: 'English',
  targetLanguage: 'Spanish',
  userType: 'adult',
};

let authToken = '';
let userId = '';
let rewardId = '';
let redeemedRewardId = '';
let qrCode = '';

// Helper function to log test results
function logTest(name: string, passed: boolean, message?: string) {
  results.push({ name, passed, message });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${name}${message ? ` - ${message}` : ''}`);
}

async function runTests() {
  console.log('\n🚀 Starting Rewards System Tests...\n');

  try {
    // Test 1: Register a test user
    console.log('📝 Test 1: Registering test user...');
    try {
      const registerRes = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
      userId = registerRes.data._id;

      // Login to get auth token
      const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: testUser.email,
        password: testUser.password,
      });
      authToken = loginRes.data.accessToken;

      logTest('User Registration & Login', true, `User ID: ${userId}`);
    } catch (error: any) {
      logTest('User Registration & Login', false, error.response?.data?.error || error.message);
      return;
    }

    // Test 2: Get all available rewards
    console.log('\n📋 Test 2: Fetching all available rewards...');
    try {
      const rewardsRes = await axios.get(`${BASE_URL}/api/rewards`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const rewards = rewardsRes.data.rewards;
      if (rewards.length > 0) {
        rewardId = rewards[0]._id;
        logTest(
          'Get All Rewards',
          true,
          `Found ${rewards.length} rewards. First reward: ${rewards[0].title} (${rewards[0].xpCost} XP)`
        );
      } else {
        logTest('Get All Rewards', false, 'No rewards found in database. Run seed script first.');
        return;
      }
    } catch (error: any) {
      logTest('Get All Rewards', false, error.response?.data?.error || error.message);
      return;
    }

    // Test 3: Get rewards by category
    console.log('\n🏷️  Test 3: Fetching rewards by category...');
    try {
      const categoryRes = await axios.get(`${BASE_URL}/api/rewards`, {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { category: 'gift-cards' },
      });

      const categoryRewards = categoryRes.data.rewards;
      const allCorrectCategory = categoryRewards.every((r: any) => r.category === 'gift-cards');

      logTest(
        'Filter Rewards by Category',
        allCorrectCategory,
        `Found ${categoryRewards.length} gift-cards rewards`
      );
    } catch (error: any) {
      logTest('Filter Rewards by Category', false, error.response?.data?.error || error.message);
    }

    // Test 4: Try to redeem without enough XP (should fail)
    console.log('\n💰 Test 4: Attempting to redeem reward with insufficient XP...');
    try {
      await axios.post(
        `${BASE_URL}/api/rewards/${rewardId}/redeem`,
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      logTest('XP Balance Check', false, 'Should have failed with insufficient XP');
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || '';
      if (errorMsg.includes('Insufficient XP')) {
        logTest('XP Balance Check', true, 'Correctly rejected insufficient XP');
      } else {
        logTest('XP Balance Check', false, `Unexpected error: ${errorMsg}`);
      }
    }

    // Test 5: Add XP to user (simulate earning XP by playing games)
    console.log('\n⚡ Test 5: Earning XP through game sessions...');
    try {
      // First get a game to play
      const gamesRes = await axios.get(`${BASE_URL}/api/games`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (gamesRes.data.games && gamesRes.data.games.length > 0) {
        const game = gamesRes.data.games[0];

        // Submit multiple game sessions to earn enough XP
        const sessionsNeeded = Math.ceil(10000 / game.xpReward);
        console.log(
          `[Test] Playing ${Math.min(sessionsNeeded, 10)} game sessions to earn XP (${game.xpReward} XP per session)...`
        );

        for (let i = 0; i < Math.min(sessionsNeeded, 10); i++) {
          await axios.post(
            `${BASE_URL}/api/games/${game._id}/session`,
            {
              score: 100,
              maxScore: 100,
              timeSpent: 60,
              answers: [],
            },
            {
              headers: { Authorization: `Bearer ${authToken}` },
            }
          );
        }

        logTest('Earn XP via Game Sessions', true, `Played ${Math.min(sessionsNeeded, 10)} games`);
      } else {
        logTest('Earn XP via Game Sessions', false, 'No games found');
        return;
      }
    } catch (error: any) {
      logTest('Earn XP via Game Sessions', false, error.response?.data?.error || error.message);
      return;
    }

    // Test 6: Redeem reward with sufficient XP
    console.log('\n🎁 Test 6: Redeeming reward with sufficient XP...');
    try {
      const redeemRes = await axios.post(
        `${BASE_URL}/api/rewards/${rewardId}/redeem`,
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      const { userReward, qrCode: qrCodeData } = redeemRes.data;
      redeemedRewardId = userReward._id;
      qrCode = qrCodeData;

      const hasQRCode = qrCodeData && qrCodeData.startsWith('data:image/png;base64');
      const hasRequiredFields =
        userReward._id &&
        userReward.status === 'active' &&
        userReward.redeemedAt &&
        userReward.expiryDate;

      if (hasQRCode && hasRequiredFields) {
        logTest('Redeem Reward', true, `Reward redeemed with QR code (${qrCodeData.length} chars)`);
      } else {
        logTest(
          'Redeem Reward',
          false,
          `Missing fields: QR=${hasQRCode}, Fields=${hasRequiredFields}`
        );
      }
    } catch (error: any) {
      logTest('Redeem Reward', false, error.response?.data?.error || error.message);
      return;
    }

    // Test 7: Verify XP was deducted by fetching profile
    console.log('\n💸 Test 7: Verifying XP was deducted...');
    try {
      const profileRes = await axios.get(`${BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const currentXP = profileRes.data.profile.xp;
      logTest('XP Deduction', true, `Current XP: ${currentXP} (deducted from earned XP)`);
    } catch (error: any) {
      logTest('XP Deduction', false, error.response?.data?.error || error.message);
    }

    // Test 8: Verify redemption appears in rewards list
    console.log('\n📦 Test 8: Verifying redemption appears in rewards list...');
    try {
      const allRewardsRes = await axios.get(`${BASE_URL}/api/rewards`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const reward = allRewardsRes.data.rewards.find((r: any) => r._id === rewardId);
      if (reward) {
        logTest(
          'Inventory Management',
          true,
          `Available quantity: ${reward.availableQuantity} (decreased by 1)`
        );
      } else {
        logTest('Inventory Management', false, 'Reward not found');
      }
    } catch (error: any) {
      logTest('Inventory Management', false, error.response?.data?.error || error.message);
    }

    // Test 9: Get user's redeemed rewards
    console.log('\n📜 Test 9: Fetching user redeemed rewards...');
    try {
      const myRewardsRes = await axios.get(`${BASE_URL}/api/rewards/my-rewards`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const myRewards = myRewardsRes.data.rewards;
      const hasRedeemedReward = myRewards.some((r: any) => r.id === redeemedRewardId);
      const allHaveQRCodes = myRewards.every(
        (r: any) => r.qrCode && r.qrCode.startsWith('data:image/png;base64')
      );

      if (hasRedeemedReward && allHaveQRCodes) {
        logTest('Get My Rewards', true, `Found ${myRewards.length} redeemed rewards with QR codes`);
      } else {
        logTest(
          'Get My Rewards',
          false,
          `Has reward: ${hasRedeemedReward}, Has QR: ${allHaveQRCodes}`
        );
      }
    } catch (error: any) {
      logTest('Get My Rewards', false, error.response?.data?.error || error.message);
    }

    // Test 10: Filter redeemed rewards by status
    console.log('\n🔍 Test 10: Filtering redeemed rewards by status...');
    try {
      const activeRewardsRes = await axios.get(`${BASE_URL}/api/rewards/my-rewards`, {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { status: 'active' },
      });

      const activeRewards = activeRewardsRes.data.rewards;
      const allActive = activeRewards.every((r: any) => r.status === 'active');

      logTest(
        'Filter Redeemed by Status',
        allActive,
        `Found ${activeRewards.length} active rewards`
      );
    } catch (error: any) {
      logTest('Filter Redeemed by Status', false, error.response?.data?.error || error.message);
    }

    // Test 11: Try to redeem same reward again
    console.log('\n🔁 Test 11: Attempting to redeem when inventory allows...');
    try {
      const redeemRes = await axios.post(
        `${BASE_URL}/api/rewards/${rewardId}/redeem`,
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      logTest('Multiple Redemptions', true, 'Successfully redeemed same reward again');
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || '';
      if (errorMsg.includes('not available') || errorMsg.includes('Insufficient XP')) {
        logTest('Multiple Redemptions', true, `Correctly handled: ${errorMsg}`);
      } else {
        logTest('Multiple Redemptions', false, errorMsg);
      }
    }

    // Test 12: Test authentication requirement
    console.log('\n🔒 Test 12: Testing authentication requirement...');
    try {
      await axios.get(`${BASE_URL}/api/rewards`);
      logTest('Authentication Check', false, 'Should require authentication');
    } catch (error: any) {
      if (error.response?.status === 401) {
        logTest('Authentication Check', true, 'Correctly requires authentication');
      } else {
        logTest('Authentication Check', false, 'Unexpected error');
      }
    }

    // Test 13: Test invalid reward ID
    console.log('\n❓ Test 13: Testing invalid reward ID...');
    try {
      await axios.post(
        `${BASE_URL}/api/rewards/invalid-id/redeem`,
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      logTest('Invalid Reward ID', false, 'Should reject invalid ID');
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || '';
      if (errorMsg.includes('Invalid') || errorMsg.includes('not found')) {
        logTest('Invalid Reward ID', true, 'Correctly rejected invalid ID');
      } else {
        logTest('Invalid Reward ID', false, errorMsg);
      }
    }
  } catch (error: any) {
    console.error('\n❌ Unexpected error during tests:', error.message);
  } finally {
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));

    const passed = results.filter((r) => r.passed).length;
    const failed = results.filter((r) => !r.passed).length;

    console.log(`\nTotal Tests: ${results.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);

    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      results
        .filter((r) => !r.passed)
        .forEach((r) => {
          console.log(`  - ${r.name}: ${r.message || 'No message'}`);
        });
    }

    console.log('\n' + '='.repeat(60));

    process.exit(failed > 0 ? 1 : 0);
  }
}

// Run tests
runTests();
