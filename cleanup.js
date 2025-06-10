// Cleanup utility for maintenance tasks
import fs from 'fs';
import path from 'path';

console.log("Karni Exim Cleanup Utility");
console.log("==========================");

// Clean up development artifacts
function cleanupDevArtifacts() {
  console.log("\n🧹 Cleaning up development artifacts...");
  
  // List of directories to check and clean
  const dirsToClean = [
    'dist',
    'dist-ssr',
    '.netlify',
    'node_modules/.vite'
  ];
  
  dirsToClean.forEach(dir => {
    try {
      if (fs.existsSync(dir)) {
        console.log(`Removing ${dir}...`);
        fs.rmSync(dir, { recursive: true, force: true });
      }
    } catch (err) {
      console.error(`Error removing ${dir}: ${err.message}`);
    }
  });
}

// Remove log files
function cleanupLogs() {
  console.log("\n🧹 Cleaning up log files...");
  
  const logExtensions = ['.log', '.log.gz'];
  
  try {
    // Check current directory for log files
    const files = fs.readdirSync('.');
    
    files.forEach(file => {
      const ext = path.extname(file);
      if (logExtensions.includes(ext) || file.includes('debug.log') || file.includes('npm-debug')) {
        console.log(`Removing ${file}...`);
        fs.unlinkSync(file);
      }
    });
  } catch (err) {
    console.error(`Error cleaning logs: ${err.message}`);
  }
}

// Clean temporary media files that might be created during development
function cleanupMediaCache() {
  console.log("\n🧹 Cleaning up media cache...");
  
  // Paths where temporary media files might be stored
  const mediaPaths = [
    'public/temp-uploads',
    'src/assets/temp'
  ];
  
  mediaPaths.forEach(dir => {
    try {
      if (fs.existsSync(dir)) {
        console.log(`Cleaning ${dir}...`);
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          const filePath = path.join(dir, file);
          if (!file.includes('.gitkeep')) {
            fs.unlinkSync(filePath);
          }
        });
      }
    } catch (err) {
      console.error(`Error cleaning ${dir}: ${err.message}`);
    }
  });
}

// Run all cleanup functions
function runCleanup() {
  console.log("Starting cleanup process...");
  
  cleanupDevArtifacts();
  cleanupLogs();
  cleanupMediaCache();
  
  console.log("\n✅ Cleanup completed successfully!");
}

// Execute the cleanup
runCleanup();
