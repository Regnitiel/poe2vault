#!/bin/bash

# Create Update Manifest Files for electron-updater
# This generates the latest.yml and latest-mac.yml files required by electron-updater

set -e

echo "=== Creating Update Manifest Files for electron-updater ==="
echo ""

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")
echo "App Version: $VERSION"

# Get file info for Windows
if [ -f "releases/VaultApp-Windows.zip" ]; then
    WIN_SIZE=$(stat -f%z "releases/VaultApp-Windows.zip" 2>/dev/null || stat -c%s "releases/VaultApp-Windows.zip" 2>/dev/null)
    WIN_SHA512=$(shasum -a 512 releases/VaultApp-Windows.zip | awk '{print $1}')
    WIN_SHA512_BASE64=$(echo -n "$WIN_SHA512" | xxd -r -p | base64)
    
    echo ""
    echo "Windows Build:"
    echo "  File: VaultApp-Windows.zip"
    echo "  Size: $WIN_SIZE bytes"
    echo "  SHA512: $WIN_SHA512_BASE64"
    
    # Create latest.yml for Windows
    cat > releases/latest.yml << EOF
version: $VERSION
files:
  - url: VaultApp-Windows.zip
    sha512: $WIN_SHA512_BASE64
    size: $WIN_SIZE
path: VaultApp-Windows.zip
sha512: $WIN_SHA512_BASE64
releaseDate: '$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'
EOF
    
    echo "✅ Created releases/latest.yml"
else
    echo "❌ Windows build not found: releases/VaultApp-Windows.zip"
fi

# Get file info for macOS
if [ -f "releases/VaultApp-macOS.zip" ]; then
    MAC_SIZE=$(stat -f%z "releases/VaultApp-macOS.zip" 2>/dev/null || stat -c%s "releases/VaultApp-macOS.zip" 2>/dev/null)
    MAC_SHA512=$(shasum -a 512 releases/VaultApp-macOS.zip | awk '{print $1}')
    MAC_SHA512_BASE64=$(echo -n "$MAC_SHA512" | xxd -r -p | base64)
    
    echo ""
    echo "macOS Build:"
    echo "  File: VaultApp-macOS.zip"
    echo "  Size: $MAC_SIZE bytes"
    echo "  SHA512: $MAC_SHA512_BASE64"
    
    # Create latest-mac.yml for macOS
    cat > releases/latest-mac.yml << EOF
version: $VERSION
files:
  - url: VaultApp-macOS.zip
    sha512: $MAC_SHA512_BASE64
    size: $MAC_SIZE
path: VaultApp-macOS.zip
sha512: $MAC_SHA512_BASE64
releaseDate: '$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'
EOF
    
    echo "✅ Created releases/latest-mac.yml"
else
    echo "❌ macOS build not found: releases/VaultApp-macOS.zip"
fi

echo ""
echo "=== Manifest Files Created Successfully ==="
echo ""
echo "Next steps:"
echo "1. Upload these files to your GitHub release v$VERSION:"
echo "   - releases/VaultApp-Windows.zip"
echo "   - releases/VaultApp-macOS.zip"
echo "   - releases/latest.yml"
echo "   - releases/latest-mac.yml"
echo ""
echo "2. Make sure the GitHub release tag is: v$VERSION"
echo ""
echo "3. electron-updater will now be able to detect and download updates!"
echo ""
