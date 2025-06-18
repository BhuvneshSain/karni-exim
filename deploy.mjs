#!/usr/bin/env node

/**
 * Deployment script for Karni Exim website
 * Handles build, validation, and deployment to Netlify with custom domain
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const DOMAIN = 'karniexim.com';
const NETLIFY_SITE = 'karni-exim-new.netlify.app';

console.log('🚀 Starting Karni Exim deployment process...\n');

// Step 1: Clean previous builds
console.log('🧹 Cleaning previous builds...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
  console.log('✅ Previous build cleaned');
}

// Step 2: Run linting
console.log('\n🔍 Running ESLint checks...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ Linting passed');
} catch (error) {
  console.error('❌ Linting failed. Please fix errors before deploying.');
  process.exit(1);
}

// Step 3: Build for production
console.log('\n🏗️  Building for production...');
try {
  execSync('npm run build:netlify', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed. Please check the errors above.');
  process.exit(1);
}

// Step 4: Validate build output
console.log('\n📋 Validating build output...');
const distPath = path.join(process.cwd(), 'dist');
const indexPath = path.join(distPath, 'index.html');

if (!fs.existsSync(distPath)) {
  console.error('❌ Dist folder not found');
  process.exit(1);
}

if (!fs.existsSync(indexPath)) {
  console.error('❌ index.html not found in dist folder');
  process.exit(1);
}

const stats = fs.statSync(indexPath);
console.log(`✅ Build validation passed (index.html: ${(stats.size / 1024).toFixed(2)} KB)`);

// Step 5: Check for required files
const requiredFiles = [
  'dist/index.html',
  'dist/assets',
  'netlify.toml'
];

console.log('\n📁 Checking required files...');
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} found`);
  } else {
    console.error(`❌ ${file} missing`);
    process.exit(1);
  }
}

// Step 6: Display deployment info
console.log('\n🌐 Deployment Information:');
console.log(`   Current Netlify URL: https://${NETLIFY_SITE}`);
console.log(`   Target Domain: https://${DOMAIN}`);
console.log(`   Build Directory: dist/`);
console.log(`   Configuration: netlify.toml`);

// Step 7: Preview locally (optional)
console.log('\n🔍 Starting local preview...');
console.log(`   Preview URL: http://localhost:4173`);
console.log('   Press Ctrl+C to stop preview\n');

try {
  execSync('npm run preview', { stdio: 'inherit' });
} catch (error) {
  // User likely pressed Ctrl+C, which is expected
  console.log('\n👋 Preview stopped by user');
}

console.log('\n✅ Deployment preparation complete!');
console.log('\n📋 Next Steps:');
console.log('1. Push your changes to your Git repository');
console.log('2. Netlify will automatically deploy the changes');
console.log('3. If setting up custom domain for the first time, follow domain-setup-guide.md');
console.log(`4. Your site will be live at: https://${DOMAIN}`);

console.log('\n🎉 Happy deploying!');
