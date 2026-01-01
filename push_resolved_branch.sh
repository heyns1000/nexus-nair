#!/bin/bash
# Script to complete the merge conflict resolution for PR #25
# This script should be run by someone with push access to the repository

set -e

echo "=============================================="
echo "PR #25 Merge Conflict Resolution - Final Push"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -d ".git" ]; then
    echo "Error: Not in a git repository"
    exit 1
fi

echo "Current repository: $(git remote get-url origin)"
echo ""

# Fetch latest changes
echo "Fetching latest changes..."
git fetch origin

# Check out the resolved branch
echo "Checking out copilot/update-node-version-and-imports..."
git checkout copilot/update-node-version-and-imports

# Verify the merge commit exists
if git log --oneline -1 | grep -q "Merge main into copilot/update-node-version-and-imports"; then
    echo "✓ Merge commit found"
    git log --oneline -1
else
    echo "✗ Merge commit not found on this branch"
    echo "Current commit:"
    git log --oneline -1
    exit 1
fi

# Show what will be pushed
echo ""
echo "Changes to be pushed:"
git log origin/copilot/update-node-version-and-imports..HEAD --oneline 2>/dev/null || echo "Branch not yet on remote, will create it"

# Confirm before pushing
echo ""
read -p "Push these changes to origin? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Pushing to origin/copilot/update-node-version-and-imports..."
    git push origin copilot/update-node-version-and-imports
    
    echo ""
    echo "=============================================="
    echo "✓ Successfully pushed!"
    echo "=============================================="
    echo "PR #25 should now show as resolved."
    echo "Visit: https://github.com/heyns1000/nexus-nair/pull/25"
else
    echo "Push cancelled."
    exit 1
fi
