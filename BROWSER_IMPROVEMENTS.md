# Browser Version UI/UX Improvements

This document details the major usability and UI improvements implemented for the browser version of Script Scribbler.

## Table of Contents

1. [Script Editor Improvements](#script-editor-improvements)
2. [Sidebar Enhancements](#sidebar-enhancements)
3. [Notes System](#notes-system)
4. [Search Functionality](#search-functionality)
5. [Preferences & Settings](#preferences--settings)
6. [Keyboard Shortcuts](#keyboard-shortcuts)
7. [Responsive Design](#responsive-design)
8. [Accessibility](#accessibility)

## Script Editor Improvements

### Undo/Redo Support

Full undo/redo functionality has been implemented with a stack size of 50 actions.

**Usage:**
- **Undo**: Press `Ctrl+Z` (Windows/Linux) or `Cmd+Z` (Mac)
- **Redo**: Press `Ctrl+Shift+Z` or `Ctrl+Y` (Windows/Linux) or `Cmd+Shift+Z` (Mac)

The system automatically saves state when:
- Adding or removing scenes
- Editing script content
- Reordering scenes

### Visual Block Type Indicators

Each script block type now has distinct visual cues:

| Block Type | Border Color | Background | Icon |
|------------|-------------|------------|------|
| Scene Heading | Purple (#4f46e5) | Light gray gradient | 🎬 |
| Action | Green (#10b981) | Transparent | 📝 |
| Character | Orange (#f59e0b) | Light yellow (#fef3c7) | 👤 |
| Dialogue | Blue (#0ea5e9) | Light blue (#f0f9ff) | 💬 |
| Parenthetical | Pink (#ec4899) | Light pink (#fce7f3) | 📌 |

**Features:**
- Colored left border (3px)
- Emoji icons appear on hover
- Enhanced focus state with outline and shadow
- Smooth transitions on all interactions

### Enhanced Focus & Editing

When editing a block:
- Clear purple outline (2px)
- Soft shadow effect
- Thicker left border (4px)
- Background changes to light purple (#e0e7ff)

## Sidebar Enhancements

### Resizable Sidebar

The sidebar can now be resized by dragging the handle on its right edge.

**Usage:**
1. Hover over the right edge of the sidebar
2. Look for the resize handle indicator
3. Click and drag to resize
4. Constrained between 200px and 500px width

**Features:**
- Visual hover state (light purple highlight)
- Smooth cursor change to `col-resize`
- Width persists during session

### Drag-and-Drop Scene Reordering

Scenes can be reordered by dragging them in the sidebar.

**Usage:**
1. Click and hold the ⋮⋮ drag handle on any scene
2. Drag the scene up or down
3. Drop it in the desired position
4. Scene order updates automatically

**Visual Feedback:**
- Dragged scene becomes semi-transparent
- Target drop zone highlighted in purple
- Smooth animations during reordering

## Notes System

### Note Pinning

Important notes can be pinned to the top of the notes list.

**Usage:**
1. Navigate to the Notes tab
2. Hover over a note to reveal the pin button (📌)
3. Click to pin/unpin the note
4. Pinned notes always appear at the top

**Features:**
- Pinned notes have a special border
- Pin indicator (📌) displayed on pinned notes
- Sorted automatically (pinned first, then by date)

### Scene Linking

Notes can be linked to specific scenes for quick navigation.

**Usage:**
1. Open a note in the editor
2. Use the "Linked Scene" dropdown to select a scene
3. Click the "🔗 Jump" button to navigate to that scene
4. Automatically switches to Script tab and loads the scene

**Benefits:**
- Quick navigation from notes to related scenes
- Useful for character notes, plot points, or world-building linked to specific scenes
- No need to search for scene numbers

## Search Functionality

### Enhanced Search UI

The search feature now provides instant results with highlighting and keyboard navigation.

**Usage:**
1. Press `Ctrl+F` or `Cmd+F` to open search
2. Type your search query
3. Results appear instantly as you type
4. Use filters to narrow results (All/Scenes/Notes/Characters)

**Features:**
- **Highlighting**: Search terms highlighted in yellow
- **Context Preview**: Shows surrounding text for context
- **Keyboard Navigation**:
  - `↓` / `↑`: Navigate through results
  - `Enter`: Jump to selected result
- **Result Types**: Clearly labeled (Scene, Note, Character)

**Search Filters:**
- **All**: Search across everything
- **Scenes**: Search only script content
- **Notes**: Search only notes
- **Characters**: Search character names

## Preferences & Settings

### Preferences Modal

Access via `⚙️` → Preferences or press `Ctrl+,` / `Cmd+,`

**Settings Available:**

#### Editor Font Size
Choose from 4 sizes:
- Small (12px)
- Medium (14px) - Default
- Large (16px)
- Extra Large (18px)

#### Preferred Export Format
Set your default export format:
- JSON
- XML
- Fountain
- PDF

#### Auto-Save
Toggle automatic saving (enabled by default):
- Saves every 30 seconds
- Notification appears on auto-save
- Shows "Auto-saved" briefly

#### Theme
Select your preferred theme:
- Default (Purple gradient)
- Light (Clean white)
- Dark (Low-light mode)

**Persistence:**
All preferences are saved to localStorage and persist across sessions.

### Auto-Save & Recovery

**Auto-Save:**
- Triggers every 30 seconds when auto-save is enabled
- Saves to localStorage automatically
- Minimal notification to avoid distraction

**Recovery:**
- On page load, checks for auto-saved data
- Prompts user to restore if found
- Shows timestamp of saved data
- User can choose to restore or start fresh

## Keyboard Shortcuts

Complete list of keyboard shortcuts:

| Action | Windows/Linux | Mac |
|--------|--------------|-----|
| Undo | `Ctrl+Z` | `Cmd+Z` |
| Redo | `Ctrl+Shift+Z` or `Ctrl+Y` | `Cmd+Shift+Z` |
| Save | `Ctrl+S` | `Cmd+S` |
| Search | `Ctrl+F` | `Cmd+F` |
| Export | `Ctrl+E` | `Cmd+E` |
| Preferences | `Ctrl+,` | `Cmd+,` |
| Switch to Script | `Ctrl+1` | `Cmd+1` |
| Switch to Notes | `Ctrl+2` | `Cmd+2` |
| Switch to Board | `Ctrl+3` | `Cmd+3` |
| Switch to Characters | `Ctrl+4` | `Cmd+4` |
| Switch to Stats | `Ctrl+5` | `Cmd+5` |

**Editor-Specific:**
- `Tab`: Cycle through block types
- `Enter`: Create new block
- `↑` / `↓`: Navigate between blocks
- `Backspace` on empty block: Delete block

**Search-Specific:**
- `↑` / `↓`: Navigate search results
- `Enter`: Jump to selected result
- `Esc`: Close search modal

## Responsive Design

### Mobile Support (< 480px)

**Optimizations:**
- Reduced padding and margins
- Smaller font sizes for headers
- Adjusted script block margins for readability
- Stacked layout for all views
- Full-width modals
- Hidden emoji icons for cleaner look

**Script Block Margins (Mobile):**
- Character: 40px left
- Dialogue: 20px left/right
- Parenthetical: 30px left/right

### Tablet Support (480px - 768px)

**Optimizations:**
- Sidebar becomes full-width and moves below content
- Scene cards display in single column
- Top navigation scrolls horizontally if needed
- Adjusted script block margins

**Script Block Margins (Tablet):**
- Character: 80px left
- Dialogue: 40px left/right
- Parenthetical: 60px left/right

### Desktop (> 768px)

Full feature set with:
- Side-by-side sidebar and editor
- Resizable sidebar
- Multi-column layouts
- All visual indicators
- Full margins for script blocks

## Accessibility

### Focus Management

**Keyboard Navigation:**
- All interactive elements are keyboard accessible
- Tab order follows logical flow
- Clear focus indicators on all elements
- Consistent `outline: 2px solid #4f46e5` on focused items

### Visual Indicators

**Focus States:**
- 2px purple outline with 2px offset
- Applied to buttons, form inputs, scene items, notes
- `:focus-visible` pseudo-class for keyboard-only focus

**Color Contrast:**
- All text meets WCAG AA standards
- Block type colors chosen for readability
- High contrast between borders and backgrounds

### Screen Reader Support

**Semantic HTML:**
- Proper heading hierarchy
- ARIA labels where appropriate
- Descriptive button text
- Meaningful alt text

**Interactive Elements:**
- All clickable elements have descriptive titles
- Drag handles have title attributes
- Pin buttons show "Pin note" / "Unpin note"

## Tips & Best Practices

### Efficient Workflow

1. **Use Keyboard Shortcuts**: Learn the shortcuts for common actions
2. **Pin Important Notes**: Keep key information at the top
3. **Link Notes to Scenes**: Quickly reference character details or world-building
4. **Customize Font Size**: Adjust for comfort and readability
5. **Enable Auto-Save**: Never lose work again
6. **Search Frequently**: Find content quickly with `Ctrl+F`

### Organization

1. **Scene Ordering**: Drag scenes to restructure your script
2. **Note Categories**: Use different note types for better organization
3. **Color Coding**: Assign colors to notes for visual grouping
4. **Scene Linking**: Connect notes to relevant scenes

### Performance

1. **Undo Stack**: Limited to 50 actions to maintain performance
2. **Auto-Save**: Runs in background without blocking editing
3. **Search**: Optimized for instant results
4. **Animations**: Smooth 60fps transitions

## Technical Details

### Browser Compatibility

Tested and supported on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Storage

**localStorage Keys:**
- `scriptscribbler_autosave`: Auto-saved project data
- `scriptscribbler_preferences`: User preferences

### Data Structures

**Undo/Redo State:**
```javascript
{
  sceneScripts: [...],
  currentSceneIndex: 0,
  timestamp: 1234567890
}
```

**Preferences:**
```javascript
{
  theme: 'default',
  fontSize: 'medium',
  preferredExportFormat: 'json',
  autoSave: true
}
```

## Troubleshooting

### Auto-Save Not Working

1. Check preferences - ensure auto-save is enabled
2. Verify browser localStorage is not full
3. Check browser console for errors

### Keyboard Shortcuts Not Working

1. Ensure focus is not in a text input
2. Check for browser extension conflicts
3. Verify correct modifier key (Ctrl vs Cmd)

### Sidebar Not Resizing

1. Ensure screen width > 768px (not available on mobile)
2. Try clicking and holding the resize handle firmly
3. Check that drag started within the handle area

### Drag-and-Drop Scenes Not Working

1. Ensure you're clicking the ⋮⋮ drag handle
2. Verify browser supports drag and drop API
3. Try refreshing the page

## Future Enhancements

Planned improvements for future releases:

1. **Recent Projects List**: Quick access to recently opened projects
2. **Custom Keyboard Shortcuts**: User-definable shortcuts
3. **More Themes**: Additional color schemes and dark mode refinements
4. **Collaborative Features**: Real-time multi-user editing
5. **Advanced Search**: Regex support, replace functionality
6. **Export Templates**: Customizable export formats
7. **Backup/Sync**: Cloud backup integration

---

**Version**: 2.0
**Last Updated**: 2025-10-14
**Applies To**: Browser version only
