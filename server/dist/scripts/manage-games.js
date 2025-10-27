/**
 * CLI script for managing games
 *
 * This script provides command-line utilities for:
 * - Listing all games
 * - Creating sample games
 * - Activating/deactivating games
 * - Viewing game statistics
 *
 * Run with: npm run manage-games
 */
import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import { Game } from '../models/Game';
import { GameSession } from '../models/GameSession';
dotenv.config();
const COLORS = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
};
/**
 * Display all games with statistics
 */
async function listGames() {
    console.log(`\n${COLORS.bright}📚 All Games${COLORS.reset}\n`);
    const games = await Game.find({}).sort({ category: 1, difficulty: 1 });
    const categories = {
        language: { count: 0, active: 0 },
        culture: { count: 0, active: 0 },
        'soft-skills': { count: 0, active: 0 },
    };
    for (const game of games) {
        const status = game.isActive
            ? `${COLORS.green}●${COLORS.reset} Active`
            : `${COLORS.red}○${COLORS.reset} Inactive`;
        const difficulty = '★'.repeat(game.difficulty) + '☆'.repeat(5 - game.difficulty);
        console.log(`${status} | ${COLORS.cyan}${game.category.padEnd(12)}${COLORS.reset} | ${difficulty} | ${game.title}`);
        console.log(`    Questions: ${game.questions.length} | Duration: ${game.duration}min | XP: ${game.xpReward}`);
        console.log(`    ID: ${COLORS.yellow}${game._id}${COLORS.reset}\n`);
        categories[game.category].count++;
        if (game.isActive)
            categories[game.category].active++;
    }
    console.log(`\n${COLORS.bright}📊 Summary${COLORS.reset}`);
    console.log(`Total Games: ${games.length}`);
    console.log(`\nBy Category:`);
    for (const [cat, stats] of Object.entries(categories)) {
        console.log(`  ${cat.padEnd(12)}: ${stats.active}/${stats.count} active`);
    }
}
/**
 * Show game statistics
 */
async function showStatistics() {
    console.log(`\n${COLORS.bright}📊 Game Statistics${COLORS.reset}\n`);
    const totalGames = await Game.countDocuments({});
    const activeGames = await Game.countDocuments({ isActive: true });
    const totalSessions = await GameSession.countDocuments({});
    console.log(`Total Games: ${totalGames}`);
    console.log(`Active Games: ${activeGames}`);
    console.log(`Inactive Games: ${totalGames - activeGames}`);
    console.log(`Total Game Sessions: ${totalSessions}`);
    // Category breakdown
    console.log(`\n${COLORS.bright}By Category:${COLORS.reset}`);
    const categories = ['language', 'culture', 'soft-skills'];
    for (const category of categories) {
        const count = await Game.countDocuments({ category, isActive: true });
        const categoryGames = await Game.find({ category }).select('_id');
        const gameIds = categoryGames.map(g => g._id);
        const sessions = await GameSession.countDocuments({ gameId: { $in: gameIds } });
        console.log(`  ${category.padEnd(12)}: ${count} games, ${sessions} sessions`);
    }
    // Difficulty breakdown
    console.log(`\n${COLORS.bright}By Difficulty:${COLORS.reset}`);
    for (let diff = 1; diff <= 5; diff++) {
        const count = await Game.countDocuments({ difficulty: diff, isActive: true });
        const stars = '★'.repeat(diff) + '☆'.repeat(5 - diff);
        console.log(`  ${stars}: ${count} games`);
    }
    // Most played games
    console.log(`\n${COLORS.bright}🔥 Most Played Games:${COLORS.reset}`);
    const gameSessions = await GameSession.aggregate([
        {
            $group: {
                _id: '$gameId',
                sessions: { $sum: 1 },
                avgScore: { $avg: '$score' },
            }
        },
        { $sort: { sessions: -1 } },
        { $limit: 5 },
    ]);
    for (const stat of gameSessions) {
        const game = await Game.findById(stat._id);
        if (game) {
            console.log(`  ${game.title.substring(0, 40).padEnd(40)} - ${stat.sessions} plays, ${Math.round(stat.avgScore)}% avg score`);
        }
    }
}
/**
 * Toggle game active status
 */
async function toggleGame(gameId, active) {
    const game = await Game.findByIdAndUpdate(gameId, { isActive: active }, { new: true });
    if (!game) {
        console.log(`${COLORS.red}❌ Game not found${COLORS.reset}`);
        return;
    }
    const status = active ? 'activated' : 'deactivated';
    console.log(`${COLORS.green}✅ Game ${status}: ${game.title}${COLORS.reset}`);
}
/**
 * Create a sample game
 */
async function createSampleGame() {
    const sampleGame = {
        title: 'Sample Game - Edit Me',
        description: 'This is a sample game that you can customize',
        category: 'language',
        difficulty: 1,
        duration: 5,
        xpReward: 50,
        isActive: true,
        questions: [
            {
                question: 'What is 2 + 2?',
                options: ['3', '4', '5', '6'],
                correctAnswer: 1,
                explanation: 'Two plus two equals four',
                points: 10,
            },
            {
                question: 'What color is the sky?',
                options: ['Red', 'Blue', 'Green', 'Yellow'],
                correctAnswer: 1,
                explanation: 'The sky is blue during the day',
                points: 10,
            },
        ],
    };
    const game = await Game.create(sampleGame);
    console.log(`${COLORS.green}✅ Sample game created${COLORS.reset}`);
    console.log(`   ID: ${COLORS.yellow}${game._id}${COLORS.reset}`);
    console.log(`   Title: ${game.title}`);
}
/**
 * Main CLI interface
 */
async function main() {
    console.log(`\n${COLORS.bright}${COLORS.blue}╔════════════════════════════════════════════╗${COLORS.reset}`);
    console.log(`${COLORS.bright}${COLORS.blue}║     Games Management CLI                   ║${COLORS.reset}`);
    console.log(`${COLORS.bright}${COLORS.blue}╚════════════════════════════════════════════╝${COLORS.reset}\n`);
    await connectDB();
    const command = process.argv[2];
    const arg = process.argv[3];
    switch (command) {
        case 'list':
            await listGames();
            break;
        case 'stats':
            await showStatistics();
            break;
        case 'activate':
            if (!arg) {
                console.log(`${COLORS.red}❌ Please provide a game ID${COLORS.reset}`);
                console.log(`Usage: npm run manage-games activate <gameId>`);
            }
            else {
                await toggleGame(arg, true);
            }
            break;
        case 'deactivate':
            if (!arg) {
                console.log(`${COLORS.red}❌ Please provide a game ID${COLORS.reset}`);
                console.log(`Usage: npm run manage-games deactivate <gameId>`);
            }
            else {
                await toggleGame(arg, false);
            }
            break;
        case 'create-sample':
            await createSampleGame();
            break;
        default:
            console.log(`${COLORS.bright}Available Commands:${COLORS.reset}\n`);
            console.log(`  ${COLORS.cyan}list${COLORS.reset}                   - List all games`);
            console.log(`  ${COLORS.cyan}stats${COLORS.reset}                  - Show game statistics`);
            console.log(`  ${COLORS.cyan}activate <id>${COLORS.reset}          - Activate a game`);
            console.log(`  ${COLORS.cyan}deactivate <id>${COLORS.reset}        - Deactivate a game`);
            console.log(`  ${COLORS.cyan}create-sample${COLORS.reset}          - Create a sample game\n`);
            console.log(`${COLORS.bright}Examples:${COLORS.reset}`);
            console.log(`  npm run manage-games list`);
            console.log(`  npm run manage-games stats`);
            console.log(`  npm run manage-games activate 507f1f77bcf86cd799439011`);
            console.log(`  npm run manage-games create-sample\n`);
    }
    process.exit(0);
}
main().catch((error) => {
    console.error(`${COLORS.red}❌ Error:${COLORS.reset}`, error);
    process.exit(1);
});
//# sourceMappingURL=manage-games.js.map