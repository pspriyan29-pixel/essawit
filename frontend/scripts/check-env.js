/**
 * Frontend Environment Variables Checker
 * Run this script to verify all required environment variables are set
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '..', '.env');
const envExamplePath = join(__dirname, '..', '.env.example');

console.log('\n🔍 Checking Frontend Environment Variables...\n');
console.log('='.repeat(60));

let hasErrors = false;

// Check if .env file exists
if (!existsSync(envPath)) {
  console.log('⚠️  WARNING: .env file not found!');
  console.log('   Please copy .env.example to .env and fill in your values.');
  console.log(`   Expected location: ${envPath}\n`);
  hasErrors = true;
} else {
  console.log('✅ .env file found\n');
}

// Read .env file
let envContent = '';
try {
  envContent = readFileSync(envPath, 'utf-8');
} catch (error) {
  console.log('❌ Could not read .env file\n');
  process.exit(1);
}

// Parse environment variables
const envVars = {};
const lines = envContent.split('\n');
lines.forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// Required variables
const requiredVars = {
  'VITE_API_URL': process.env.VITE_API_URL || envVars.VITE_API_URL,
  'VITE_GOOGLE_CLIENT_ID': process.env.VITE_GOOGLE_CLIENT_ID || envVars.VITE_GOOGLE_CLIENT_ID,
  'VITE_FACEBOOK_APP_ID': process.env.VITE_FACEBOOK_APP_ID || envVars.VITE_FACEBOOK_APP_ID,
};

console.log('📋 Required Environment Variables:');
console.log('-'.repeat(60));

for (const [key, value] of Object.entries(requiredVars)) {
  if (!value || value.includes('your_') || value === 'YOUR_GOOGLE_CLIENT_ID' || value === 'YOUR_FACEBOOK_APP_ID') {
    if (key === 'VITE_API_URL' && (!value || value.includes('localhost'))) {
      console.log(`✅ ${key}: ${value || 'NOT SET'} (Using default for local development)`);
    } else {
      console.log(`⚠️  ${key}: ${value || 'NOT SET'} (OAuth will not work without this)`);
      if (key.includes('GOOGLE') || key.includes('FACEBOOK')) {
        // OAuth is optional, so don't fail the check
        console.log(`   Note: OAuth login will be disabled without this variable`);
      }
    }
  } else {
    const displayValue = key.includes('CLIENT_ID') || key.includes('APP_ID') 
      ? `${value.substring(0, 10)}...` 
      : value;
    console.log(`✅ ${key}: ${displayValue}`);
  }
}

// Optional variables
console.log('\n📋 Optional Environment Variables:');
console.log('-'.repeat(60));

const optionalVars = {
  'VITE_ENABLE_ANALYTICS': process.env.VITE_ENABLE_ANALYTICS || envVars.VITE_ENABLE_ANALYTICS,
  'VITE_ENABLE_MONITORING': process.env.VITE_ENABLE_MONITORING || envVars.VITE_ENABLE_MONITORING,
};

for (const [key, value] of Object.entries(optionalVars)) {
  if (value) {
    console.log(`✅ ${key}: ${value}`);
  } else {
    console.log(`⚪ ${key}: Not set (using default)`);
  }
}

// Summary
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.log('⚠️  Some environment variables need attention!');
  console.log('   Please check the warnings above.\n');
  process.exit(0); // Don't fail for OAuth variables
} else {
  console.log('✅ Environment variables check completed!\n');
  process.exit(0);
}

