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
export {};
//# sourceMappingURL=cleanup-database.d.ts.map