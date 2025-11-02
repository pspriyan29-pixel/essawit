/**
 * Environment Variables Checker
 * Run this script to verify all required environment variables are set
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
const envPath = join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const requiredEnvVars = {
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:7777',
};

const optionalEnvVars = {
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE,
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX,
};

console.log('\n🔍 Checking Environment Variables...\n');
console.log('=' .repeat(60));

let hasErrors = false;

// Check if .env file exists
if (!existsSync(envPath)) {
  console.log('⚠️  WARNING: .env file not found!');
  console.log('   Please copy env.example to .env and fill in your values.');
  console.log(`   Expected location: ${envPath}\n`);
}

// Check required variables
console.log('\n📋 Required Environment Variables:');
console.log('-'.repeat(60));

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (key === 'MONGODB_URI' || key === 'JWT_SECRET') {
    if (!value || value.includes('your_') || value.includes('localhost')) {
      if (key === 'MONGODB_URI' && value?.includes('localhost')) {
        console.log(`✅ ${key}: ${value} (Local MongoDB - OK)`);
      } else if (key === 'JWT_SECRET' && (!value || value.includes('your_super_secret'))) {
        console.log(`⚠️  ${key}: ${value || 'NOT SET'} (Using default - NOT SECURE for production!)`);
        hasErrors = true;
      } else {
        console.log(`❌ ${key}: NOT SET or using placeholder`);
        hasErrors = true;
      }
    } else {
      console.log(`✅ ${key}: ${value ? 'SET' : 'NOT SET'}`);
    }
  } else {
    console.log(`✅ ${key}: ${value}`);
  }
}

// Check optional variables
console.log('\n📋 Optional Environment Variables:');
console.log('-'.repeat(60));

for (const [key, value] of Object.entries(optionalEnvVars)) {
  if (value) {
    console.log(`✅ ${key}: ${value}`);
  } else {
    console.log(`⚪ ${key}: Not set (using default)`);
  }
}

// Security warnings
console.log('\n🔒 Security Checks:');
console.log('-'.repeat(60));

if (process.env.JWT_SECRET?.includes('your_super_secret') || !process.env.JWT_SECRET) {
  console.log('⚠️  WARNING: JWT_SECRET is using default value!');
  console.log('   Please generate a strong secret for production:');
  console.log('   openssl rand -base64 32\n');
  hasErrors = true;
}

if (process.env.NODE_ENV !== 'production') {
  console.log('ℹ️  NODE_ENV: development (OK for development)');
} else {
  console.log('✅ NODE_ENV: production');
}

// Summary
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.log('❌ Some required environment variables are missing or using defaults!');
  console.log('   Please check the errors above and update your .env file.\n');
  process.exit(1);
} else {
  console.log('✅ All environment variables are properly configured!\n');
  process.exit(0);
}

