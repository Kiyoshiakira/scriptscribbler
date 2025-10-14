# Web vs Standalone Comparison

## Quick Comparison

| Aspect | Web Version | Standalone Version |
|--------|-------------|-------------------|
| **Platform** | Any browser | Windows, macOS, Linux |
| **Installation** | None | One-time install (~250 MB) |
| **Internet** | Required | Not required |
| **Startup** | Open browser, navigate to URL | Double-click icon |
| **File Saving** | Browser downloads | Native file system |
| **Offline Use** | Limited (cached) | Fully functional |
| **Updates** | Automatic | Manual or auto-update |
| **Performance** | Browser-dependent | Consistent, optimized |
| **Native Feel** | Limited | Full desktop integration |
| **Menus** | Web-based | Native OS menus |
| **Shortcuts** | Limited | Full keyboard shortcuts |

## Detailed Comparison

### User Experience

#### Web Version
- Open browser
- Navigate to website
- Everything in browser tab
- Browser chrome takes screen space
- Limited to browser capabilities

#### Standalone Version
- Launch from desktop icon or start menu
- Dedicated application window
- Full screen control
- Native window controls (minimize, maximize, close)
- Feels like a real desktop application

### File Management

#### Web Version
```
User Action: Save
  ↓
Browser download manager
  ↓
Downloads folder
  ↓
User must organize files manually
```

#### Standalone Version
```
User Action: Save (Ctrl+S)
  ↓
Native save dialog
  ↓
User chooses exact location
  ↓
File saved with native OS integration
```

### Functionality

#### Both Versions Have:
- Full script editor
- Scene management
- Notes system (Character, World, Object, Plot)
- Export functionality (JSON, XML, Fountain, Text)
- Smart formatting
- Word/page count

#### Standalone Additional Features:
- Native file dialogs
- Keyboard shortcuts (Ctrl/Cmd+S, Ctrl/Cmd+N, etc.)
- Native menus (File, Edit, View, Help)
- Application about dialog
- Window state persistence
- Direct file system access
- No URL bar or browser UI

### Technical Differences

#### Web Version
```
Technology Stack:
- HTML/CSS/JavaScript
- Runs in browser
- Browser security restrictions
- Limited OS access
```

#### Standalone Version
```
Technology Stack:
- Electron (C++ foundation)
- Chromium engine (C++)
- V8 JavaScript engine (C++)
- Node.js runtime (C++)
- HTML/CSS/JavaScript (UI layer)
- Full OS access
- Native integration
```

### Performance

#### Web Version
- Performance varies by browser
- Competes with other tabs for resources
- Limited by browser memory management
- Network latency for initial load

#### Standalone Version
- Consistent performance
- Dedicated resources
- Optimized memory management
- No network dependency after installation

### Security

#### Web Version
- Browser sandbox
- Same-origin policy
- Limited file access
- HTTPS required for security

#### Standalone Version
- Chromium sandbox for renderer
- Electron context isolation
- Full file system access (controlled)
- No network required (offline secure)

### Storage

#### Web Version
- localStorage (limited to ~10 MB)
- IndexedDB (limited by browser)
- Files in Downloads folder
- Can be cleared by browser

#### Standalone Version
- Unlimited local storage
- Direct file system access
- User controls file locations
- Persistent across sessions

### Deployment

#### Web Version
```
Deployment:
1. Update files on server
2. Users get updates automatically
3. No user action needed

Distribution:
- URL sharing
- No installation required
- Works on any device with browser
```

#### Standalone Version
```
Deployment:
1. Build installers for each platform
2. Distribute installers
3. Users install/update manually (or auto-update)

Distribution:
- Download installers
- Platform-specific (.exe, .dmg, .AppImage)
- One-time installation per device
```

### Use Cases

#### Web Version Best For:
- Quick access from anywhere
- No installation allowed (work computers, etc.)
- Cross-device usage
- Trying before installing
- Always want latest version
- Collaborative features (future)
- Lower storage requirements

#### Standalone Best For:
- Professional use
- Offline work
- Better performance needs
- Native OS integration
- Keyboard-driven workflow
- File organization
- Privacy/security concerns
- Dedicated screenwriting tool

### System Requirements

#### Web Version
- Any modern browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- ~50 MB RAM
- No disk space (except cache)

#### Standalone Version
- Windows 7+, macOS 10.11+, or Linux
- No internet required (after installation)
- ~200 MB RAM
- ~500 MB disk space

### Update Process

#### Web Version
1. Developer updates server
2. User refreshes page
3. New version loads automatically

#### Standalone Version
1. Developer releases new version
2. User downloads update (or auto-update)
3. User installs update
4. Restart application

### Cost Considerations

#### Web Version
- Hosting costs (server, bandwidth)
- Domain registration
- SSL certificate
- Ongoing maintenance
- Free for users

#### Standalone Version
- One-time build process
- Distribution hosting (GitHub releases, website)
- Code signing certificates (optional, ~$100-300/year)
- Free for users after distribution

## Migration Path

### From Web to Standalone
1. Download standalone installer
2. Install application
3. Keep using same features
4. Optional: Can still use web version

### From Standalone to Web
1. Open web version in browser
2. Upload/paste your work
3. Continue in browser

## Which Should You Use?

### Choose Web Version If:
- You need instant access without installation
- You work on multiple devices
- You want automatic updates
- Storage space is limited
- You're just trying it out

### Choose Standalone Version If:
- You want professional desktop software
- You need offline access
- You prefer native OS integration
- You want better performance
- You're a power user
- You need keyboard shortcuts
- You want to own your files

## Running Both

You can use both versions! They work with the same file formats:
1. Use standalone for main work
2. Use web for quick edits on the go
3. Export/import projects between them

---

## Recommendation

**Casual Users / Getting Started**: Web version
**Professional Writers / Daily Use**: Standalone version
**Best of Both**: Keep both options available!
