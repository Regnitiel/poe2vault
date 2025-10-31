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
echo "5. Add this description:"
echo ""
echo "---"
cat << 'EOF'
# VaultApp v1.0.1 - POE2 Unique Items Tracker

A desktop application for tracking Path of Exile 2 unique items with offline storage and Google Drive sync.

## Features
- ✅ Cross-platform (macOS & Windows)
- ✅ Offline unique item tracking
- ✅ Metrics dashboard with completion statistics
- ✅ Advanced filtering and search
- ✅ Google Drive JSON sync
- ✅ Modern React + TypeScript interface

## Downloads
- **macOS**: Download `VaultApp-macOS.zip`, extract, and run `VaultApp.app`
  - ⚠️ **First-time users**: See [macOS Security Fix Guide](https://github.com/YOUR_USERNAME/poe2vault/blob/main/MACOS_SECURITY_FIX.md) if blocked by Gatekeeper
- **Windows**: Download `VaultApp-Windows.zip`, extract, and run `VaultApp.exe`
  - ⚠️ **First-time users**: See [Windows Security Fix Guide](https://github.com/YOUR_USERNAME/poe2vault/blob/main/WINDOWS_SECURITY_FIX.md) if blocked by SmartScreen

## System Requirements
- **macOS**: 10.14+ (Mojave or later)
- **Windows**: Windows 10+ (64-bit)

## Installation
1. Download the appropriate file for your platform
2. Extract the zip file
3. Run the application (no installation required)
4. **macOS users**: If blocked by security warning, right-click → Open, then click "Open" again
5. **Windows users**: If blocked by SmartScreen, click "More info" → "Run anyway"

## Notes
- **Security warnings are normal** for unsigned applications on both platforms
- **macOS**: First run may require approval in System Preferences → Security & Privacy
- **Windows**: SmartScreen may show "Windows protected your PC" - click "More info" → "Run anyway"
- Your vault data is stored locally and can sync to Google Drive
- All functionality works offline
EOF
echo "---"
echo ""
echo "6. Drag and drop these files to the release:"
echo "   📁 releases/VaultApp-macOS.zip"
echo "   📁 releases/VaultApp-Windows.zip"
echo ""
echo "7. Click 'Publish release'"
echo ""
echo "🎉 That's it! Your releases will be available for download."
echo ""
echo "💡 Alternative upload methods:"
echo "   • Git LFS (for version control)"
echo "   • File hosting services (Dropbox, Google Drive)"
echo "   • Cloud storage with direct download links"
