#!/bin/bash

# Setup script for Wine (required for Windows packaging from macOS)

echo "🍷 Setting up Wine for Windows packaging..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew is not installed. Please install it first:"
    echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

#!/bin/bash

# Setup script for Wine (required for Windows packaging from macOS)

echo "🍷 Setting up Wine for Windows packaging..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew is not installed. Please install it first:"
    echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

# Install Wine via Homebrew
echo "📦 Installing Wine via Homebrew..."
brew install --cask wine-stable

# Create wine64 symlink if it doesn't exist (required for electron-packager)
if ! command -v wine64 &> /dev/null; then
    echo "🔗 Creating wine64 symlink for electron-packager compatibility..."
    sudo ln -sf /opt/homebrew/bin/wine /opt/homebrew/bin/wine64
fi

# Verify installation
if command -v wine64 &> /dev/null; then
    echo "✅ Wine installed successfully!"
    wine64 --version
    echo ""
    echo "🎯 Windows packaging is now ready!"
    echo "   Run: npm run package-win"
    echo ""
    echo "💡 Note: Wine may show some warnings on first use - this is normal."
else
    echo "❌ Wine installation failed"
    exit 1
fi
