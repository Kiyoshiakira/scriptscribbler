# Script Scribbler - New Features Guide

This document describes the latest features added to Script Scribbler, available in both the web and standalone versions.

## Overview

Script Scribbler has been significantly enhanced with professional-grade features for screenwriters, including visual organization tools, character tracking, analytics, search capabilities, and project management.

## Core Features

### 📜 Script Editor
- Professional screenplay formatting with industry-standard blocks
- Scene Heading, Action, Character, Dialogue, and Parenthetical formats
- Real-time word and page count tracking
- Multi-scene management with easy navigation

### 📋 Notes System
- Organized note-taking with multiple types:
  - Character Notes (profiles, traits, goals, arcs)
  - World Notes (settings, rules, locations)
  - Object Notes (props, significance)
  - Plot Notes (structure, beats, details)
  - General Notes
- Color-coded notes for quick identification
- Searchable and filterable notes library

## New Features

### 🎬 Board View

Visual scene organization with a corkboard interface:

- **Grid Layout**: See all scenes at a glance with visual cards
- **Timeline View**: Linear organization for act structure
- **Drag-and-Drop**: Reorder scenes by dragging cards
- **Scene Cards Display**:
  - Scene number and act (I, II, III)
  - Scene heading/location
  - Description preview
  - Estimated duration and word count
- **Quick Navigation**: Click any scene card to jump to it in the script editor

**Usage**: Click the "🎬 Board" tab in the top navigation to access the board view.

### 👥 Characters View

Automatic character tracking and management:

- **Auto-Extraction**: Characters are automatically detected from your script
- **Character Cards**: Each character gets a visual card with:
  - Initials avatar
  - Character name
  - Scene count (how many scenes they appear in)
- **Real-time Updates**: Character list updates as you write

**Usage**: Click the "👥 Characters" tab to see all characters in your screenplay.

### 📊 Stats View

Professional screenplay analytics and metrics:

- **Key Metrics** (displayed in colorful cards):
  - Total Pages
  - Estimated Runtime (minutes)
  - Total Scenes
  - Total Words

- **Act Structure Visualization**:
  - Visual bar chart showing the three-act structure
  - Scene distribution across acts (Act I, II, III)
  - Interactive hover effects for better understanding

- **Detailed Character Analytics**:
  - Per-character dialogue line count
  - Per-character word count
  - Scene appearances for each character
  - Top 5 characters by dialogue volume

- **Location Tracking**:
  - Most frequently used locations/settings
  - Scene count per location
  - Helps identify recurring settings

- **Scene-by-Scene Breakdown**:
  - Word count analysis for each scene
  - Helps identify pacing issues
  - Spot scenes that may need expansion or trimming

- **Export Functionality**:
  - Export all statistics to CSV format
  - Includes overall stats, character analytics, location data, and scene breakdown
  - Perfect for sharing with collaborators or further analysis

- **Industry Standards**:
  - Page calculations (~250 words per page)
  - Runtime estimation (1 minute per page)

**Usage**: Click the "📊 Stats" tab to view your screenplay statistics. Use the "📥 Export Stats" button to download a comprehensive CSV report.

### 🔍 Advanced Search

Global project search across all content:

- **Search Scope**: Find text in scenes, notes, and character names
- **Filters**:
  - All (search everything)
  - Scenes only
  - Notes only
  - Characters only
- **Real-time Results**: See results as you type
- **Quick Navigation**: Click any result to jump directly to that content

**Usage**: 
1. Click the ⚙️ settings cog
2. Select "🔍 Search Project"
3. Type your search query
4. Use filters to narrow results
5. Click a result to navigate to it

### 📥 Project Import

Import previously exported projects:

- **Drag-and-Drop**: Simply drag a JSON file into the import zone
- **File Picker**: Or use the "Choose File" button
- **Imports**:
  - All scenes and script content
  - All notes with full details
  - Project structure and organization
- **Seamless Integration**: Imported content appears immediately

**Usage**:
1. Click ⚙️ settings
2. Select "📥 Import Project"
3. Drag a JSON file or click "Choose File"
4. Wait for "Project imported successfully!" notification

### 🚀 Enhanced Export

Flexible export options for your work:

- **Export Content Options**:
  - Full Project (Scenes + Notes)
  - Scenes Only
  - Notes Only

- **Export Formats**:
  - JSON (API Integration)
  - XML (Universal)
  - Fountain (Plain Text)
  - PDF (Presentation)

- **Integration Targets**:
  - Generic Platform
  - GitHub Repository
  - Google Drive
  - Dropbox
  - Slack Workspace
  - Discord Server

**Usage**:
1. Click ⚙️ settings
2. Select "🚀 Export & Integrate"
3. Choose export type (Collaborative, Production, Development, Sharing)
4. Select content type (Full, Scenes, or Notes)
5. Choose format and target
6. Click "Export & Integrate"

### 🎨 Theme Customization

Visual theme options for personalization:

- **Light Theme**: Clean, minimal white background
- **Default Theme**: Purple gradient (current default)
- **Dark Theme**: Dark mode for low-light environments

**Features**:
- Visual theme previews
- Instant theme switching
- Persistent theme selection

**Usage**:
1. Click ⚙️ settings
2. Select "🎨 Theme Settings"
3. Click on your preferred theme
4. Close the modal (theme applies immediately)

## Workflow Tips

### Efficient Screenplay Writing

1. **Start with Structure**: Use the Board view to plan your acts and scenes
2. **Write in Script View**: Focus on writing your screenplay with proper formatting
3. **Track Characters**: Check the Characters view to ensure balanced character usage
4. **Monitor Progress**: Use Stats view to track your page count and runtime
5. **Organize Ideas**: Keep character notes, world-building, and plot points in Notes
6. **Search Quickly**: Use global search to find any content instantly

### Project Management

1. **Regular Exports**: Export your full project regularly as backup
2. **Selective Exports**: Export just scenes or notes when sharing specific content
3. **Import Collaborations**: Import projects shared by collaborators
4. **Theme Comfort**: Switch themes based on your working environment

### Visual Organization

1. **Drag scenes** in Board view to restructure your screenplay
2. **Color-code notes** for quick visual identification
3. **Use character tracking** to ensure balanced screen time
4. **Monitor act distribution** using the automatic act labels in Board view

## Keyboard Shortcuts

- **New Project**: Ctrl/Cmd + N (Standalone only)
- **Open Project**: Ctrl/Cmd + O (Standalone only)
- **Save Project**: Ctrl/Cmd + S (Standalone only)
- **Quick Search**: Click ⚙️ → Search Project

## Technical Details

### File Format
Projects are saved as JSON files containing:
```json
{
  "metadata": {
    "title": "Project Title",
    "version": "1.0",
    "exportedAt": "ISO timestamp"
  },
  "scenes": [...],
  "notes": [...],
  "integration": {...}
}
```

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- All modern browsers with ES6 support

### Storage
- **Web Version**: LocalStorage for auto-save
- **Standalone Version**: File system save/load

## Future Enhancements

Planned features for upcoming releases:
- Collaboration features with real-time editing
- More export formats (Final Draft .fdx, Celtx)
- Template system for scenes and characters
- Advanced keyboard shortcuts customization
- Cloud sync/backup integration
- Enhanced dark theme with full UI adaptation
- Character relationship charts
- More detailed analytics

## Support

For questions, issues, or feature requests:
- Check the repository's Issues section
- Read the documentation files in `/standalone` and `/public`
- See BEGINNERS_GUIDE.md for basic usage
- See ARCHITECTURE.md for technical details

---

**Version**: 2.0  
**Last Updated**: 2025-10-14  
**Compatibility**: Web and Standalone versions
