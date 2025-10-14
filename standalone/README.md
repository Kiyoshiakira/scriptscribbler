# Script Scribbler - Standalone Desktop Application

> 📚 **New to this?** Check out **[INDEX.md](INDEX.md)** for a complete guide to all documentation!

This is the standalone desktop version of Script Scribbler, built with Electron. It runs as a native desktop application on Windows, macOS, and Linux without requiring a web browser.

## Quick Links

- 🚀 **[Beginner's Guide](BEGINNERS_GUIDE.md)** - Start here if you're new!
- 📦 **[Installation Guide](INSTALLATION.md)** - How to install and run
- ⚡ **[Quick Start](QUICK_START.md)** - Quick reference
- 🔄 **[Web vs Standalone](WEB_VS_STANDALONE.md)** - Which version to use?
- 🏗️ **[Architecture](ARCHITECTURE.md)** - Technical details
- 📊 **[Diagrams](DIAGRAMS.md)** - Visual architecture
- 📑 **[Documentation Index](INDEX.md)** - Find the right guide

## Features

- **Native Desktop Application**: Runs standalone without a browser
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **File System Integration**: Save and load projects directly to your computer
- **Export Capabilities**: Export to JSON, XML, Fountain, and Text formats
- **Native Menus**: Standard desktop application menus and keyboard shortcuts
- **Offline Support**: Works completely offline

## Technology Stack

Script Scribbler Standalone uses:
- **Electron**: A framework built on top of Chromium (C++/V8 engine) and Node.js
- **Node.js**: JavaScript runtime built on Chrome's V8 engine (written in C++)
- **Chromium**: Open-source browser engine (written in C++)

While the application UI is written in HTML/CSS/JavaScript, it runs on a C++ foundation through Electron, which packages Chromium and Node.js to create a true desktop application.

## Installation

### Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)

### Steps

1. Navigate to the standalone directory:
   ```bash
   cd standalone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

To run the application in development mode:

```bash
npm start
```

This will launch Script Scribbler as a desktop application.

## Building Executables

You can build standalone executables for different platforms:

### Build for Windows
```bash
npm run build:win
```

This creates:
- NSIS installer (.exe)
- Portable version (.exe)

### Build for macOS
```bash
npm run build:mac
```

This creates:
- DMG installer (.dmg)
- ZIP archive (.zip)

### Build for Linux
```bash
npm run build:linux
```

This creates:
- AppImage (.AppImage)
- Debian package (.deb)

### Build for All Platforms
```bash
npm run build:all
```

Built applications will be located in the `dist` folder.

## Usage

### Keyboard Shortcuts

- **Ctrl/Cmd + N**: New Project
- **Ctrl/Cmd + O**: Open Project
- **Ctrl/Cmd + S**: Save Project
- **Ctrl/Cmd + Q**: Quit Application

### File Menu

- **New Project**: Create a new script project
- **Open Project**: Load a saved project from disk
- **Save Project**: Save current project to disk
- **Export**: Export your script in various formats (JSON, XML, Fountain, Text)
- **Exit**: Close the application

### Edit Menu

Standard editing operations:
- Undo/Redo
- Cut/Copy/Paste
- Select All

### View Menu

- Reload
- Toggle Developer Tools
- Zoom controls
- Fullscreen mode

## Project File Format

Projects are saved as JSON files with the `.json` extension. They contain:
- Project metadata (title, version, creation date)
- All scenes and script content
- Notes (character, world, plot, etc.)

## C++ Components

While this application uses JavaScript for the UI layer, it relies heavily on C++ components:

1. **Chromium Browser Engine**: The rendering engine that displays the UI (written in C++)
2. **V8 JavaScript Engine**: Executes JavaScript code (written in C++)
3. **Node.js Runtime**: Provides file system and OS integration (core written in C++)
4. **Electron Framework**: Native desktop wrapper (built on C++ foundations)

This architecture provides the best of both worlds: rapid UI development with web technologies, combined with native desktop performance and capabilities through C++ foundations.

## Folder Structure

```
standalone/
├── main.js              # Electron main process (app entry point)
├── preload.js           # Electron preload script (security bridge)
├── package.json         # Node.js package configuration
├── index.html           # Application HTML
├── index.js             # Application logic
├── styles.css           # Application styles
├── assets/              # Application assets (icons, images)
│   └── icon.png        # Application icon
└── README.md           # This file
```

## Development Notes

### Adding New Features

1. UI changes: Modify `index.html`, `index.js`, or `styles.css`
2. Native functionality: Add handlers in `main.js`
3. IPC communication: Update `preload.js` for secure renderer-main communication

### Security

The application follows Electron security best practices:
- `nodeIntegration` is disabled
- `contextIsolation` is enabled
- IPC communication goes through a secure preload script
- No arbitrary code execution from renderer process

## Troubleshooting

### Application won't start
- Ensure Node.js is installed: `node --version`
- Reinstall dependencies: `npm install`
- Check console for errors: `npm start`

### Build fails
- Update Electron: `npm update electron`
- Check disk space for build output
- Ensure you have build tools installed for your platform

### File saving issues
- Check file permissions in the target directory
- Ensure the file path is valid
- Try saving to a different location

## License

MIT License - See main repository for details

## Support

For issues and feature requests, please visit the main Script Scribbler repository.

---

**Note**: This standalone version provides the same functionality as the web version but with enhanced desktop integration and the ability to run completely offline.
