# Scripts Reference Guide

## Quick Reference for Common Tasks

### Database Management

#### Seed Database with Initial Data
```bash
npm run seed
```
Creates initial games, badges, rewards, resources, and admin user.

#### Clean User Data (Preserve Admin)
```bash
npm run cleanup-db
```
**Recommended for regular testing.** Removes all test users but keeps admin.

#### Clean All Users Including Admin
```bash
npm run cleanup-db:all
```
Removes all users but preserves games, badges, and other system data.

#### Nuclear Reset (Clean Everything)
```bash
npm run cleanup-db:full
```
⚠️ **WARNING**: Deletes **EVERYTHING** from the database!

---

### Development

#### Start Development Environment
```bash
npm run dev
```
Runs client, server, and shared package in watch mode concurrently.

#### Start Client Only
```bash
npm run client
```

#### Start Server Only
```bash
npm run server
```

#### Build Shared Package
```bash
npm run shared-build
```

---

### Testing

#### Run All Tests
```bash
npm test
```

#### Test Specific Features
```bash
# From server directory:
cd server

npm run test:profile          # Profile endpoints
npm run test:game-session     # Game sessions
npm run test:games-crud       # Games CRUD
npm run test:progress         # Progress tracking
npm run test:challenges       # Daily challenges
npm run test:rewards          # Rewards system
npm run test:resources        # Community resources
npm run test:xp               # XP and leveling
npm run test:streak           # Streak tracking
npm run test:streak-expiration # Streak expiration logic
```

---

### Utilities

#### Manage Games
```bash
cd server
npm run manage-games
```
Interactive CLI for game management (list, stats, toggle, create).

#### Demo Scripts
```bash
cd server

npm run demo:resources        # Demo resource endpoints
npm run demo:streak           # Demo streak system
```

---

### Linting

#### Lint All Packages
```bash
npm run lint
```

#### Lint Individual Packages
```bash
cd client && npm run lint
cd server && npm run lint
cd shared && npm run lint
```

---

## Common Workflows

### 1. Fresh Start
```bash
# Clean everything and reseed
npm run cleanup-db:full
npm run seed
npm run dev
```

### 2. Reset Test Data
```bash
# Keep admin and system data
npm run cleanup-db
npm run dev
```

### 3. Run Tests with Clean Database
```bash
# Clean all users
npm run cleanup-db:all

# Run specific tests
cd server
npm run test:challenges

# Clean up after
npm run cleanup-db:all
```

### 4. Add New Games/Rewards
```bash
cd server

# Option 1: Use seed script (replaces all)
npm run seed

# Option 2: Use manage-games script (interactive)
npm run manage-games
```

### 5. Debug Mode
```bash
npm run debug
```
Runs with Node.js inspector on port 9229.

---

## Installation

### Initial Setup
```bash
npm install
```
This automatically runs `postinstall` which installs all dependencies for client, server, and shared packages.

### Manual Package Installation
```bash
npm run client-install        # Install client dependencies
npm run server-install        # Install server dependencies
npm run shared-install        # Install and build shared package
```

---

## Environment Setup

### Required Environment Variables

#### Server (.env)
```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/edugame4all

# JWT Secrets
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret

# AI Services (Optional)
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# Server
PORT=3000
NODE_ENV=development
```

---

## Script Locations

### Root Level (`package.json`)
- `npm run dev` - Start all services
- `npm run seed` - Seed database
- `npm run cleanup-db` - Clean database
- `npm run lint` - Lint all packages

### Server (`server/package.json`)
- `npm run dev` - Start server in watch mode
- `npm run build` - Build TypeScript
- `npm run test:*` - Run specific tests
- `npm run manage-games` - Manage games
- `npm run demo:*` - Run demos

### Client (`client/package.json`)
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run lint` - Lint client code

### Shared (`shared/package.json`)
- `npm run build` - Build shared types
- `npm run dev` - Build in watch mode
- `npm run lint` - Lint shared code

---

## Tips & Best Practices

### Development
1. Always run `npm run dev` from root directory
2. Use `cleanup-db` regularly to reset test data
3. Keep admin user for testing (use default cleanup mode)

### Testing
1. Clean database before running test suites
2. Use `cleanup-db:all` for integration tests
3. Re-seed after cleanup if tests need sample data

### Database
1. Back up production data before any cleanup
2. Never run cleanup scripts on production
3. Use `--full` only when you know what you're doing

### Performance
1. Use `cleanup-db` instead of `cleanup-db:full` when possible
2. Run `shared-build` only when shared types change
3. Use `concurrently` for parallel development

---

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh --eval "db.runCommand({ ping: 1 })"

# Start MongoDB
mongod

# Or with Docker
docker start mongodb
```

### Port Already in Use
```bash
# Kill process on port 3000 (server)
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173 (client)
lsof -ti:5173 | xargs kill -9
```

### Shared Package Issues
```bash
# Rebuild shared package
npm run shared-build

# Or from shared directory
cd shared && npm run build
```

### TypeScript Errors
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

---

## Quick Commands Cheat Sheet

| Task | Command |
|------|---------|
| Start everything | `npm run dev` |
| Seed database | `npm run seed` |
| Clean test data | `npm run cleanup-db` |
| Clean everything | `npm run cleanup-db:full` |
| Run tests | `cd server && npm run test:*` |
| Lint all | `npm run lint` |
| Build all | `npm run build` |
| Debug mode | `npm run debug` |

---

**Last Updated:** October 2024
**Version:** 1.0.0
