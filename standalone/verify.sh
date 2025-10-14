#!/bin/bash

# Script Scribbler Standalone - Verification Script
# This script checks if your installation is ready

echo "================================================"
echo "Script Scribbler - Installation Verification"
echo "================================================"
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SUCCESS=0
WARNINGS=0
ERRORS=0

# Check Node.js
echo "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js is installed: $NODE_VERSION"
    
    # Check if version is 16 or higher
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$MAJOR_VERSION" -lt 16 ]; then
        echo -e "${YELLOW}⚠${NC} Warning: Node.js version should be 16 or higher"
        ((WARNINGS++))
    else
        ((SUCCESS++))
    fi
else
    echo -e "${RED}✗${NC} Node.js is not installed!"
    echo "   Please install from https://nodejs.org/"
    ((ERRORS++))
fi
echo ""

# Check npm
echo "Checking npm installation..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} npm is installed: $NPM_VERSION"
    ((SUCCESS++))
else
    echo -e "${RED}✗${NC} npm is not installed!"
    echo "   npm should come with Node.js"
    ((ERRORS++))
fi
echo ""

# Check if we're in the standalone directory
echo "Checking directory..."
if [ -f "package.json" ] && [ -f "main.js" ]; then
    echo -e "${GREEN}✓${NC} You are in the standalone directory"
    ((SUCCESS++))
else
    echo -e "${RED}✗${NC} You are NOT in the standalone directory!"
    echo "   Please navigate to the standalone directory"
    ((ERRORS++))
fi
echo ""

# Check if node_modules exists
echo "Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Dependencies are installed"
    ((SUCCESS++))
    
    # Check if Electron is installed
    if [ -d "node_modules/electron" ]; then
        echo -e "${GREEN}✓${NC} Electron is installed"
        ((SUCCESS++))
    else
        echo -e "${YELLOW}⚠${NC} Electron is not installed"
        echo "   Run: npm install"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}⚠${NC} Dependencies not installed"
    echo "   Run: npm install"
    ((WARNINGS++))
fi
echo ""

# Check required files
echo "Checking required files..."
REQUIRED_FILES=("main.js" "preload.js" "index.html" "index.js" "styles.css" "package.json")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
        ((SUCCESS++))
    else
        echo -e "${RED}✗${NC} $file is missing!"
        ((ERRORS++))
    fi
done
echo ""

# Check disk space
echo "Checking disk space..."
AVAILABLE_SPACE=$(df -h . | tail -1 | awk '{print $4}')
echo "Available space: $AVAILABLE_SPACE"
if [ $(df . | tail -1 | awk '{print $4}') -gt 524288 ]; then  # 512 MB in KB
    echo -e "${GREEN}✓${NC} Sufficient disk space available"
    ((SUCCESS++))
else
    echo -e "${YELLOW}⚠${NC} Low disk space (need at least 512 MB)"
    ((WARNINGS++))
fi
echo ""

# Summary
echo "================================================"
echo "Verification Summary"
echo "================================================"
echo -e "${GREEN}Successes: $SUCCESS${NC}"
if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
fi
if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}Errors: $ERRORS${NC}"
fi
echo ""

# Final recommendation
if [ $ERRORS -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo -e "${GREEN}✓ Everything looks good!${NC}"
        echo ""
        echo "You can run the application with:"
        echo "  npm start"
        echo ""
        echo "Or use the build script:"
        echo "  ./build.sh"
    else
        echo -e "${YELLOW}⚠ Some warnings found${NC}"
        echo ""
        echo "You may need to run:"
        echo "  npm install"
        echo ""
        echo "Then try: npm start"
    fi
else
    echo -e "${RED}✗ Some errors need to be fixed${NC}"
    echo ""
    echo "Please fix the errors above and try again."
    echo ""
    echo "For help, see:"
    echo "  - BEGINNERS_GUIDE.md"
    echo "  - INSTALLATION.md"
fi
echo ""
