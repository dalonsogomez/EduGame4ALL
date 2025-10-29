import mongoose from 'mongoose';
import { UserProgress } from '../models/UserProgress';
import { connectDB } from '../config/database';

/**
 * Migration script to add longestStreak field to existing UserProgress records
 * This script initializes longestStreak with the current streak value for all existing records
 */
async function migrateExistingRecords() {
  console.log('🔄 Starting migration: Adding longestStreak field to existing records...\n');
  
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connected successfully\n');
    
    // Find all user progress records
    const allProgress = await UserProgress.find();
    console.log(`📊 Found ${allProgress.length} user progress records\n`);
    
    if (allProgress.length === 0) {
      console.log('ℹ️  No records found. Migration not needed.\n');
      return;
    }
    
    let updated = 0;
    let alreadyHad = 0;
    
    for (const progress of allProgress) {
      // Check if longestStreak exists and has a value
      if (progress.longestStreak === undefined || progress.longestStreak === null) {
        // Initialize longestStreak with current streak value
        progress.longestStreak = progress.streak || 0;
        await progress.save();
        updated++;
        console.log(`  ✓ Updated user ${progress.userId}: longestStreak = ${progress.longestStreak}`);
      } else {
        alreadyHad++;
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Migration completed successfully!');
    console.log('='.repeat(60));
    console.log(`📈 Statistics:`);
    console.log(`   - Total records: ${allProgress.length}`);
    console.log(`   - Updated: ${updated}`);
    console.log(`   - Already had longestStreak: ${alreadyHad}`);
    console.log('='.repeat(60) + '\n');
    
  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('❌ Migration failed!');
    console.error('='.repeat(60));
    console.error('Error:', error);
    console.error('='.repeat(60) + '\n');
    throw error;
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed\n');
  }
}

// Execute migration
if (require.main === module) {
  migrateExistingRecords()
    .then(() => {
      console.log('✨ Migration script finished successfully\n');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

export { migrateExistingRecords };
