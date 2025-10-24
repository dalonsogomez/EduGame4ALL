/**
 * Test script for Games CRUD API endpoints
 *
 * This script tests:
 * 1. Admin authentication
 * 2. Creating a new game
 * 3. Fetching all games (including inactive)
 * 4. Fetching games by category and difficulty
 * 5. Fetching a specific game by ID
 * 6. Updating a game
 * 7. Deleting a game (soft delete)
 *
 * Run with: npm run test:games-crud
 */

import axios from 'axios';

const BASE_URL = process.env.API_URL || 'http://localhost:3000';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

// Admin credentials (from seed script)
const ADMIN_CREDENTIALS = {
  email: 'admin@edugame4all.com',
  password: 'Admin@123',
};

let adminToken = '';
let createdGameId = '';

/**
 * Helper function to log test results
 */
function logResult(name: string, passed: boolean, error?: string) {
  results.push({ name, passed, error });
  const status = passed ? '✓ PASS' : '✗ FAIL';
  console.log(`${status}: ${name}`);
  if (error) {
    console.log(`  Error: ${error}`);
  }
}

/**
 * Test 1: Admin Login
 */
async function testAdminLogin() {
  try {
    console.log('\n--- Test 1: Admin Login ---');
    const response = await axios.post(`${BASE_URL}/api/auth/login`, ADMIN_CREDENTIALS);

    if (response.data.accessToken) {
      adminToken = response.data.accessToken;
      console.log('Admin logged in successfully');
      console.log(`Token: ${adminToken.substring(0, 20)}...`);
      logResult('Admin Login', true);
      return true;
    } else {
      logResult('Admin Login', false, 'No access token received');
      return false;
    }
  } catch (error: any) {
    logResult('Admin Login', false, error.response?.data?.error || error.message);
    return false;
  }
}

/**
 * Test 2: Create a new game
 */
async function testCreateGame() {
  try {
    console.log('\n--- Test 2: Create Game ---');
    const gameData = {
      title: 'Test Game - Spanish Numbers',
      description: 'Learn Spanish numbers from 1 to 100 through interactive questions',
      category: 'language',
      difficulty: 2,
      duration: 15,
      xpReward: 150,
      thumbnailUrl: 'https://example.com/spanish-numbers.jpg',
      questions: [
        {
          question: 'What is "five" in Spanish?',
          options: ['Tres', 'Cuatro', 'Cinco', 'Seis'],
          correctAnswer: 2,
          explanation: 'Cinco is the Spanish word for five',
          points: 10,
        },
        {
          question: 'What is "ten" in Spanish?',
          options: ['Diez', 'Nueve', 'Once', 'Doce'],
          correctAnswer: 0,
          explanation: 'Diez is the Spanish word for ten',
          points: 10,
        },
        {
          question: 'How do you say "twenty" in Spanish?',
          options: ['Quince', 'Dieciocho', 'Veinte', 'Treinta'],
          correctAnswer: 2,
          explanation: 'Veinte is the Spanish word for twenty',
          points: 10,
        },
      ],
    };

    const response = await axios.post(`${BASE_URL}/api/games`, gameData, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (response.data.game && response.data.game._id) {
      createdGameId = response.data.game._id;
      console.log('Game created successfully');
      console.log(`Game ID: ${createdGameId}`);
      console.log(`Title: ${response.data.game.title}`);
      console.log(`Category: ${response.data.game.category}`);
      console.log(`Difficulty: ${response.data.game.difficulty}`);
      console.log(`Questions: ${response.data.game.questions.length}`);
      logResult('Create Game', true);
      return true;
    } else {
      logResult('Create Game', false, 'No game returned');
      return false;
    }
  } catch (error: any) {
    logResult('Create Game', false, error.response?.data?.error || error.message);
    return false;
  }
}

/**
 * Test 3: Fetch all games (including inactive)
 */
async function testGetAllGames() {
  try {
    console.log('\n--- Test 3: Get All Games (Admin) ---');
    const response = await axios.get(`${BASE_URL}/api/games/admin/all`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (response.data.games && Array.isArray(response.data.games)) {
      console.log(`Found ${response.data.games.length} total games`);
      const activeGames = response.data.games.filter((g: any) => g.isActive);
      const inactiveGames = response.data.games.filter((g: any) => !g.isActive);
      console.log(`Active: ${activeGames.length}, Inactive: ${inactiveGames.length}`);
      logResult('Get All Games', true);
      return true;
    } else {
      logResult('Get All Games', false, 'Invalid response structure');
      return false;
    }
  } catch (error: any) {
    logResult('Get All Games', false, error.response?.data?.error || error.message);
    return false;
  }
}

/**
 * Test 4: Filter games by category
 */
async function testFilterByCategory() {
  try {
    console.log('\n--- Test 4: Filter Games by Category ---');
    const response = await axios.get(`${BASE_URL}/api/games?category=language`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (response.data.games && Array.isArray(response.data.games)) {
      console.log(`Found ${response.data.games.length} language games`);
      const allLanguageGames = response.data.games.every((g: any) => g.category === 'language');
      if (allLanguageGames) {
        logResult('Filter by Category', true);
        return true;
      } else {
        logResult('Filter by Category', false, 'Some games have wrong category');
        return false;
      }
    } else {
      logResult('Filter by Category', false, 'Invalid response structure');
      return false;
    }
  } catch (error: any) {
    logResult('Filter by Category', false, error.response?.data?.error || error.message);
    return false;
  }
}

/**
 * Test 5: Filter games by difficulty
 */
async function testFilterByDifficulty() {
  try {
    console.log('\n--- Test 5: Filter Games by Difficulty ---');
    const response = await axios.get(`${BASE_URL}/api/games?difficulty=2`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (response.data.games && Array.isArray(response.data.games)) {
      console.log(`Found ${response.data.games.length} difficulty-2 games`);
      const allDifficulty2 = response.data.games.every((g: any) => g.difficulty === 2);
      if (allDifficulty2) {
        logResult('Filter by Difficulty', true);
        return true;
      } else {
        logResult('Filter by Difficulty', false, 'Some games have wrong difficulty');
        return false;
      }
    } else {
      logResult('Filter by Difficulty', false, 'Invalid response structure');
      return false;
    }
  } catch (error: any) {
    logResult('Filter by Difficulty', false, error.response?.data?.error || error.message);
    return false;
  }
}

/**
 * Test 6: Get game by ID
 */
async function testGetGameById() {
  try {
    console.log('\n--- Test 6: Get Game by ID ---');
    const response = await axios.get(`${BASE_URL}/api/games/${createdGameId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (response.data.game) {
      console.log(`Game found: ${response.data.game.title}`);
      console.log(`Questions: ${response.data.game.questions.length}`);
      logResult('Get Game by ID', true);
      return true;
    } else {
      logResult('Get Game by ID', false, 'No game returned');
      return false;
    }
  } catch (error: any) {
    logResult('Get Game by ID', false, error.response?.data?.error || error.message);
    return false;
  }
}

/**
 * Test 7: Update game
 */
async function testUpdateGame() {
  try {
    console.log('\n--- Test 7: Update Game ---');
    const updateData = {
      title: 'Test Game - Spanish Numbers (Updated)',
      difficulty: 3,
      xpReward: 200,
    };

    const response = await axios.put(`${BASE_URL}/api/games/${createdGameId}`, updateData, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (response.data.game) {
      console.log('Game updated successfully');
      console.log(`New title: ${response.data.game.title}`);
      console.log(`New difficulty: ${response.data.game.difficulty}`);
      console.log(`New XP reward: ${response.data.game.xpReward}`);

      if (
        response.data.game.title === updateData.title &&
        response.data.game.difficulty === updateData.difficulty &&
        response.data.game.xpReward === updateData.xpReward
      ) {
        logResult('Update Game', true);
        return true;
      } else {
        logResult('Update Game', false, 'Update values do not match');
        return false;
      }
    } else {
      logResult('Update Game', false, 'No game returned');
      return false;
    }
  } catch (error: any) {
    logResult('Update Game', false, error.response?.data?.error || error.message);
    return false;
  }
}

/**
 * Test 8: Filter by category and difficulty
 */
async function testFilterByCategoryAndDifficulty() {
  try {
    console.log('\n--- Test 8: Filter by Category and Difficulty ---');
    const response = await axios.get(`${BASE_URL}/api/games?category=culture&difficulty=3`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (response.data.games && Array.isArray(response.data.games)) {
      console.log(`Found ${response.data.games.length} culture games with difficulty 3`);
      const allMatch = response.data.games.every(
        (g: any) => g.category === 'culture' && g.difficulty === 3
      );
      if (allMatch || response.data.games.length === 0) {
        logResult('Filter by Category and Difficulty', true);
        return true;
      } else {
        logResult('Filter by Category and Difficulty', false, 'Some games do not match filters');
        return false;
      }
    } else {
      logResult('Filter by Category and Difficulty', false, 'Invalid response structure');
      return false;
    }
  } catch (error: any) {
    logResult('Filter by Category and Difficulty', false, error.response?.data?.error || error.message);
    return false;
  }
}

/**
 * Test 9: Delete game (soft delete)
 */
async function testDeleteGame() {
  try {
    console.log('\n--- Test 9: Delete Game (Soft Delete) ---');
    const response = await axios.delete(`${BASE_URL}/api/games/${createdGameId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (response.data.game && response.data.game.isActive === false) {
      console.log('Game soft deleted successfully');
      console.log(`Game ID: ${response.data.game._id}`);
      console.log(`isActive: ${response.data.game.isActive}`);
      logResult('Delete Game', true);
      return true;
    } else {
      logResult('Delete Game', false, 'Game not properly soft deleted');
      return false;
    }
  } catch (error: any) {
    logResult('Delete Game', false, error.response?.data?.error || error.message);
    return false;
  }
}

/**
 * Test 10: Verify deleted game does not appear in regular listing
 */
async function testDeletedGameNotInListing() {
  try {
    console.log('\n--- Test 10: Verify Deleted Game Not in Regular Listing ---');
    const response = await axios.get(`${BASE_URL}/api/games`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (response.data.games && Array.isArray(response.data.games)) {
      const deletedGameFound = response.data.games.some((g: any) => g._id === createdGameId);
      if (!deletedGameFound) {
        console.log('Deleted game correctly excluded from regular listing');
        logResult('Deleted Game Not in Listing', true);
        return true;
      } else {
        logResult('Deleted Game Not in Listing', false, 'Deleted game still appears in listing');
        return false;
      }
    } else {
      logResult('Deleted Game Not in Listing', false, 'Invalid response structure');
      return false;
    }
  } catch (error: any) {
    logResult('Deleted Game Not in Listing', false, error.response?.data?.error || error.message);
    return false;
  }
}

/**
 * Test 11: Verify deleted game appears in admin listing
 */
async function testDeletedGameInAdminListing() {
  try {
    console.log('\n--- Test 11: Verify Deleted Game in Admin Listing ---');
    const response = await axios.get(`${BASE_URL}/api/games/admin/all`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (response.data.games && Array.isArray(response.data.games)) {
      const deletedGame = response.data.games.find((g: any) => g._id === createdGameId);
      if (deletedGame && deletedGame.isActive === false) {
        console.log('Deleted game correctly appears in admin listing as inactive');
        logResult('Deleted Game in Admin Listing', true);
        return true;
      } else {
        logResult('Deleted Game in Admin Listing', false, 'Deleted game not in admin listing');
        return false;
      }
    } else {
      logResult('Deleted Game in Admin Listing', false, 'Invalid response structure');
      return false;
    }
  } catch (error: any) {
    logResult('Deleted Game in Admin Listing', false, error.response?.data?.error || error.message);
    return false;
  }
}

/**
 * Test 12: Test non-admin user cannot create game
 */
async function testNonAdminCannotCreate() {
  try {
    console.log('\n--- Test 12: Non-Admin Cannot Create Game ---');

    // First, register and login as regular user
    const userEmail = `testuser_${Date.now()}@test.com`;
    await axios.post(`${BASE_URL}/api/auth/register`, {
      email: userEmail,
      password: 'Test@123',
      name: 'Test User',
      firstName: 'Test',
      lastName: 'User',
    });

    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: userEmail,
      password: 'Test@123',
    });

    const userToken = loginResponse.data.accessToken;

    // Try to create a game with user token
    try {
      await axios.post(
        `${BASE_URL}/api/games`,
        {
          title: 'Unauthorized Game',
          description: 'This should fail',
          category: 'language',
          difficulty: 1,
          duration: 10,
          xpReward: 50,
          questions: [
            {
              question: 'Test?',
              options: ['A', 'B'],
              correctAnswer: 0,
              points: 10,
            },
          ],
        },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      // If we get here, the test failed (should have thrown error)
      logResult('Non-Admin Cannot Create', false, 'Regular user was able to create game');
      return false;
    } catch (error: any) {
      if (error.response?.status === 403) {
        console.log('Regular user correctly denied access');
        logResult('Non-Admin Cannot Create', true);
        return true;
      } else {
        logResult('Non-Admin Cannot Create', false, `Unexpected error: ${error.message}`);
        return false;
      }
    }
  } catch (error: any) {
    logResult('Non-Admin Cannot Create', false, error.response?.data?.error || error.message);
    return false;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         Games CRUD API Test Suite                         ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`Testing API at: ${BASE_URL}`);

  // Run tests sequentially
  const adminLoginSuccess = await testAdminLogin();
  if (!adminLoginSuccess) {
    console.error('\n❌ Admin login failed. Cannot proceed with tests.');
    process.exit(1);
  }

  await testCreateGame();
  await testGetAllGames();
  await testFilterByCategory();
  await testFilterByDifficulty();
  await testGetGameById();
  await testUpdateGame();
  await testFilterByCategoryAndDifficulty();
  await testDeleteGame();
  await testDeletedGameNotInListing();
  await testDeletedGameInAdminListing();
  await testNonAdminCannotCreate();

  // Print summary
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                     Test Summary                           ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log(`\nTotal Tests: ${results.length}`);
  console.log(`✓ Passed: ${passed}`);
  console.log(`✗ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`  - ${r.name}: ${r.error}`);
      });
  }

  console.log('\n' + (failed === 0 ? '✅ All tests passed!' : '❌ Some tests failed'));
  process.exit(failed === 0 ? 0 : 1);
}

// Run the tests
runTests().catch((error) => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
