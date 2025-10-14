#!/bin/bash

# Script Scribbler Standalone - Build Script
# This script helps build the standalone application for different platforms

echo "================================================"
echo "Script Scribbler - Standalone Build Script"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if we're in the standalone directory
if [ ! -f "package.json" ]; then
    echo "ERROR: This script must be run from the standalone directory!"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        exit 1
    fi
    echo ""
fi

echo "What would you like to do?"
echo "1) Run the application (development mode)"
echo "2) Build for Windows"
echo "3) Build for macOS"
echo "4) Build for Linux"
echo "5) Build for all platforms"
echo "6) Exit"
echo ""
read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo "Starting Script Scribbler..."
        npm start
        ;;
    2)
        echo "Building for Windows..."
        npm run build:win
        echo "Build complete! Check the dist/ folder."
        ;;
    3)
        echo "Building for macOS..."
        npm run build:mac
        echo "Build complete! Check the dist/ folder."
        ;;
    4)
        echo "Building for Linux..."
        npm run build:linux
        echo "Build complete! Check the dist/ folder."
        ;;
    5)
        echo "Building for all platforms..."
        npm run build:all
        echo "Build complete! Check the dist/ folder."
        ;;
    6)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid choice!"
        exit 1
        ;;
esac
