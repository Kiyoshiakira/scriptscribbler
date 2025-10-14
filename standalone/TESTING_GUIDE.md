# Testing Guide for Script Scribbler Standalone v2.0

This document provides a comprehensive testing checklist to verify all v2.0 UI/UX improvements work correctly in the standalone desktop application.

## Prerequisites

1. Install dependencies:
   ```bash
   cd standalone
   npm install
   ```

2. Run the application:
   ```bash
   npm start
   ```

## Testing Checklist

### ✅ Script Editor Enhancements

#### Undo/Redo System
- [ ] Create a new scene
- [ ] Add some script blocks
- [ ] Press `Ctrl+Z` (or `Cmd+Z` on Mac) - should undo last action
- [ ] Press `Ctrl+Shift+Z` (or `Cmd+Shift+Z` on Mac) - should redo
- [ ] Verify undo stack works for:
  - [ ] Adding blocks
  - [ ] Editing blocks
  - [ ] Deleting blocks
  - [ ] Reordering scenes
  - [ ] Adding/editing notes
- [ ] Verify redo stack clears when making a new change after undo

#### Visual Block Type Indicators
- [ ] Create blocks of each type:
  - [ ] Scene Heading - should have purple left border and 🎬 icon
  - [ ] Action - should have green left border and 📝 icon
  - [ ] Character - should have orange left border, yellow background, and 👤 icon
  - [ ] Dialogue - should have blue left border, light blue background, and 💬 icon
  - [ ] Parenthetical - should have pink left border, light pink background, and 📌 icon
- [ ] Hover over blocks - emoji icons should appear on the left
- [ ] Click into a block - should get purple outline and shadow effect
- [ ] Verify left border increases from 3px to 4px when focused

#### Enhanced Focus States
- [ ] Tab through blocks - should see clear purple focus outline
- [ ] Click into different blocks - focus should move smoothly
- [ ] Background should change to light purple (#e0e7ff) when focused

### ✅ Sidebar Enhancements

#### Resizable Sidebar
- [ ] Hover over the right edge of the sidebar - cursor should change to col-resize
- [ ] Drag the resize handle - sidebar should resize smoothly
- [ ] Try to resize smaller than 200px - should stop at minimum
- [ ] Try to resize larger than 500px - should stop at maximum
- [ ] Resize handle should show purple highlight on hover
- [ ] Vertical line indicator should appear in the handle

#### Drag-and-Drop Scene Reordering
- [ ] Create at least 3 scenes
- [ ] Look for ⋮⋮ drag handles on each scene item
- [ ] Click and hold a drag handle
- [ ] Drag the scene up or down
- [ ] While dragging:
  - [ ] Dragged scene should become semi-transparent
  - [ ] Target drop zone should highlight in purple
- [ ] Release to drop - scene order should update
- [ ] Scene list should rebuild with new order
- [ ] Current scene should remain selected

### ✅ Notes & Navigation

#### Note Pinning
- [ ] Switch to Notes tab
- [ ] Create several notes
- [ ] Hover over a note - 📌 pin button should appear in bottom-right
- [ ] Click pin button - note should move to top of list
- [ ] Pinned note should have purple border and shadow
- [ ] Pin another note - both should stay at top
- [ ] Unpin a note - should move back to regular list
- [ ] Pinned notes should show 📌 indicator in top-right

#### Scene Linking
- [ ] Open a note in the editor
- [ ] Find "Linked Scene (Optional)" dropdown
- [ ] Dropdown should list all scenes with their headings
- [ ] Select a scene from the dropdown
- [ ] Click the "🔗 Jump" button
- [ ] Should switch to Script tab
- [ ] Should load the linked scene
- [ ] Should show notification "Jumped to Scene X"

### ✅ Search Functionality

#### Enhanced Search UI
- [ ] Press `Ctrl+F` (or `Cmd+F` on Mac)
- [ ] Search modal should appear
- [ ] Type a search term
- [ ] Results should appear instantly as you type
- [ ] Search term should be highlighted in yellow in results
- [ ] Each result should show:
  - [ ] Type badge (Scene/Note/Character)
  - [ ] Title
  - [ ] Context preview

#### Search Filters
- [ ] Click "All" filter - should search everything
- [ ] Click "Scenes" filter - should only search script content
- [ ] Click "Notes" filter - should only search notes
- [ ] Click "Characters" filter - should only search character names
- [ ] Active filter should have purple background

#### Keyboard Navigation in Search
- [ ] Type a search term with multiple results
- [ ] Press ↓ arrow - should highlight next result
- [ ] Press ↑ arrow - should highlight previous result
- [ ] Press Enter on highlighted result - should jump to that item
- [ ] Press Esc - should close search modal

### ✅ Preferences & Settings

#### Preferences Modal
- [ ] Click ⚙️ gear icon → Preferences (or press `Ctrl+,` / `Cmd+,`)
- [ ] Preferences modal should appear

#### Font Size
- [ ] Change "Editor Font Size" to Small
- [ ] Script editor text should get smaller
- [ ] Change to Large - text should get bigger
- [ ] Change to Extra Large - text should be largest
- [ ] Change back to Medium
- [ ] Close and reopen app - setting should persist

#### Export Format
- [ ] Change "Preferred Export Format" to XML
- [ ] Setting should save
- [ ] Check if export uses this as default

#### Auto-Save
- [ ] Uncheck "Enable Auto-Save"
- [ ] Make some edits
- [ ] Wait 30+ seconds - should NOT see "Auto-saved" notification
- [ ] Re-check Auto-Save
- [ ] Make edits
- [ ] Wait 30+ seconds - should see "Auto-saved" notification

#### Theme
- [ ] Change Theme to "Light"
- [ ] Interface should switch to light theme
- [ ] Change to "Dark" - should switch to dark theme
- [ ] Change back to "Default" - should restore purple gradient

#### Preferences Footer
- [ ] Click "Reset to Defaults" - all settings should reset
- [ ] Click "Save & Close" - modal should close and settings persist

### ✅ Auto-Save & Recovery

#### Auto-Save
- [ ] Enable auto-save in preferences
- [ ] Make some edits to script or notes
- [ ] Wait 30 seconds
- [ ] Should see brief "Auto-saved" notification
- [ ] Check browser console - should see localStorage entry

#### Recovery
- [ ] Make some edits
- [ ] Wait for auto-save
- [ ] Close and reopen the application
- [ ] Should see recovery prompt with timestamp
- [ ] Click "Restore" - should load auto-saved data
- [ ] Or click "Start Fresh" - should start with clean slate

### ✅ Keyboard Shortcuts

#### Global Shortcuts
- [ ] `Ctrl+S` / `Cmd+S` - should trigger save (Electron dialog)
- [ ] `Ctrl+F` / `Cmd+F` - should open search modal
- [ ] `Ctrl+E` / `Cmd+E` - should open export modal
- [ ] `Ctrl+,` / `Cmd+,` - should open preferences

#### Tab Navigation
- [ ] `Ctrl+1` / `Cmd+1` - switch to Script tab
- [ ] `Ctrl+2` / `Cmd+2` - switch to Notes tab
- [ ] `Ctrl+3` / `Cmd+3` - switch to Board tab
- [ ] `Ctrl+4` / `Cmd+4` - switch to Characters tab
- [ ] `Ctrl+5` / `Cmd+5` - switch to Stats tab

#### Editor Navigation
- [ ] Tab - cycle through block types
- [ ] Enter - create new block
- [ ] ↑ arrow - move to previous block
- [ ] ↓ arrow - move to next block
- [ ] Backspace on empty block - delete block

### ✅ Accessibility

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] All buttons should be accessible
- [ ] All form inputs should be accessible
- [ ] Tab order should be logical

#### Focus Indicators
- [ ] All focused elements should have visible purple outline
- [ ] Outline should be 2px solid #4f46e5
- [ ] Outline offset should be 2px
- [ ] Focus indicators on:
  - [ ] Buttons
  - [ ] Form inputs
  - [ ] Scene items
  - [ ] Note items
  - [ ] Search results
  - [ ] Script blocks

#### Color Contrast
- [ ] Text should be readable on all backgrounds
- [ ] Block type colors should be distinguishable
- [ ] Focus states should be clearly visible

### ✅ Responsive Design

#### Window Resizing
- [ ] Resize window to very small width (< 768px)
- [ ] Sidebar should adapt (may stack or hide)
- [ ] Content should remain readable
- [ ] Resize to medium width (768-1024px)
- [ ] Resize to large width (> 1024px)
- [ ] All layouts should adapt smoothly

### ✅ Electron Integration

#### Native Menus
- [ ] File → New Project - should prompt to create new
- [ ] File → Save Project - should show native save dialog
- [ ] File → Open Project - should show native open dialog
- [ ] File → Export - should trigger export modal
- [ ] Edit menu shortcuts work
- [ ] View → Toggle Developer Tools - should open DevTools

#### File Operations
- [ ] Save a project via menu or Ctrl+S
- [ ] Native save dialog should appear
- [ ] Save file to disk
- [ ] Close and reopen app
- [ ] Load the saved project via File → Open
- [ ] Project should load correctly
- [ ] All scenes, notes, and settings should be restored

### ✅ Animations & Transitions

#### Smooth Animations
- [ ] Tab switching should have fade-in animation
- [ ] Hover effects should be smooth (0.2s transition)
- [ ] Drag-and-drop should have smooth transform
- [ ] Modal open/close should have opacity transition
- [ ] Focus states should transition smoothly

### ✅ Visual Polish

#### General UI
- [ ] All colors match the design (purple theme by default)
- [ ] Buttons have proper hover states
- [ ] Cards have proper shadows
- [ ] Borders are clean and consistent
- [ ] Spacing is consistent throughout

## Issues to Report

If you find any issues during testing, please report them with:

1. **Description**: What happened vs. what should happen
2. **Steps to Reproduce**: Exact steps to trigger the issue
3. **Environment**: OS version, Electron version, screen size
4. **Screenshots**: If visual issue
5. **Console Errors**: Check DevTools console for errors

## Success Criteria

All checkboxes should be checked (✅) for a successful v2.0 release. The standalone version should have feature parity with the browser version for all UI/UX improvements listed in issue #13.

## Notes

- Some features may behave slightly differently in Electron vs. browser (e.g., file dialogs are native)
- Auto-save uses localStorage which persists between sessions in Electron
- Keyboard shortcuts may vary between Windows/Linux and macOS (Ctrl vs. Cmd)
- Window resizing behavior may differ from browser responsive design
