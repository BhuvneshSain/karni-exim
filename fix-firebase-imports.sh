#!/bin/bash

# This script fixes Firebase v11 imports in the project
# Run it before building for production

echo "🔍 Finding files with Firebase imports..."

# Create a temporary directory for backups
mkdir -p temp_backups

# Find all JavaScript and JSX files
for file in $(find ./src -type f \( -name "*.js" -o -name "*.jsx" \) | grep -v "node_modules")
do
  echo "Checking $file"
  
  # Check if the file imports from firebase
  if grep -q "import.*from.*firebase" "$file"; then
    echo "🔧 Fixing imports in $file"
    
    # Replace incorrect Firebase imports
    sed -i.bak 's/import { collection, query, where, getDocs, doc, updateDoc } from '\''firebase\/firestore'\''/import { collection, query, where, getDocs, doc, updateDoc } from '\''firebase\/firestore\/lite'\''/g' "$file"
    sed -i.bak 's/import { getFirestore } from "firebase\/firestore"/import { getFirestore } from "firebase\/firestore\/lite"/g' "$file"
    
    echo "✅ Fixed $file"
  fi
done

echo "✅ Firebase import fixes complete!"
