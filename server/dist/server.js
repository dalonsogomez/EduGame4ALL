import dotenv from 'dotenv';
import express from 'express';
import basicRoutes from './routes/index';
import authRoutes from './routes/authRoutes';
import gameRoutes from './routes/gameRoutes';
import progressRoutes from './routes/progressRoutes';
import rewardRoutes from './routes/rewardRoutes';
import resourceRoutes from './routes/resourceRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import profileRoutes from './routes/profileRoutes';
import challengeRoutes from './routes/challengeRoutes';
import xpRoutes from './routes/xpRoutes';
import streakRoutes from './routes/streakRoutes';
import { connectDB } from './config/database';
import cors from 'cors';
// Load environment variables
dotenv.config();
if (!process.env.DATABASE_URL) {
    console.error("Error: DATABASE_URL variables in .env missing.");
    process.exit(-1);
}
const app = express();
const port = process.env.PORT || 3000;
// Pretty-print JSON responses
app.enable('json spaces');
// We want to be consistent with URL paths, so we enable strict routing
app.enable('strict routing');
app.use(cors({}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Database connection
connectDB();
// Basic Routes
app.use(basicRoutes);
// Authentication Routes
app.use('/api/auth', authRoutes);
// Profile Routes
app.use('/api/profile', profileRoutes);
// Game Routes
app.use('/api/games', gameRoutes);
// Progress Routes
app.use('/api/progress', progressRoutes);
// Reward Routes
app.use('/api/rewards', rewardRoutes);
// Resource Routes
app.use('/api/resources', resourceRoutes);
// Dashboard Routes
app.use('/api/dashboard', dashboardRoutes);
// Challenge Routes
app.use('/api/challenges', challengeRoutes);
// XP Routes
app.use('/api/xp', xpRoutes);
// Streak Routes
app.use('/api/streak', streakRoutes);
// If no routes handled the request, it's a 404
app.use((req, res) => {
    res.status(404).send("Page not found.");
});
// Error handling
app.use((err, req, res) => {
    console.error(`Unhandled application error: ${err.message}`);
    console.error(err.stack);
    res.status(500).send("There was an error serving your request.");
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map