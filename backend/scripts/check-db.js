/**
 * MongoDB Connection Checker
 * Run this script to verify MongoDB connection
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
const envPath = join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sawit_db';

console.log('\n🔍 Checking MongoDB Connection...\n');
console.log('='.repeat(60));
console.log(`📡 Connecting to: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}\n`);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ MongoDB Connection: SUCCESS\n');
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}\n`);
    
    // Test query
    return mongoose.connection.db.admin().ping();
  })
  .then(() => {
    console.log('✅ MongoDB Ping: SUCCESS\n');
    console.log('='.repeat(60));
    console.log('✅ MongoDB is running and accessible!\n');
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ MongoDB Connection: FAILED\n');
    console.log(`   Error: ${error.message}\n`);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Troubleshooting:');
      console.log('   1. Make sure MongoDB is running');
      console.log('   2. Check if MongoDB is installed');
      console.log('   3. Verify MONGODB_URI in your .env file');
      console.log('   4. For local MongoDB, try: mongod\n');
    } else if (error.message.includes('authentication failed')) {
      console.log('💡 Troubleshooting:');
      console.log('   1. Check your MongoDB username and password');
      console.log('   2. Verify MONGODB_URI format');
      console.log('   3. Make sure database user has proper permissions\n');
    } else if (error.message.includes('timeout')) {
      console.log('💡 Troubleshooting:');
      console.log('   1. Check your network connection');
      console.log('   2. Verify MongoDB server is accessible');
      console.log('   3. Check firewall settings\n');
    }
    
    console.log('='.repeat(60));
    console.log('❌ MongoDB connection failed!\n');
    mongoose.connection.close();
    process.exit(1);
  });

