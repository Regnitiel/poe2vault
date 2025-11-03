#!/bin/bash

# Prepare GitHub Release
# This script creates release assets and provides instructions for GitHub Release upload

echo "🚀 Preparing GitHub Release for VaultApp v1.0.1"
echo ""

# Check if releases exist
if [ ! -f "releases/VaultApp-macOS.zip" ] || [ ! -f "releases/VaultApp-Windows.zip" ]; then
    echo "📦 Creating release packages..."
    npm run release
else
    echo "✅ Release packages already exist"
fi

echo ""
echo "📊 Release Package Sizes:"
ls -lh releases/*.zip | awk '{print "   " $9 ": " $5}'

echo ""
echo "🎯 Manual GitHub Release Instructions:"
echo ""
echo "1. Go to: https://github.com/YOUR_USERNAME/poe2vault/releases"
echo "2. Click 'Create a new release'"
echo "3. Set tag version: v1.0.1"
echo "4. Set release title: VaultApp v1.0.1"

echo "6. Drag and drop these files to the release:"
echo "   📁 releases/VaultApp-macOS.zip"
echo "   📁 releases/VaultApp-Windows.zip"

echo "7. Click 'Publish release'"
