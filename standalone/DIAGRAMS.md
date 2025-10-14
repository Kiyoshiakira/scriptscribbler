# Script Scribbler Architecture Diagram

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      SCRIPT SCRIBBLER                           │
│                    Standalone Application                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├──────────────────────────┐
                              │                          │
                              ▼                          ▼
                    ┌──────────────────┐      ┌──────────────────┐
                    │  Main Process    │      │ Renderer Process │
                    │   (Node.js)      │      │   (Chromium)     │
                    │   [main.js]      │      │  [index.html/js] │
                    └──────────────────┘      └──────────────────┘
                              │                          │
                              │◄────── IPC Bridge ──────►│
                              │      [preload.js]        │
                              │                          │
        ┌─────────────────────┼──────────────────────────┼─────────┐
        │                     │                          │         │
        ▼                     ▼                          ▼         ▼
  ┌──────────┐         ┌──────────┐              ┌──────────┐   ┌──────┐
  │  Menus   │         │   File   │              │    UI    │   │  V8  │
  │  Window  │         │  System  │              │ Render   │   │ JS   │
  │ Controls │         │   I/O    │              │  Engine  │   │Engine│
  └──────────┘         └──────────┘              └──────────┘   └──────┘
```

## Detailed Component Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        User Interface Layer                          │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  HTML/CSS/JavaScript (index.html, index.js, styles.css)   │     │
│  │  - Script Editor                                            │     │
│  │  - Notes System                                             │     │
│  │  - Scene Management                                         │     │
│  │  - Export Functions                                         │     │
│  └────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                       Electron Framework (C++)                       │
│  ┌────────────────────┐              ┌─────────────────────┐        │
│  │   Main Process     │              │  Renderer Process   │        │
│  │   (Background)     │◄───IPC───────►│   (Foreground)     │        │
│  │                    │              │                     │        │
│  │  - App lifecycle   │              │  - UI rendering     │        │
│  │  - Menus          │              │  - User interaction │        │
│  │  - File dialogs   │              │  - DOM manipulation │        │
│  │  - Window mgmt    │              │  - Event handling   │        │
│  └────────────────────┘              └─────────────────────┘        │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                   ┌──────────────┴──────────────┐
                   │                             │
                   ▼                             ▼
┌──────────────────────────────┐   ┌──────────────────────────────┐
│    Node.js Runtime (C++)     │   │   Chromium Engine (C++)      │
│                              │   │                              │
│  - File system access        │   │  - Blink rendering engine    │
│  - Process management        │   │  - V8 JavaScript engine      │
│  - Event loop (libuv)        │   │  - Skia graphics             │
│  - Buffer management         │   │  - GPU acceleration          │
│  - Crypto functions          │   │  - Web APIs                  │
│  - OS integration            │   │  - Security sandboxing       │
└──────────────────────────────┘   └──────────────────────────────┘
                   │                             │
                   └──────────────┬──────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    Operating System (C/C++)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │   Windows    │  │    macOS     │  │        Linux             │  │
│  │              │  │              │  │                          │  │
│  │  - Win32 API │  │  - Cocoa     │  │  - X11/Wayland          │  │
│  │  - DirectX   │  │  - Core Gfx  │  │  - GTK+                 │  │
│  │  - NTFS      │  │  - HFS+/APFS │  │  - ext4/btrfs           │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Saving a Project

```
User clicks "Save" (Ctrl+S)
        │
        ▼
JavaScript Event Handler (index.js)
        │
        ▼
Electron IPC Call (window.electronAPI.onSaveProject)
        │
        ▼
Preload Script (preload.js) - Security Bridge
        │
        ▼
Main Process (main.js)
        │
        ▼
Native Save Dialog (C++ - Chromium)
        │
        ▼
User selects location
        │
        ▼
Node.js File System (C++ - fs module)
        │
        ▼
Operating System File API (C++)
        │
        ▼
Physical Disk Write
        │
        ▼
Success notification to user
```

### Loading a Project

```
User clicks "Open" (Ctrl+O)
        │
        ▼
Main Process shows dialog (C++)
        │
        ▼
User selects file
        │
        ▼
Node.js reads file (C++)
        │
        ▼
Data sent via IPC
        │
        ▼
Preload script forwards data
        │
        ▼
Renderer receives data (JavaScript)
        │
        ▼
Parse JSON
        │
        ▼
Update UI (DOM manipulation via V8)
        │
        ▼
Chromium renders updated UI
        │
        ▼
User sees loaded project
```

## Security Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    Renderer Process                        │
│                      (Sandboxed)                           │
│  ┌──────────────────────────────────────────────────┐     │
│  │  JavaScript Code (index.js)                      │     │
│  │  - NO direct Node.js access                      │     │
│  │  - NO direct file system access                  │     │
│  │  - Can only use window.electronAPI               │     │
│  └──────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────┘
                         │
                         │ Limited, controlled access
                         │
                         ▼
┌────────────────────────────────────────────────────────────┐
│              Preload Script (preload.js)                   │
│                  (Security Bridge)                         │
│  - Exposes only specific, safe APIs                       │
│  - Validates all requests                                 │
│  - No arbitrary code execution                            │
└────────────────────────────────────────────────────────────┘
                         │
                         │ Validated IPC messages
                         │
                         ▼
┌────────────────────────────────────────────────────────────┐
│                    Main Process                            │
│                 (Full Privileges)                          │
│  - Full Node.js access                                    │
│  - Full file system access                                │
│  - Full OS integration                                    │
└────────────────────────────────────────────────────────────┘
```

## Process Memory Layout

```
┌────────────────────────────────────────┐
│       Script Scribbler Process         │
├────────────────────────────────────────┤
│  Main Process (Node.js)                │
│  - Memory: ~50-100 MB                  │
│  - Threads: 4-6                        │
│  - Handles: File, IPC, Events          │
├────────────────────────────────────────┤
│  Renderer Process (Chromium)           │
│  - Memory: ~100-200 MB                 │
│  - Threads: 8-12                       │
│  - Handles: DOM, Canvas, WebGL         │
├────────────────────────────────────────┤
│  GPU Process                           │
│  - Memory: ~20-50 MB                   │
│  - Threads: 2-4                        │
│  - Handles: Graphics acceleration      │
└────────────────────────────────────────┘

Total Memory Usage: ~200-400 MB
Total Disk Space: ~250 MB installed
```

## Build Process Flow

```
Source Files                    Build Tools                Output
     │                              │                         │
     │                              │                         │
     ▼                              ▼                         ▼
┌─────────┐                   ┌──────────┐            ┌────────────┐
│ JS/HTML │───────────────────│ electron │───────────►│ Windows    │
│  /CSS   │                   │ builder  │            │ .exe       │
└─────────┘                   └──────────┘            └────────────┘
     │                              │                         │
     │                              │                         ▼
     │                              │                  ┌────────────┐
     │                              ├─────────────────►│  macOS     │
     │                              │                  │  .dmg      │
     │                              │                  └────────────┘
     │                              │                         │
     │                              │                         ▼
     │                              │                  ┌────────────┐
     └──────────────────────────────┴─────────────────►│  Linux     │
                                                       │ .AppImage  │
                                                       └────────────┘
```

## Component Sizes

```
Chromium:    ~150 MB  ████████████████████████████
Node.js:     ~50 MB   ██████████
Application: ~1 MB    █
```

## Technology Stack Layers

```
┌────────────────────────────────────────────────┐  ─┐
│         JavaScript/HTML/CSS (App UI)           │   │ Application Layer
└────────────────────────────────────────────────┘   │ (What you write)
                     │                               │
┌────────────────────────────────────────────────┐   │
│         Electron Framework (C++)               │  ─┤ Framework Layer
└────────────────────────────────────────────────┘   │ (Glue between
                     │                               │  app and engine)
        ┌────────────┴────────────┐                  │
        │                         │                  │
┌───────▼──────┐         ┌────────▼────────┐        │
│  Node.js     │         │   Chromium      │       ─┤ Engine Layer
│   (C++)      │         │    (C++)        │        │ (Core functionality)
└──────────────┘         └─────────────────┘        │
        │                         │                  │
        └────────────┬────────────┘                  │
                     │                               │
┌────────────────────▼────────────────────────────┐  │
│         V8 JavaScript Engine (C++)             │  │
└────────────────────────────────────────────────┘  ─┤ Runtime Layer
                     │                               │ (Code execution)
┌────────────────────▼────────────────────────────┐  │
│         Operating System (C/C++)               │  │
└────────────────────────────────────────────────┘  ─┘ OS Layer
                     │
┌────────────────────▼────────────────────────────┐
│              Hardware (CPU/GPU/RAM)            │
└────────────────────────────────────────────────┘
```

## File Structure Map

```
standalone/
│
├── Entry Points
│   ├── main.js ──────────► Electron entry (C++ runtime)
│   ├── index.html ───────► UI entry (loaded by Chromium)
│   └── preload.js ───────► Security bridge
│
├── Application Code
│   ├── index.js ─────────► Application logic
│   └── styles.css ───────► Visual styling
│
├── Configuration
│   └── package.json ─────► Dependencies & build config
│
└── Documentation
    ├── README.md
    ├── INSTALLATION.md
    ├── ARCHITECTURE.md
    ├── QUICK_START.md
    ├── BEGINNERS_GUIDE.md
    └── WEB_VS_STANDALONE.md
```

---

**Key Takeaways:**

1. **UI is JavaScript**, but runs on **C++ foundation**
2. **Two processes**: Main (background) and Renderer (UI)
3. **Secure by design**: Sandboxed renderer, controlled IPC
4. **Native integration**: Full OS access through Electron
5. **Performance**: JIT compilation, GPU acceleration, multi-threading

