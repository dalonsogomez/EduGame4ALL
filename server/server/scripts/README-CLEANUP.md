# Database Cleanup Script Documentation

## Overview

The database cleanup script (`cleanup-database.ts`) is a utility for resetting user data, game sessions, and progress for testing purposes. It provides three different modes of operation with safety confirmations.

## Usage

### Basic Cleanup (Preserve Admin)
```bash
npm run cleanup-db
```
This is the **default and recommended** mode. It cleans all user data but preserves the admin user account.

**What gets deleted:**
- All non-admin user accounts
- User progress records (XP, levels, skills) for non-admin users
- All game sessions and history
- All user challenges and progress
- All user badges (earned badges)
- All user rewards (redeemed items)

**What gets preserved:**
- Admin user account and progress
- Game definitions
- Badge definitions
- Reward catalog
- Challenge templates
- Community resources (jobs, grants, services, news)

### Clean All Users
```bash
npm run cleanup-db:all
```
Cleans **all user data including the admin user**.

**What gets deleted:**
- **All user accounts (including admin)**
- All user progress records
- All game sessions and history
- All user challenges and progress
- All user badges
- All user rewards

**What gets preserved:**
- Game definitions
- Badge definitions
- Reward catalog
- Challenge templates
- Community resources

### Full Cleanup (Nuclear Option)
```bash
npm run cleanup-db:full
```
⚠️ **WARNING**: This deletes **EVERYTHING** from the database.

**What gets deleted:**
- All user accounts (including admin)
- All user progress records
- All game sessions and history
- All user challenges and progress
- All user badges
- All user rewards
- **All game definitions**
- **All badge definitions**
- **All reward catalog items**
- **All challenge templates**
- **All community resources**

**What gets preserved:**
- Nothing! The database is completely reset.

## Safety Features

### Confirmation Prompts
All modes require user confirmation before executing:
- Basic mode: Yellow warning prompt
- All users mode: Yellow warning prompt
- Full cleanup mode: **Red danger prompt**

To cancel, simply press Enter or type 'n' when prompted.

### Color-Coded Output
The script uses ANSI colors for clear visual feedback:
- 🟢 Green: Success messages
- 🟡 Yellow: Warning messages
- 🔴 Red: Danger messages
- 🔵 Blue: Info messages
- 🟣 Magenta: Headers and statistics
- 🔵 Cyan: Section headers

### Detailed Statistics
After cleanup, the script displays comprehensive statistics showing exactly how many records were deleted from each collection.

## Examples

### Example 1: Regular Testing Cleanup
```bash
# Clean all test users but keep admin for testing
npm run cleanup-db
```

**Output:**
```
══════════════════════════════════════════════════
  DATABASE CLEANUP SCRIPT
══════════════════════════════════════════════════

✓ MODE: Clean user data (preserve admin user)

The following will be deleted:
  • All user accounts (except admin)
  • All user progress and XP
  • All game sessions and history
  • All user challenges and progress
  • All user badges (earned badges)
  • All user rewards (redeemed items)

⚠️  Are you sure you want to proceed with cleanup? (y/N): y

🔌 Connecting to MongoDB...
✅ Connected to MongoDB successfully

🧹 Cleaning user data...
  ℹ️  Preserving admin user: admin@edugame4all.com
  ✓ Deleted 0 user rewards
  ✓ Deleted 5 user badges
  ✓ Deleted 3 user challenges
  ✓ Deleted 12 game sessions
  ✓ Deleted 10 user progress records
  ✓ Deleted 10 users

📊 Cleanup Statistics:
══════════════════════════════════════════════════

  User Data:
    • Users deleted:          10
    • User progress deleted:  10
    • Game sessions deleted:  12
    • User challenges deleted: 3
    • User badges deleted:    5
    • User rewards deleted:   0

══════════════════════════════════════════════════

✅ Database cleanup completed successfully!

💡 Tip: Run "npm run seed" to repopulate with sample data

🔌 Database connection closed
```

### Example 2: Complete Reset for Fresh Start
```bash
# Delete everything including admin
npm run cleanup-db:all
```

### Example 3: Nuclear Reset (Start from Scratch)
```bash
# Delete absolutely everything
npm run cleanup-db:full

# Then reseed the database
npm run seed
```

## Integration with Other Scripts

### Typical Workflow

1. **Initial Setup**
   ```bash
   npm run seed
   ```

2. **Development & Testing**
   ```bash
   # Test your features...
   ```

3. **Reset for Clean Testing**
   ```bash
   npm run cleanup-db
   npm run seed  # Optional: add fresh seed data
   ```

4. **Complete Fresh Start**
   ```bash
   npm run cleanup-db:full
   npm run seed
   ```

## Technical Details

### Models Affected

**User Data Collections:**
- `users` - User accounts
- `userprogresses` - User XP, levels, and skills
- `gamesessions` - Game play history
- `userchallenges` - Challenge progress
- `userbadges` - Earned badges
- `userrewards` - Redeemed rewards

**System Data Collections (--full only):**
- `games` - Game definitions
- `badges` - Badge templates
- `rewards` - Reward catalog
- `challenges` - Challenge templates
- `resources` - Community resources

### Database Connection

The script uses the MongoDB URI from environment variables:
- Primary: `process.env.MONGODB_URI`
- Fallback: `mongodb://localhost:27017/edugame4all`

### Error Handling

- Database connection failures are caught and logged
- Individual collection cleanup errors are caught and logged
- Process exits with code 1 on fatal errors
- Confirmation cancellation exits with code 0

## Best Practices

1. **Always use the default mode** (`cleanup-db`) unless you have a specific reason not to
2. **Back up production data** before running any cleanup script
3. **Never run cleanup scripts on production databases**
4. **Use --full only when you want to completely reset** the database
5. **Run seed after cleanup** if you need sample data for testing

## Troubleshooting

### "Admin user already exists" after cleanup
This is normal - the default cleanup mode preserves the admin user.

### No confirmation prompt appears
Make sure you're piping 'y' correctly: `echo "y" | npm run cleanup-db`

### Connection timeout
Check that MongoDB is running: `mongod --version` or check Docker if using containerized MongoDB

### Permission denied
Ensure you have write permissions to the database

## Related Scripts

- `npm run seed` - Populate database with sample data
- `npm run manage-games` - Manage game definitions
- `npm test:*` - Various test scripts that may create test data

## Support

For issues or questions about the cleanup script:
1. Check the error messages in the console
2. Verify MongoDB is running and accessible
3. Check environment variables are set correctly
4. Review this documentation

---

**Last Updated:** October 2024
**Script Version:** 1.0.0
**Maintainer:** EduGame4All Development Team
