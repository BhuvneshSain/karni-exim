import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files to remove
const filesToRemove = [
  'add-test-review.js',
  'add-sample-review.mjs',
  'check-reviews.js',
  'check-reviews-fixed.js',
  'fix-reviews.js',
  path.join('src', 'debug', 'firestore-test.html'),
  path.join('src', 'debug', 'test-firestore.js'),
  path.join('src', 'components', 'StaticReviewsTicker.jsx')
];

// Remove each file
for (const file of filesToRemove) {
  const filePath = path.join(__dirname, file);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Removed ${file} successfully`);
    } else {
      console.log(`${file} does not exist, skipping`);
    }
  } catch (err) {
    console.error(`Error removing ${file}:`, err);
  }
}

console.log('Cleanup complete');
