// Firebase fix script for Netlify/Vite build issues
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Running Firebase fix script for Netlify build...');

// 1. Check package.json for Firebase version
const packageJsonPath = path.join(__dirname, 'package.json');
let packageJson;

try {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log(`Current Firebase version: ${packageJson.dependencies.firebase}`);
} catch (error) {
  console.error('Error reading package.json:', error);
  process.exit(1);
}

// 2. Add moduleResolution to tsconfig.json or jsconfig.json if it exists
const configFiles = ['tsconfig.json', 'jsconfig.json'];
configFiles.forEach(configFile => {
  const configPath = path.join(__dirname, configFile);
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (!config.compilerOptions) {
        config.compilerOptions = {};
      }
      config.compilerOptions.moduleResolution = "Node";
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      console.log(`✅ Updated ${configFile} with Node moduleResolution`);
    } catch (error) {
      console.error(`Error updating ${configFile}:`, error);
    }
  }
});

// 3. Create public/_redirects file for Netlify SPA routing
const redirectsPath = path.join(__dirname, 'public/_redirects');
if (!fs.existsSync(path.dirname(redirectsPath))) {
  fs.mkdirSync(path.dirname(redirectsPath), { recursive: true });
}
try {
  fs.writeFileSync(redirectsPath, '/* /index.html 200\n');
  console.log('✅ Created Netlify _redirects file');
} catch (error) {
  console.error('Error creating _redirects file:', error);
}

// 4. Fix inconsistent Firebase imports
console.log('🔧 Standardizing Firebase imports...');

// Function to process a file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file imports from firebase/firestore (not lite version)
    if (content.includes("from 'firebase/firestore'") || content.includes('from "firebase/firestore"')) {
      // Replace firebase/firestore with firebase/firestore/lite
      content = content.replace(/from ['"]firebase\/firestore['"]/g, 'from \'firebase/firestore/lite\'');
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed imports in ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

// Function to recursively walk through directory
function walkDir(dir) {
  let fileCount = 0;
  let fixedCount = 0;
  
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !filePath.includes('node_modules')) {
        const counts = walkDir(filePath);
        fileCount += counts.fileCount;
        fixedCount += counts.fixedCount;
      } else if (
        stat.isFile() && 
        (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.mjs'))
      ) {
        fileCount++;
        if (processFile(filePath)) {
          fixedCount++;
        }
      }
    });
  } catch (error) {
    console.error(`Error walking directory ${dir}:`, error);
  }
  
  return { fileCount, fixedCount };
}

const { fileCount, fixedCount } = walkDir(path.join(__dirname, 'src'));
console.log(`📊 Processed ${fileCount} files, fixed ${fixedCount} files with incorrect Firebase imports`);

// 4. Check .env file for Firebase config
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file exists');
} else {
  console.warn('⚠️ No .env file found! Make sure Firebase environment variables are set in Netlify');
}

console.log('✅ Firebase build fix complete!');
console.log('👉 You can now run "npm run build" to create a production build');
