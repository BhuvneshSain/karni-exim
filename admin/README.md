# Review System Maintenance Tools

This directory contains utility scripts used for maintaining the review system in cases of data issues.

## Available Utilities

1. `update-reviews-flags.mjs` - Ensures all reviews have proper `isAdmin` and `approved` flags set to true, and valid timestamps.

2. `fix-review-timestamps.mjs` - Diagnoses and fixes reviews with missing timestamps.

3. `verify-reviews.js` - Verifies the current state of reviews in the database.

## When To Use These Tools

These tools should only be used when:

1. You notice reviews are not displaying correctly on the website
2. You're importing reviews from another source
3. You're troubleshooting database issues

## Usage Instructions

Run these tools from the main project directory using Node.js:

```bash
# Update all reviews to ensure they have correct flags
node admin/update-reviews-flags.mjs

# Fix any reviews with missing timestamps
node admin/fix-review-timestamps.mjs

# Verify the current state of reviews
node admin/verify-reviews.js
```

## Normal Review Management

For regular day-to-day management of reviews, please use the admin panel in the website interface. These scripts are only for maintenance purposes.
