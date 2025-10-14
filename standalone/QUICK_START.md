# Script Scribbler Standalone - Quick Reference

## What You Have Here

This `/standalone` directory contains a complete desktop application version of Script Scribbler that runs without a web browser.

## Files in This Directory

### Core Application Files
- **main.js** - Electron main process (app entry point, window management)
- **preload.js** - Security bridge between renderer and main process
- **index.html** - Application user interface (HTML)
- **index.js** - Application logic (JavaScript with Electron integration)
- **styles.css** - Application styling (CSS)

### Configuration
- **package.json** - Node.js/Electron configuration and build settings

### Documentation
- **README.md** - Main documentation (start here!)
- **INSTALLATION.md** - Installation and quick start guide
- **ARCHITECTURE.md** - Technical details about C++ components
- **THIS_FILE.md** - Quick reference (you are here)

### Build Scripts
- **build.sh** - Build script for macOS/Linux
- **build.bat** - Build script for Windows

### Assets
- **assets/** - Application resources (icon, images)

### Generated (after installation)
- **node_modules/** - Dependencies (created by `npm install`)
- **dist/** - Built applications (created by build commands)

## Quick Commands

### First Time Setup
```bash
npm install
```

### Run the App
```bash
npm start
```

### Build Installers
```bash
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
npm run build:all    # All platforms
```

Or use the helper scripts:
- **Linux/macOS**: `./build.sh`
- **Windows**: `build.bat`

## Technology Stack

| Component | Technology | Written In |
|-----------|-----------|------------|
| Framework | Electron | C++ |
| Browser Engine | Chromium | C++ |
| JS Engine | V8 | C++ |
| Runtime | Node.js | C++ |
| UI Layer | HTML/CSS/JS | JavaScript |

## Key Features

✅ Runs standalone (no browser needed)
✅ Native file system access
✅ Works completely offline
✅ Cross-platform (Windows, macOS, Linux)
✅ Native menus and keyboard shortcuts
✅ Built on C++ foundation (Chromium, V8, Node.js)

## File Sizes

- Source files: ~100 KB
- Dependencies (after npm install): ~300 MB
- Built application: ~150-250 MB (includes Electron runtime)

The large size includes the entire Chromium browser engine, V8 JavaScript engine, and Node.js runtime - all written in C++ for maximum performance.

## Getting Help

1. **README.md** - Comprehensive guide
2. **INSTALLATION.md** - Setup instructions
3. **ARCHITECTURE.md** - Technical deep-dive
4. **Repository Issues** - Report bugs or ask questions

## Next Steps

1. Read **README.md** for full documentation
2. Run `npm install` to get started
3. Run `npm start` to launch the app
4. Explore the code and customize as needed!

---

**Note**: This is a fully functional desktop application built on enterprise-grade C++ components (Chromium, V8, Node.js) with a modern JavaScript UI layer.
