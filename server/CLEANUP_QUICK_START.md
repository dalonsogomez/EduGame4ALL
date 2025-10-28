# Database Cleanup Script - Quick Start Guide

## TL;DR

```bash
# Clean test users, keep admin (RECOMMENDED)
npm run cleanup-db

# Clean all users including admin
npm run cleanup-db:all

# Delete EVERYTHING (nuclear option)
npm run cleanup-db:full

# Reseed after cleanup
npm run seed
```

## What It Does

### Default Mode (`cleanup-db`)
✅ **Deletes:**
- Test user accounts
- User progress and XP
- Game sessions
- Challenges and badges earned
- Redeemed rewards

✅ **Keeps:**
- Admin user
- Games catalog
- Badge definitions
- Reward catalog
- Community resources

### All Mode (`cleanup-db:all`)
✅ **Deletes:** Everything from default mode + admin user
✅ **Keeps:** System data (games, badges, rewards, resources)

### Full Mode (`cleanup-db:full`)
⚠️ **Deletes:** EVERYTHING!
⚠️ **Keeps:** Nothing

## Common Use Cases

### 1. Daily Development
```bash
# Reset test data
npm run cleanup-db
```

### 2. Before Running Tests
```bash
# Clean slate
npm run cleanup-db:all

# Run tests
cd server && npm run test:challenges

# Clean up
npm run cleanup-db:all
```

### 3. Fresh Database Setup
```bash
# Nuclear reset
npm run cleanup-db:full

# Add initial data
npm run seed
```

### 4. Demo Preparation
```bash
# Clean test data, keep admin
npm run cleanup-db

# Add fresh seed data
npm run seed
```

## Safety Features

### Confirmation Required
Every mode requires explicit confirmation:
```
⚠️  Are you sure you want to proceed with cleanup? (y/N):
```

### Cancel Anytime
- Press `n` or just Enter to cancel
- No data deleted if cancelled
- Safe exit code

### Visual Feedback
- Color-coded output
- Real-time progress
- Detailed statistics
- Clear success/error messages

## Example Output

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
  ✓ Deleted 0 user badges
  ✓ Deleted 0 user challenges
  ✓ Deleted 0 game sessions
  ✓ Deleted 1 user progress records
  ✓ Deleted 1 users

📊 Cleanup Statistics:
══════════════════════════════════════════════════

  User Data:
    • Users deleted:          1
    • User progress deleted:  1
    • Game sessions deleted:  0
    • User challenges deleted: 0
    • User badges deleted:    0
    • User rewards deleted:   0

══════════════════════════════════════════════════

✅ Database cleanup completed successfully!

💡 Tip: Run "npm run seed" to repopulate with sample data

🔌 Database connection closed
```

## Troubleshooting

### MongoDB not running
```bash
# Start MongoDB
mongod

# Or with Docker
docker start mongodb
```

### Permission denied
Check MongoDB user permissions and connection string.

### No admin to preserve
Run `npm run seed` first to create admin user.

## Best Practices

✅ **DO:**
- Use default mode for regular development
- Run seed after cleanup if you need sample data
- Back up production data before cleanup
- Check confirmation message before proceeding

❌ **DON'T:**
- Run cleanup on production databases
- Use `--full` unless you mean it
- Skip reading the confirmation message
- Forget to reseed if tests need data

## Need More Info?

- Full docs: `server/scripts/README-CLEANUP.md`
- All scripts: `SCRIPTS_REFERENCE.md`
- Implementation: `DATABASE_CLEANUP_IMPLEMENTATION.md`

---

**Quick Access from Root:**
```bash
npm run cleanup-db       # Recommended
npm run cleanup-db:all   # All users
npm run cleanup-db:full  # Nuclear option
npm run seed             # Reseed database
```

**Quick Access from Server:**
```bash
cd server
npm run cleanup-db
npm run cleanup-db:all
npm run cleanup-db:full
npm run seed
```

---

**Last Updated:** October 2024
**Status:** ✅ Production Ready
