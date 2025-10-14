# Getting Started with Script Scribbler Standalone

## 🚀 New to Standalone Applications?

Don't worry! This guide will walk you through everything step by step.

## What Is This?

**Script Scribbler Standalone** is a desktop application for writing screenplays. It's like Microsoft Word or Google Docs, but specifically designed for scriptwriting.

### Why "Standalone"?
- **Standalone** = Runs on its own, without needing a web browser
- **Desktop Application** = Installed on your computer like any other program
- **Offline** = Works without internet connection

## Before You Start

You need to install **Node.js** first. Think of it as a helper program that runs JavaScript on your computer (not just in a browser).

### Installing Node.js (One Time Only)

1. **Visit**: https://nodejs.org/
2. **Download**: Click the big green button (LTS version recommended)
3. **Install**: Double-click the downloaded file and follow the installer
4. **Verify**: Open a terminal/command prompt and type:
   ```bash
   node --version
   ```
   You should see something like `v18.17.0` or similar

## Step-by-Step Installation

### Option A: Quick Start (Recommended for Beginners)

#### On Windows:
1. Open the `standalone` folder
2. Double-click `build.bat`
3. Choose option 1 (Run the application)
4. Wait for installation to complete (first time takes 5-10 minutes)
5. The app will launch automatically!

#### On Mac/Linux:
1. Open Terminal
2. Navigate to the standalone folder:
   ```bash
   cd path/to/scriptscribbler/standalone
   ```
3. Run the build script:
   ```bash
   ./build.sh
   ```
4. Choose option 1 (Run the application)
5. Wait for installation to complete (first time takes 5-10 minutes)
6. The app will launch automatically!

### Option B: Manual Installation (For Advanced Users)

1. **Open Terminal/Command Prompt**
   - Windows: Press `Win + R`, type `cmd`, press Enter
   - Mac: Press `Cmd + Space`, type `terminal`, press Enter
   - Linux: Press `Ctrl + Alt + T`

2. **Navigate to the standalone folder**
   ```bash
   cd path/to/scriptscribbler/standalone
   ```
   
   Replace `path/to/scriptscribbler` with the actual path. For example:
   - Windows: `cd C:\Users\YourName\Downloads\scriptscribbler\standalone`
   - Mac/Linux: `cd ~/Downloads/scriptscribbler/standalone`

3. **Install dependencies** (First time only - downloads ~300 MB)
   ```bash
   npm install
   ```
   
   This will take 5-10 minutes. You'll see lots of text scrolling by - this is normal!

4. **Run the application**
   ```bash
   npm start
   ```
   
   The application will launch in a new window!

## First Launch

When you first run Script Scribbler:

1. **A window opens** - This is your script editor
2. **You see example content** - Sample scenes and notes to help you understand the interface
3. **You can start editing** - Click in the editor and start typing!

## Basic Usage

### Writing Your First Script

1. **Create a new project**: File → New Project (or press `Ctrl+N` / `Cmd+N`)
2. **Start typing**: Click in the editor area
3. **Change formatting**: Use the dropdown at the top to select:
   - Scene Heading (e.g., "INT. COFFEE SHOP - DAY")
   - Action (describe what's happening)
   - Character (who's speaking)
   - Dialogue (what they're saying)

### Saving Your Work

1. **Save**: File → Save Project (or press `Ctrl+S` / `Cmd+S`)
2. **Choose location**: Pick where to save on your computer
3. **Name your file**: Give it a meaningful name like "MyScript.json"
4. **Click Save**

Your work is now saved! You can close the app and come back anytime.

### Opening a Saved Project

1. **Open**: File → Open Project (or press `Ctrl+O` / `Cmd+O`)
2. **Find your file**: Navigate to where you saved it
3. **Select and open**: Click the file and click "Open"

Your script loads right where you left off!

### Exporting Your Script

Want to share your script or use it in other software?

1. **Export**: File → Export → Choose format
2. **Pick a format**:
   - **JSON**: For programmers or data exchange
   - **XML**: Universal format
   - **Fountain**: Plain text screenplay format (widely supported)
   - **Text**: Simple text file
3. **Choose location**: Pick where to save
4. **Done!**: Your script is exported

## Keyboard Shortcuts

Make your work faster with keyboard shortcuts:

| Action | Windows/Linux | Mac |
|--------|--------------|-----|
| New Project | `Ctrl + N` | `Cmd + N` |
| Open Project | `Ctrl + O` | `Cmd + O` |
| Save Project | `Ctrl + S` | `Cmd + S` |
| Undo | `Ctrl + Z` | `Cmd + Z` |
| Redo | `Ctrl + Y` | `Cmd + Shift + Z` |
| Cut | `Ctrl + X` | `Cmd + X` |
| Copy | `Ctrl + C` | `Cmd + C` |
| Paste | `Ctrl + V` | `Cmd + V` |
| Quit | `Ctrl + Q` | `Cmd + Q` |

## Understanding the Interface

### Top Tabs
- **📜 Script**: Write your screenplay
- **📋 Notes**: Organize character, world, and plot notes
- **🎬 Board**: Visual organization (coming soon)
- **👥 Characters**: Character management
- **📊 Stats**: Word count, page count, statistics

### Left Sidebar (Script View)
- **Scenes**: List of all scenes in your script
- **Quick Integration**: Export options

### Editor Area
- This is where you write your script
- Click to start typing
- Use the dropdown to change formatting

## Troubleshooting

### "npm: command not found"
**Problem**: Node.js is not installed
**Solution**: Install Node.js from https://nodejs.org/

### "Cannot find module..."
**Problem**: Dependencies not installed
**Solution**: Run `npm install` in the standalone folder

### Application won't start
**Problem**: Various causes
**Solutions**:
1. Make sure you're in the `standalone` folder
2. Try reinstalling: Delete `node_modules` folder and run `npm install` again
3. Restart your computer and try again

### Slow first launch
**Normal!**: First time downloading ~300 MB of files
**Wait**: 5-10 minutes depending on internet speed
**Next time**: Launches in seconds

## Building an Installer (Advanced)

Want to create an installer to share with others or install on another computer?

### Windows Installer
```bash
npm run build:win
```
Creates an `.exe` installer in the `dist` folder

### Mac Installer
```bash
npm run build:mac
```
Creates a `.dmg` installer in the `dist` folder

### Linux Package
```bash
npm run build:linux
```
Creates an `.AppImage` in the `dist` folder

**Note**: Building takes 5-15 minutes and requires ~2 GB of disk space.

## Tips for New Users

1. **Save Often**: Press `Ctrl+S` / `Cmd+S` frequently
2. **Experiment**: Try different formatting options
3. **Use Notes**: Keep character and world notes organized
4. **Explore Menus**: Check out all the menu options
5. **Keyboard Shortcuts**: Learn the shortcuts to work faster

## Getting Help

If you're stuck:

1. **Check the documentation**:
   - `README.md` - Full guide
   - `INSTALLATION.md` - Detailed installation
   - `ARCHITECTURE.md` - Technical details

2. **Search for errors**: Copy error messages and search online

3. **Ask for help**: Open an issue in the GitHub repository

## What's Happening Behind the Scenes?

When you run `npm install`:
- Downloads Electron (the framework)
- Downloads Chromium (the browser engine)
- Downloads Node.js tools
- Total: ~300 MB

When you run `npm start`:
- Launches Electron
- Loads your script editor
- Creates a window
- You're ready to write!

## Privacy & Security

- **No internet required**: Works completely offline
- **Your data stays local**: All files saved on your computer
- **No tracking**: No data sent anywhere
- **Open source**: Code is visible and auditable

## Next Steps

1. **Try it out**: Launch the app and explore
2. **Write something**: Start a new script
3. **Save your work**: Practice saving and loading
4. **Read more**: Check out the other documentation files

---

**Happy Writing!** 📝✨

If you have questions, check the other documentation files or ask in the repository's issues section.
