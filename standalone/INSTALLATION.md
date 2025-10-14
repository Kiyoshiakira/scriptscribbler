# Quick Start Guide for Script Scribbler Standalone

## For End Users (Non-Technical)

If you just want to use the application without building it yourself:

1. **Wait for a pre-built release**: The maintainers will provide ready-to-use installers for Windows (.exe), macOS (.dmg), and Linux (.AppImage) in the releases section of the repository.

2. **Download the installer** for your operating system

3. **Install and run** the application like any other desktop software

## For Developers (Building from Source)

### Step 1: Install Node.js

Download and install Node.js from https://nodejs.org/ (version 16 or higher)

### Step 2: Install Dependencies

Open a terminal/command prompt and navigate to the standalone folder:

```bash
cd standalone
npm install
```

This will download Electron and all required dependencies (approximately 200-300 MB).

### Step 3: Run the Application

```bash
npm start
```

The application will launch in a desktop window.

### Step 4: Build Installers (Optional)

To create distributable installers:

**For Windows (on Windows):**
```bash
npm run build:win
```

**For macOS (on macOS):**
```bash
npm run build:mac
```

**For Linux (on Linux):**
```bash
npm run build:linux
```

The built applications will be in the `dist` folder.

## What Gets Installed

When you run `npm install`, the following major components are downloaded:

1. **Electron** (~200 MB): The desktop application framework
   - Includes Chromium browser engine (C++)
   - Includes Node.js runtime (C++)
   - Platform-specific binaries

2. **Electron Builder** (if building): Tool to create installers

## System Requirements

- **Operating System**: Windows 7+, macOS 10.11+, or Linux (most distributions)
- **RAM**: 2 GB minimum, 4 GB recommended
- **Disk Space**: 500 MB for installation and dependencies
- **Display**: 1024x768 minimum resolution

## Differences from Web Version

| Feature | Web Version | Standalone Version |
|---------|-------------|-------------------|
| Installation | None needed | One-time install |
| Internet | Required | Not required |
| File Saving | Browser downloads | Native file system |
| Performance | Browser-dependent | Consistent |
| Updates | Automatic | Manual/auto-update |
| Offline Use | Limited | Full support |

## Troubleshooting

### "npm: command not found"
- Node.js is not installed or not in your PATH
- Solution: Install Node.js from https://nodejs.org/

### "electron: command not found" 
- Dependencies not installed
- Solution: Run `npm install` in the standalone folder

### Application won't start
- Check if you're in the correct directory (`standalone/`)
- Try reinstalling: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 16+)

### Build fails
- Ensure you have enough disk space (at least 2 GB free)
- On Linux, you may need: `sudo apt-get install build-essential`
- On Windows, you may need: Visual Studio Build Tools

## Getting Help

- Check the main README.md for detailed documentation
- Visit the repository's Issues page
- Review Electron documentation at https://www.electronjs.org/

---

**Happy Writing!** 📝
