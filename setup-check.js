/**
 * Complete Setup Checker
 * Run this script from the root directory to check everything
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

console.log('\n🚀 NusaPalma Setup Checker\n');
console.log('='.repeat(60));
console.log('Checking all required setup...\n');

let hasErrors = false;
let hasWarnings = false;

// Check if .env files exist
console.log('📁 Checking Environment Files:');
console.log('-'.repeat(60));

const backendEnv = join(process.cwd(), 'backend', '.env');
const frontendEnv = join(process.cwd(), 'frontend', '.env');

if (!existsSync(backendEnv)) {
  console.log('❌ backend/.env: NOT FOUND');
  console.log('   → Copy backend/env.example to backend/.env');
  hasErrors = true;
} else {
  console.log('✅ backend/.env: FOUND');
}

if (!existsSync(frontendEnv)) {
  console.log('❌ frontend/.env: NOT FOUND');
  console.log('   → Copy frontend/.env.example to frontend/.env');
  hasErrors = true;
} else {
  console.log('✅ frontend/.env: FOUND');
}

// Check MongoDB
console.log('\n📦 Checking MongoDB:');
console.log('-'.repeat(60));

try {
  execSync('mongod --version', { stdio: 'ignore' });
  console.log('✅ MongoDB: INSTALLED');
  
  try {
    execSync('mongosh --eval "db.version()" --quiet', { stdio: 'ignore', timeout: 5000 });
    console.log('✅ MongoDB: RUNNING');
  } catch (error) {
    console.log('⚠️  MongoDB: INSTALLED but NOT RUNNING');
    console.log('   → Start MongoDB: mongod (or use MongoDB service)');
    hasWarnings = true;
  }
} catch (error) {
  console.log('❌ MongoDB: NOT INSTALLED');
  console.log('   → Install MongoDB from: https://www.mongodb.com/try/download/community');
  hasErrors = true;
}

// Check Node.js
console.log('\n📦 Checking Node.js:');
console.log('-'.repeat(60));

try {
  const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
  const majorVersion = parseInt(nodeVersion.substring(1).split('.')[0]);
  
  if (majorVersion >= 16) {
    console.log(`✅ Node.js: ${nodeVersion} (OK)`);
  } else {
    console.log(`⚠️  Node.js: ${nodeVersion} (Requires v16 or higher)`);
    hasWarnings = true;
  }
} catch (error) {
  console.log('❌ Node.js: NOT INSTALLED');
  console.log('   → Install Node.js from: https://nodejs.org/');
  hasErrors = true;
}

// Check npm
console.log('\n📦 Checking npm:');
console.log('-'.repeat(60));

try {
  const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
  console.log(`✅ npm: ${npmVersion}`);
} catch (error) {
  console.log('❌ npm: NOT INSTALLED');
  hasErrors = true;
}

// Check dependencies
console.log('\n📦 Checking Dependencies:');
console.log('-'.repeat(60));

const backendNodeModules = join(process.cwd(), 'backend', 'node_modules');
const frontendNodeModules = join(process.cwd(), 'frontend', 'node_modules');

if (existsSync(backendNodeModules)) {
  console.log('✅ Backend dependencies: INSTALLED');
} else {
  console.log('❌ Backend dependencies: NOT INSTALLED');
  console.log('   → Run: cd backend && npm install');
  hasErrors = true;
}

if (existsSync(frontendNodeModules)) {
  console.log('✅ Frontend dependencies: INSTALLED');
} else {
  console.log('❌ Frontend dependencies: NOT INSTALLED');
  console.log('   → Run: cd frontend && npm install');
  hasErrors = true;
}

// Summary
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.log('❌ Setup is incomplete! Please fix the errors above.\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Setup is mostly complete, but please check the warnings above.\n');
  process.exit(0);
} else {
  console.log('✅ Setup is complete! You can now run the application.\n');
  console.log('Next steps:');
  console.log('  1. Start MongoDB: mongod');
  console.log('  2. Start Backend: cd backend && npm start');
  console.log('  3. Start Frontend: cd frontend && npm run dev\n');
  process.exit(0);
}

