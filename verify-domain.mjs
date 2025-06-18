#!/usr/bin/env node

/**
 * DNS and Domain Verification Script for karniexim.com
 * Checks DNS propagation and SSL certificate status
 */

import { execSync } from 'child_process';
import https from 'https';

const DOMAIN = 'karniexim.com';
const WWW_DOMAIN = 'www.karniexim.com';
const NETLIFY_SITE = 'karni-exim-new.netlify.app';

console.log('🔍 Checking DNS and domain configuration for karniexim.com...\n');

// Function to execute shell commands safely
function runCommand(command, description) {
  try {
    console.log(`🔄 ${description}...`);
    const output = execSync(command, { encoding: 'utf8', timeout: 10000 });
    console.log(`✅ ${description} completed`);
    return output.trim();
  } catch (error) {
    console.log(`❌ ${description} failed: ${error.message}`);
    return null;
  }
}

// Function to check HTTPS status
function checkHTTPS(url) {
  return new Promise((resolve) => {
    const request = https.get(url, { timeout: 5000 }, (res) => {
      resolve({
        status: res.statusCode,
        headers: res.headers,
        ssl: true
      });
    });
    
    request.on('error', (error) => {
      resolve({
        status: null,
        error: error.message,
        ssl: false
      });
    });
    
    request.on('timeout', () => {
      request.destroy();
      resolve({
        status: null,
        error: 'Request timeout',
        ssl: false
      });
    });
  });
}

// DNS Checks
console.log('📋 DNS Configuration Checks:');
console.log('=' * 50);

// Check A record
const aRecord = runCommand(`nslookup ${DOMAIN} 8.8.8.8`, `Checking A record for ${DOMAIN}`);
if (aRecord) {
  console.log('   Result:', aRecord.split('\n').slice(-2).join('\n'));
}

// Check CNAME for www
const cnameRecord = runCommand(`nslookup ${WWW_DOMAIN} 8.8.8.8`, `Checking CNAME record for ${WWW_DOMAIN}`);
if (cnameRecord) {
  console.log('   Result:', cnameRecord.split('\n').slice(-2).join('\n'));
}

// HTTPS and SSL Checks
console.log('\n🔒 HTTPS and SSL Checks:');
console.log('=' * 50);

async function runHTTPSChecks() {
  // Check main domain
  console.log(`🔄 Checking HTTPS for ${DOMAIN}...`);
  const mainDomainResult = await checkHTTPS(`https://${DOMAIN}`);
  if (mainDomainResult.ssl && mainDomainResult.status) {
    console.log(`✅ ${DOMAIN} - HTTPS working (Status: ${mainDomainResult.status})`);
  } else {
    console.log(`❌ ${DOMAIN} - HTTPS failed: ${mainDomainResult.error || 'Unknown error'}`);
  }

  // Check www domain
  console.log(`🔄 Checking HTTPS for ${WWW_DOMAIN}...`);
  const wwwDomainResult = await checkHTTPS(`https://${WWW_DOMAIN}`);
  if (wwwDomainResult.ssl && wwwDomainResult.status) {
    console.log(`✅ ${WWW_DOMAIN} - HTTPS working (Status: ${wwwDomainResult.status})`);
  } else {
    console.log(`❌ ${WWW_DOMAIN} - HTTPS failed: ${wwwDomainResult.error || 'Unknown error'}`);
  }

  // Check original Netlify domain
  console.log(`🔄 Checking original Netlify site...`);
  const netlifyResult = await checkHTTPS(`https://${NETLIFY_SITE}`);
  if (netlifyResult.ssl && netlifyResult.status) {
    console.log(`✅ ${NETLIFY_SITE} - Working (Status: ${netlifyResult.status})`);
  } else {
    console.log(`❌ ${NETLIFY_SITE} - Failed: ${netlifyResult.error || 'Unknown error'}`);
  }
}

// Performance Checks
console.log('\n⚡ Performance Checks:');
console.log('=' * 50);

// Ping test
const pingResult = runCommand(`ping -n 4 ${DOMAIN}`, `Ping test for ${DOMAIN}`);

// DNS propagation check (using external tools would be better, but this gives an idea)
console.log('\n🌍 DNS Propagation Status:');
console.log('=' * 50);
console.log('💡 For detailed DNS propagation check, visit:');
console.log(`   📊 https://whatsmydns.net/#A/${DOMAIN}`);
console.log(`   📊 https://dnschecker.org/#A/${DOMAIN}`);

// Run HTTPS checks
runHTTPSChecks().then(() => {
  console.log('\n📋 Summary and Recommendations:');
  console.log('=' * 50);
  console.log('1. If DNS checks fail, verify your Namecheap DNS settings');
  console.log('2. DNS propagation can take up to 48 hours');
  console.log('3. If HTTPS fails, check Netlify SSL certificate status');
  console.log('4. Ensure Force HTTPS is enabled in Netlify settings');
  console.log('\n📚 For detailed setup instructions, see: domain-setup-guide.md');
  console.log(`🎯 Target: Your site should be accessible at https://${DOMAIN}`);
  
  console.log('\n✅ Domain verification check completed!');
}).catch((error) => {
  console.error('❌ Error during HTTPS checks:', error.message);
});
