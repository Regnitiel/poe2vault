#!/bin/bash

# Script to create compressed distribution packages

echo "📦 Creating distribution packages..."

# Check if builds directory exists
if [ ! -d "builds" ]; then
    echo "❌ No builds directory found. Run 'npm run package-all' first."
    exit 1
fi

# Create dist directory for releases
mkdir -p releases

# Function to create zip with progress
create_zip() {
    local source_dir="$1"
    local zip_name="$2"
    local platform="$3"
    
    if [ -d "$source_dir" ]; then
        echo "🗜️  Compressing $platform build..."
        
        # Remove old zip if exists
        [ -f "releases/$zip_name" ] && rm "releases/$zip_name"
        
        # Create zip with maximum compression
        cd builds
        zip -r -9 -q "../releases/$zip_name" "$(basename "$source_dir")"
        cd ..
        
        # Get file sizes
        local original_size=$(du -sh "$source_dir" | cut -f1)
        local zip_size=$(du -sh "releases/$zip_name" | cut -f1)
        
        echo "✅ $platform: $original_size → $zip_size (releases/$zip_name)"
    else
        echo "⚠️  $platform build not found: $source_dir"
    fi
}

# Create platform-specific zips
create_zip "builds/EternalVault-darwin-x64" "EternalVault-macOS.zip" "macOS"
create_zip "builds/EternalVault-win32-x64" "EternalVault-Windows.zip" "Windows"

echo ""
echo "🎉 Distribution packages created in 'releases/' directory:"
echo ""
ls -lah releases/ 2>/dev/null || echo "No releases created."
echo ""
echo "📝 These files are ready for:"
echo "   • GitHub Releases"
echo "   • Direct distribution"
echo "   • Cloud storage sharing"
