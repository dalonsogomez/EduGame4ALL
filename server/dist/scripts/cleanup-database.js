/**
 * Database Cleanup Script
 *
 * This script resets all user data, game sessions, and progress for testing purposes.
 *
 * Usage:
 *   npm run cleanup-db              # Clean all user data, keep admin user
 *   npm run cleanup-db -- --all     # Clean all user data including admin
 *   npm run cleanup-db -- --full    # Clean everything including games, badges, rewards
 *
 * What gets cleaned:
 * - User accounts and profiles
 * - User progress (XP, levels, skills)
 * - Game sessions and history
 * - User challenges and progress
 * - User badges
 * - User rewards (redeemed items)
 * - User streaks
 *
 * What gets preserved (unless --full flag):
 * - Game definitions
 * - Badge definitions
 * - Reward catalog
 * - Challenge templates
 * - Community resources (jobs, grants, services, news)
 * - Admin user (unless --all flag)
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';
import User from '../models/User';
import { UserProgress } from '../models/UserProgress';
import { GameSession } from '../models/GameSession';
import { UserChallenge } from '../models/UserChallenge';
import { UserBadge } from '../models/UserBadge';
import { UserReward } from '../models/UserReward';
import { Game } from '../models/Game';
import { Badge } from '../models/Badge';
import { Reward } from '../models/Reward';
import { Challenge } from '../models/Challenge';
import { Resource } from '../models/Resource';
// Load environment variables
dotenv.config();
// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};
// Helper function to colorize output
function colorize(text, color) {
    return `${colors[color]}${text}${colors.reset}`;
}
// Parse command line arguments
const args = process.argv.slice(2);
const cleanAll = args.includes('--all');
const fullClean = args.includes('--full');
// Create readline interface for user confirmation
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
// Prompt user for confirmation
function askConfirmation(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
        });
    });
}
async function connectDatabase() {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/edugame4all';
        console.log(colorize('\n🔌 Connecting to MongoDB...', 'cyan'));
        await mongoose.connect(mongoUri);
        console.log(colorize('✅ Connected to MongoDB successfully\n', 'green'));
    }
    catch (error) {
        console.error(colorize('❌ Failed to connect to MongoDB:', 'red'), error);
        throw error;
    }
}
async function cleanUserData(preserveAdmin) {
    const stats = {};
    console.log(colorize('\n🧹 Cleaning user data...', 'yellow'));
    try {
        // Find admin user to preserve if needed
        let adminUserId = null;
        if (preserveAdmin) {
            const adminUser = await User.findOne({ role: 'admin' });
            if (adminUser) {
                adminUserId = adminUser._id;
                console.log(colorize(`  ℹ️  Preserving admin user: ${adminUser.email}`, 'blue'));
            }
        }
        // Delete user rewards
        const userRewardsResult = preserveAdmin && adminUserId
            ? await UserReward.deleteMany({ userId: { $ne: adminUserId } })
            : await UserReward.deleteMany({});
        stats.userRewards = userRewardsResult.deletedCount || 0;
        console.log(colorize(`  ✓ Deleted ${stats.userRewards} user rewards`, 'green'));
        // Delete user badges
        const userBadgesResult = preserveAdmin && adminUserId
            ? await UserBadge.deleteMany({ userId: { $ne: adminUserId } })
            : await UserBadge.deleteMany({});
        stats.userBadges = userBadgesResult.deletedCount || 0;
        console.log(colorize(`  ✓ Deleted ${stats.userBadges} user badges`, 'green'));
        // Delete user challenges
        const userChallengesResult = preserveAdmin && adminUserId
            ? await UserChallenge.deleteMany({ userId: { $ne: adminUserId } })
            : await UserChallenge.deleteMany({});
        stats.userChallenges = userChallengesResult.deletedCount || 0;
        console.log(colorize(`  ✓ Deleted ${stats.userChallenges} user challenges`, 'green'));
        // Delete game sessions
        const gameSessionsResult = preserveAdmin && adminUserId
            ? await GameSession.deleteMany({ userId: { $ne: adminUserId } })
            : await GameSession.deleteMany({});
        stats.gameSessions = gameSessionsResult.deletedCount || 0;
        console.log(colorize(`  ✓ Deleted ${stats.gameSessions} game sessions`, 'green'));
        // Delete user progress
        const userProgressResult = preserveAdmin && adminUserId
            ? await UserProgress.deleteMany({ userId: { $ne: adminUserId } })
            : await UserProgress.deleteMany({});
        stats.userProgress = userProgressResult.deletedCount || 0;
        console.log(colorize(`  ✓ Deleted ${stats.userProgress} user progress records`, 'green'));
        // Delete users (preserve admin if needed)
        const usersResult = preserveAdmin && adminUserId
            ? await User.deleteMany({ _id: { $ne: adminUserId } })
            : await User.deleteMany({});
        stats.users = usersResult.deletedCount || 0;
        console.log(colorize(`  ✓ Deleted ${stats.users} users`, 'green'));
    }
    catch (error) {
        console.error(colorize('❌ Error cleaning user data:', 'red'), error);
        throw error;
    }
    return stats;
}
async function cleanSystemData() {
    const stats = {};
    console.log(colorize('\n🧹 Cleaning system data (games, badges, rewards, challenges, resources)...', 'yellow'));
    try {
        // Delete resources
        const resourcesResult = await Resource.deleteMany({});
        stats.resources = resourcesResult.deletedCount || 0;
        console.log(colorize(`  ✓ Deleted ${stats.resources} resources`, 'green'));
        // Delete challenges
        const challengesResult = await Challenge.deleteMany({});
        stats.challenges = challengesResult.deletedCount || 0;
        console.log(colorize(`  ✓ Deleted ${stats.challenges} challenges`, 'green'));
        // Delete rewards
        const rewardsResult = await Reward.deleteMany({});
        stats.rewards = rewardsResult.deletedCount || 0;
        console.log(colorize(`  ✓ Deleted ${stats.rewards} rewards`, 'green'));
        // Delete badges
        const badgesResult = await Badge.deleteMany({});
        stats.badges = badgesResult.deletedCount || 0;
        console.log(colorize(`  ✓ Deleted ${stats.badges} badges`, 'green'));
        // Delete games
        const gamesResult = await Game.deleteMany({});
        stats.games = gamesResult.deletedCount || 0;
        console.log(colorize(`  ✓ Deleted ${stats.games} games`, 'green'));
    }
    catch (error) {
        console.error(colorize('❌ Error cleaning system data:', 'red'), error);
        throw error;
    }
    return stats;
}
async function displayStats(stats) {
    console.log(colorize('\n📊 Cleanup Statistics:', 'magenta'));
    console.log(colorize('═'.repeat(50), 'magenta'));
    console.log(colorize('\n  User Data:', 'cyan'));
    console.log(`    • Users deleted:          ${colorize(stats.users.toString(), 'bright')}`);
    console.log(`    • User progress deleted:  ${colorize(stats.userProgress.toString(), 'bright')}`);
    console.log(`    • Game sessions deleted:  ${colorize(stats.gameSessions.toString(), 'bright')}`);
    console.log(`    • User challenges deleted: ${colorize(stats.userChallenges.toString(), 'bright')}`);
    console.log(`    • User badges deleted:    ${colorize(stats.userBadges.toString(), 'bright')}`);
    console.log(`    • User rewards deleted:   ${colorize(stats.userRewards.toString(), 'bright')}`);
    if (stats.games !== undefined) {
        console.log(colorize('\n  System Data:', 'cyan'));
        console.log(`    • Games deleted:          ${colorize(stats.games.toString(), 'bright')}`);
        console.log(`    • Badges deleted:         ${colorize(stats.badges.toString(), 'bright')}`);
        console.log(`    • Rewards deleted:        ${colorize(stats.rewards.toString(), 'bright')}`);
        console.log(`    • Challenges deleted:     ${colorize(stats.challenges.toString(), 'bright')}`);
        console.log(`    • Resources deleted:      ${colorize(stats.resources.toString(), 'bright')}`);
    }
    console.log(colorize('\n═'.repeat(50), 'magenta'));
}
async function main() {
    console.log(colorize('═'.repeat(50), 'magenta'));
    console.log(colorize('  DATABASE CLEANUP SCRIPT', 'bright'));
    console.log(colorize('═'.repeat(50), 'magenta'));
    // Display cleanup mode
    if (fullClean) {
        console.log(colorize('\n⚠️  MODE: FULL CLEANUP (Everything will be deleted!)', 'red'));
    }
    else if (cleanAll) {
        console.log(colorize('\n⚠️  MODE: Clean all user data (including admin)', 'yellow'));
    }
    else {
        console.log(colorize('\n✓ MODE: Clean user data (preserve admin user)', 'green'));
    }
    // Display what will be cleaned
    console.log(colorize('\nThe following will be deleted:', 'cyan'));
    console.log('  • All user accounts' + (cleanAll ? '' : ' (except admin)'));
    console.log('  • All user progress and XP');
    console.log('  • All game sessions and history');
    console.log('  • All user challenges and progress');
    console.log('  • All user badges (earned badges)');
    console.log('  • All user rewards (redeemed items)');
    if (fullClean) {
        console.log(colorize('\n  Additionally (FULL CLEANUP):', 'red'));
        console.log('  • All game definitions');
        console.log('  • All badge definitions');
        console.log('  • All reward catalog items');
        console.log('  • All challenge templates');
        console.log('  • All community resources');
    }
    // Ask for confirmation
    const confirmMessage = fullClean
        ? colorize('\n⚠️  Are you sure you want to DELETE EVERYTHING? (y/N): ', 'red')
        : colorize('\n⚠️  Are you sure you want to proceed with cleanup? (y/N): ', 'yellow');
    const confirmed = await askConfirmation(confirmMessage);
    if (!confirmed) {
        console.log(colorize('\n❌ Cleanup cancelled by user', 'red'));
        rl.close();
        process.exit(0);
    }
    try {
        // Connect to database
        await connectDatabase();
        // Perform cleanup
        const stats = {
            users: 0,
            userProgress: 0,
            gameSessions: 0,
            userChallenges: 0,
            userBadges: 0,
            userRewards: 0,
        };
        // Clean user data
        const userStats = await cleanUserData(!cleanAll);
        Object.assign(stats, userStats);
        // Clean system data if full cleanup
        if (fullClean) {
            const systemStats = await cleanSystemData();
            Object.assign(stats, systemStats);
        }
        // Display statistics
        await displayStats(stats);
        console.log(colorize('\n✅ Database cleanup completed successfully!', 'green'));
        if (!fullClean) {
            console.log(colorize('\n💡 Tip: Run "npm run seed" to repopulate with sample data', 'blue'));
        }
        else {
            console.log(colorize('\n💡 Tip: Run "npm run seed" to populate database with initial data', 'blue'));
        }
    }
    catch (error) {
        console.error(colorize('\n❌ Cleanup failed:', 'red'), error);
        process.exit(1);
    }
    finally {
        rl.close();
        await mongoose.connection.close();
        console.log(colorize('\n🔌 Database connection closed\n', 'cyan'));
    }
}
// Run the script
main().catch((error) => {
    console.error(colorize('Fatal error:', 'red'), error);
    rl.close();
    process.exit(1);
});
//# sourceMappingURL=cleanup-database.js.map