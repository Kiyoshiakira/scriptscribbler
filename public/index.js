      // --- SCRITE-LIKE SCRIPT EDITOR LOGIC ---
        const SCRIPT_BLOCK_TYPES = [
            'action',
            'scene-heading',
            'character',
            'dialogue',
            'parenthetical'
        ];
        const PLACEHOLDERS = {
            'scene-heading': 'INT./EXT. LOCATION - TIME',
            'action': 'Describe the action...',
            'character': 'CHARACTER NAME',
            'dialogue': 'Character dialogue...',
            'parenthetical': '(direction)'
        };

        let editorEnabled = true; // Always enabled
        let currentSceneIndex = 0; // Track current scene
        let sceneScripts = []; // Array of scripts, one per scene
        
        // Undo/Redo system
        let undoStack = [];
        let redoStack = [];
        const MAX_UNDO_STACK = 50;
        
        // Auto-save system
        let autoSaveTimer = null;
        const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
        
        // Preferences
        let preferences = {
            theme: 'default',
            fontSize: 'medium',
            preferredExportFormat: 'json',
            autoSave: true
        };
        
        // Notes system variables
        let currentNote = 0;
        let currentFilter = 'all';
        let notes = [
            {
                title: "World Building",
                type: "world",
                color: "yellow",
                worldNoteName: "Modern-day Chicago",
                worldNoteDescription: "The story takes place in modern-day Chicago, focusing on the journalism industry.",
                worldNoteRules: "Realistic contemporary setting with emphasis on authentic journalism culture.",
                worldNoteReplacements: "'The Tribune' → 'The Herald', 'Starbucks' → 'JavaPoint'",
                worldNoteAdditional: "The city's diverse neighborhoods and rich cultural landscape provide the perfect backdrop for Sarah's journey of self-discovery.\n\nKey locations:\n- The Tribune building (where Marcus works)\n- Lincoln Park (where Sarah goes to think)\n- The small bookstore where Sarah works part-time\n- Sarah's cramped studio apartment in Wicker Park",
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
                title: "Character: Sarah Mitchell",
                type: "character",
                color: "blue",
                charNoteName: "Sarah Mitchell",
                charNoteRole: "Protagonist",
                charNoteTraits: "Determined, witty, empathetic, self-doubting",
                charNoteGoal: "To write a story that matters and find her authentic voice",
                charNoteArc: "From self-doubting writer to confident storyteller who learns to trust her instincts",
                charNoteAdditional: "Sarah is a 28-year-old aspiring journalist working at a small bookstore while chasing her dream. She has a mentor-student relationship with Marcus that evolves throughout the story. Her biggest fear is mediocrity and being forgotten.",
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                title: "Plot Structure",
                type: "plot",
                color: "green",
                plotNoteBeat: "Three-Act Structure",
                plotNoteSummary: "Classic three-act structure with strong character development arc",
                plotNoteDetails: "Act 1: Setup - Sarah's mundane life and desire for more\nAct 2: Confrontation - She pursues a big story and faces obstacles\nAct 3: Resolution - Sarah finds her voice and completes her story\n\nKey beats:\n- Inciting Incident: Sarah discovers a lead on an important story\n- First Plot Point: Decides to pursue it despite risks\n- Midpoint: Major revelation changes everything\n- Dark Night: Almost gives up\n- Climax: Completes and publishes the story",
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];

        // Initialize preferences from localStorage
        function loadPreferences() {
            const saved = localStorage.getItem('scriptscribbler_preferences');
            if (saved) {
                try {
                    preferences = {...preferences, ...JSON.parse(saved)};
                    applyPreferences();
                } catch (e) {
                    console.error('Error loading preferences:', e);
                }
            }
        }

        function savePreferences() {
            localStorage.setItem('scriptscribbler_preferences', JSON.stringify(preferences));
            applyPreferences();
        }

        function applyPreferences() {
            // Apply theme
            document.body.setAttribute('data-theme', preferences.theme);
            
            // Apply font size
            const editor = document.getElementById('scriptEditor');
            if (editor) {
                editor.setAttribute('data-font-size', preferences.fontSize);
            }
        }

        // Undo/Redo system
        function saveStateToUndo() {
            const state = {
                sceneScripts: JSON.parse(JSON.stringify(sceneScripts)),
                currentSceneIndex: currentSceneIndex,
                timestamp: Date.now()
            };
            
            undoStack.push(state);
            if (undoStack.length > MAX_UNDO_STACK) {
                undoStack.shift();
            }
            
            // Clear redo stack when new action is performed
            redoStack = [];
        }

        function performUndo() {
            if (undoStack.length === 0) {
                showNotification('Nothing to undo', true);
                return;
            }
            
            // Save current state to redo stack
            const currentState = {
                sceneScripts: JSON.parse(JSON.stringify(sceneScripts)),
                currentSceneIndex: currentSceneIndex,
                timestamp: Date.now()
            };
            redoStack.push(currentState);
            
            // Restore previous state
            const prevState = undoStack.pop();
            sceneScripts = prevState.sceneScripts;
            currentSceneIndex = prevState.currentSceneIndex;
            
            // Reload editor and sidebar
            loadSceneIntoEditor(currentSceneIndex);
            rebuildSceneList();
            updateStats();
            showNotification('Undo successful');
        }

        function performRedo() {
            if (redoStack.length === 0) {
                showNotification('Nothing to redo', true);
                return;
            }
            
            // Save current state to undo stack
            const currentState = {
                sceneScripts: JSON.parse(JSON.stringify(sceneScripts)),
                currentSceneIndex: currentSceneIndex,
                timestamp: Date.now()
            };
            undoStack.push(currentState);
            
            // Restore next state
            const nextState = redoStack.pop();
            sceneScripts = nextState.sceneScripts;
            currentSceneIndex = nextState.currentSceneIndex;
            
            // Reload editor and sidebar
            loadSceneIntoEditor(currentSceneIndex);
            rebuildSceneList();
            updateStats();
            showNotification('Redo successful');
        }

        // Auto-save functionality
        function triggerAutoSave() {
            if (!preferences.autoSave) return;
            
            if (autoSaveTimer) {
                clearTimeout(autoSaveTimer);
            }
            
            autoSaveTimer = setTimeout(() => {
                saveToLocalStorage();
                showNotification('Auto-saved', false, 1000);
            }, AUTO_SAVE_INTERVAL);
        }

        function saveToLocalStorage() {
            try {
                const projectData = {
                    sceneScripts: sceneScripts,
                    notes: notes,
                    currentSceneIndex: currentSceneIndex,
                    savedAt: new Date().toISOString()
                };
                localStorage.setItem('scriptscribbler_autosave', JSON.stringify(projectData));
            } catch (e) {
                console.error('Error auto-saving:', e);
            }
        }

        function loadFromLocalStorage() {
            try {
                const saved = localStorage.getItem('scriptscribbler_autosave');
                if (saved) {
                    const data = JSON.parse(saved);
                    if (confirm('Found auto-saved project from ' + new Date(data.savedAt).toLocaleString() + '. Do you want to restore it?')) {
                        sceneScripts = data.sceneScripts || [];
                        notes = data.notes || [];
                        currentSceneIndex = data.currentSceneIndex || 0;
                        return true;
                    }
                }
            } catch (e) {
                console.error('Error loading auto-save:', e);
            }
            return false;
        }

        function enableTestEditor() {
            // No longer needed - editor is always enabled
            // Kept for backward compatibility
            showNotification('Editor is already enabled!');
        }

        function createScriptEditorBlock(type = 'action', text = '') {
            const div = document.createElement('div');
            div.className = `script-editor-block ${type}`;
            div.setAttribute('data-type', type);
            div.setAttribute('contenteditable', 'true');
            div.setAttribute('data-placeholder', PLACEHOLDERS[type] || '');
            if (!text) div.classList.add('placeholder');
            div.innerText = text || '';
            // Event handlers
            div.addEventListener('keydown', handleScriptEditorKeyDown);
            div.addEventListener('focus', function() {
                setFormatDropdownToBlock(this);
            });
            div.addEventListener('input', function() {
                if (div.textContent.trim() === '') {
                    div.classList.add('placeholder');
                } else {
                    div.classList.remove('placeholder');
                }
                applySmartFormatting(this);
                updateStats();
                triggerAutoSave();
            });
            div.addEventListener('click', function() {
                setFormatDropdownToBlock(this);
            });
            return div;
        }

        function initScriptEditor() {
            const editor = document.getElementById('scriptEditor');
            if (!editor) return;
            
            // Initialize scene scripts if empty
            if (sceneScripts.length === 0) {
                // Create initial script for Scene 1
                sceneScripts.push([
                    {type: 'scene-heading', text: 'INT. COFFEE SHOP - DAY'},
                    {type: 'action', text: 'SARAH, a young writer in her twenties, sits at a corner table typing furiously on her laptop. Steam rises from her untouched coffee.'},
                    {type: 'character', text: 'SARAH'},
                    {type: 'dialogue', text: "This story isn't working. I need something more... authentic."},
                    {type: 'action', text: "She stares at the screen, frustrated. The cursor blinks mockingly at the end of an incomplete sentence."}
                ]);
                // Create initial script for Scene 2
                sceneScripts.push([
                    {type: 'scene-heading', text: "EXT. PARK - AFTERNOON"},
                    {type: 'action', text: "Sarah walks through the park, phone pressed to her ear. She looks determined but nervous."},
                    {type: 'character', text: "SARAH"},
                    {type: 'dialogue', text: "Marcus, I know this sounds crazy, but I think I found our story."}
                ]);
            }
            
            // Load the current scene
            loadSceneIntoEditor(currentSceneIndex);
        }
        
        function loadSceneIntoEditor(sceneIndex) {
            const editor = document.getElementById('scriptEditor');
            if (!editor) return;
            
            // Save current scene before switching (but only if we have actual content loaded)
            if (currentSceneIndex !== sceneIndex && editor.children.length > 0) {
                saveCurrentSceneFromEditor();
            }
            
            currentSceneIndex = sceneIndex;
            editor.innerHTML = '';
            
            // Load blocks for the selected scene
            const sceneBlocks = sceneScripts[sceneIndex] || [];
            for (const block of sceneBlocks) {
                editor.appendChild(createScriptEditorBlock(block.type, block.text));
            }
            
            // Always have one empty block at the end if needed
            if (sceneBlocks.length === 0 || sceneBlocks[sceneBlocks.length - 1].text !== '') {
                editor.appendChild(createScriptEditorBlock('action', ''));
            }
            
            setTimeout(() => {
                const first = editor.querySelector('.script-editor-block');
                if (first) first.focus();
            }, 50);
            updateStats();
        }
        
        function saveCurrentSceneFromEditor() {
            const editor = document.getElementById('scriptEditor');
            const blocks = editor.querySelectorAll('.script-editor-block');
            const sceneData = [];
            
            blocks.forEach(block => {
                const type = getBlockType(block);
                const text = block.textContent.trim();
                if (text || type === 'action') { // Save even empty action blocks
                    sceneData.push({type, text});
                }
            });
            
            sceneScripts[currentSceneIndex] = sceneData;
        }

        function setFormatDropdownToBlock(block) {
            const type = getBlockType(block);
            document.getElementById('formatSelect').value = type;
        }

        function changeBlockTypeDropdown() {
            const select = document.getElementById('formatSelect');
            const editor = document.getElementById('scriptEditor');
            const block = document.activeElement;
            if (!block || !block.classList || !block.classList.contains('script-editor-block')) return;
            
            const oldType = getBlockType(block);
            const newType = select.value;
            
            // Change class
            SCRIPT_BLOCK_TYPES.forEach(t => block.classList.remove(t));
            block.classList.add(newType);
            block.setAttribute('data-type', newType);
            block.setAttribute('data-placeholder', PLACEHOLDERS[newType] || '');
            
            // Apply smart formatting for the new type
            applySmartFormattingForType(block, newType);
            
            // Update placeholder status
            if (block.textContent.trim() === '') block.classList.add('placeholder');
            else block.classList.remove('placeholder');
            block.focus();
            updateStats();
        }

        function handleScriptEditorKeyDown(e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                cycleBlockType(this);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                splitOrInsertBlock(this);
            } else if (e.key === 'ArrowUp') {
                // Move to previous block
                const prev = this.previousElementSibling;
                if (prev && prev.classList.contains('script-editor-block')) {
                    prev.focus();
                    placeCaretAtEnd(prev);
                }
            } else if (e.key === 'ArrowDown') {
                // Move to next block
                const next = this.nextElementSibling;
                if (next && next.classList.contains('script-editor-block')) {
                    next.focus();
                    placeCaretAtEnd(next);
                }
            } else if (e.key === 'Backspace' && this.textContent.trim() === '') {
                // If empty, remove block (but keep at least one)
                const editor = document.getElementById('scriptEditor');
                if (editor.children.length > 1) {
                    const prev = this.previousElementSibling;
                    this.remove();
                    if (prev && prev.classList.contains('script-editor-block')) {
                        prev.focus();
                        placeCaretAtEnd(prev);
                    }
                    updateStats();
                }
            }
        }

        function placeCaretAtEnd(el) {
            const range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }

        function getBlockType(block) {
            if (!block || !block.classList) return 'action';
            for (const type of SCRIPT_BLOCK_TYPES) {
                if (block.classList.contains(type)) return type;
            }
            return 'action';
        }

        function cycleBlockType(block) {
            const curr = getBlockType(block);
            const idx = SCRIPT_BLOCK_TYPES.indexOf(curr);
            const nextIdx = (idx + 1) % SCRIPT_BLOCK_TYPES.length;
            SCRIPT_BLOCK_TYPES.forEach(t => block.classList.remove(t));
            block.classList.add(SCRIPT_BLOCK_TYPES[nextIdx]);
            block.setAttribute('data-type', SCRIPT_BLOCK_TYPES[nextIdx]);
            block.setAttribute('data-placeholder', PLACEHOLDERS[SCRIPT_BLOCK_TYPES[nextIdx]] || '');
            setFormatDropdownToBlock(block);
            if (block.textContent.trim() === '') block.classList.add('placeholder');
            else block.classList.remove('placeholder');
            updateStats();
        }

        function splitOrInsertBlock(block) {
            const text = block.textContent;
            const sel = window.getSelection();
            const caretPos = sel.focusOffset;
            // Split at caret if not at end
            let before = text, after = '';
            if (caretPos !== undefined && caretPos < text.length) {
                before = text.slice(0, caretPos);
                after = text.slice(caretPos);
            }
            block.textContent = before;
            if (before.trim() === '') block.classList.add('placeholder');
            else block.classList.remove('placeholder');

            // Default next block type
            let nextType = 'action';
            const currType = getBlockType(block);
            if (currType === 'scene-heading') nextType = 'action';
            else if (currType === 'action') nextType = 'character';
            else if (currType === 'character') nextType = 'dialogue';
            else if (currType === 'dialogue') nextType = 'action';
            else if (currType === 'parenthetical') nextType = 'dialogue';

            // If after text exists, new block same type
            if (after.trim() !== '') nextType = currType;
            const newBlock = createScriptEditorBlock(nextType, after);
            block.parentNode.insertBefore(newBlock, block.nextSibling);
            newBlock.focus();
            placeCaretAtEnd(newBlock);
            
            // Scroll the new block into view
            newBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            updateStats();
        }

        function applySmartFormatting(block) {
            const text = block.textContent;
            const type = getBlockType(block);
            applySmartFormattingForType(block, type);
        }
        
        function applySmartFormattingForType(block, type) {
            const text = block.textContent;
            
            if (type === 'character') {
                // Character: auto-uppercase, caret at end
                const upperText = text.toUpperCase();
                if (text !== upperText) {
                    block.textContent = upperText;
                    placeCaretAtEnd(block);
                }
            } else if (type === 'parenthetical') {
                // Parenthetical: auto-insert '(' if not present, caret after '('
                const trimmed = text.trim();
                if (trimmed && !trimmed.startsWith('(')) {
                    block.textContent = '(' + trimmed;
                    // Place caret after the opening parenthesis
                    const range = document.createRange();
                    const sel = window.getSelection();
                    if (block.firstChild) {
                        range.setStart(block.firstChild, 1);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
            } else if (type === 'scene-heading') {
                // Scene Heading: auto-uppercase
                const upperText = text.toUpperCase();
                if (text !== upperText) {
                    // Save caret position
                    const sel = window.getSelection();
                    const caretPos = sel.focusOffset;
                    block.textContent = upperText;
                    // Restore caret position
                    if (block.firstChild) {
                        const range = document.createRange();
                        range.setStart(block.firstChild, Math.min(caretPos, upperText.length));
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
            }
            // For action and dialogue, no special formatting needed
        }

        // Statistics
        function updateStats() {
            const editor = document.getElementById('scriptEditor');
            const blocks = editor.querySelectorAll('.script-editor-block');
            let totalWords = 0;
            blocks.forEach(block => {
                const text = block.textContent.trim();
                if (!text) return;
                const words = text.split(/\s+/).length;
                totalWords += words;
            });
            const totalPages = Math.max(1, Math.ceil(totalWords / 250));
            document.getElementById('wordCount').textContent = `${totalWords} words`;
            document.getElementById('pageCount').textContent = `${totalPages} pages`;
        }

        // Export Modal and Notification logic (unchanged except for using block-based export)
        // ... (Export logic remains from previous file, but you would need to update collectScriptData to use script-editor-blocks) ...

        // Quick Integration, Scenes, and Export Modal logic (updated for multi-scene support)
        function selectScene(index) {
            document.querySelectorAll('.scene-item').forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
            loadSceneIntoEditor(index);
        }

        function deleteScene(index, event) {
            // Prevent scene selection when clicking delete
            if (event) {
                event.stopPropagation();
            }
            
            // Don't allow deleting if only one scene remains
            if (sceneScripts.length <= 1) {
                showNotification('Cannot delete the last scene', true);
                return;
            }
            
            // Save current scene before deleting
            saveCurrentSceneFromEditor();
            
            // Remove the scene from the scripts array
            sceneScripts.splice(index, 1);
            
            // Adjust current scene index if needed
            if (index < currentSceneIndex) {
                // Deleted scene is before current, shift index down
                currentSceneIndex--;
            } else if (index === currentSceneIndex) {
                // Deleted the current scene
                if (currentSceneIndex >= sceneScripts.length) {
                    // Was the last scene, move to new last scene
                    currentSceneIndex = sceneScripts.length - 1;
                }
                // Otherwise stay at same index (which is now a different scene)
            }
            
            // Rebuild the scene list UI
            rebuildSceneList();
            
            // Load the adjusted current scene
            loadSceneIntoEditor(currentSceneIndex);
            
            showNotification('Scene deleted successfully');
        }

        function rebuildSceneList() {
            const sceneList = document.getElementById('sceneList');
            sceneList.innerHTML = '';
            
            // Add all scenes with delete buttons and drag functionality
            sceneScripts.forEach((_, index) => {
                const sceneItem = document.createElement('div');
                sceneItem.className = 'scene-item';
                sceneItem.setAttribute('draggable', 'true');
                sceneItem.setAttribute('data-scene-index', index);
                if (index === currentSceneIndex) {
                    sceneItem.classList.add('active');
                }
                
                // Get scene heading from first block if available
                const sceneHeading = sceneScripts[index].find(block => block.type === 'scene-heading');
                const locationText = sceneHeading ? sceneHeading.text : 'INT./EXT. LOCATION - TIME';
                
                sceneItem.innerHTML = `
                    <div class="scene-drag-handle">⋮⋮</div>
                    <div class="scene-content">
                        <div class="scene-title">Scene ${index + 1}</div>
                        <div class="scene-location">${locationText}</div>
                    </div>
                    ${sceneScripts.length > 1 ? `<button class="scene-delete-btn" onclick="deleteScene(${index}, event)" title="Delete scene">×</button>` : ''}
                `;
                
                // Drag and drop event listeners
                sceneItem.addEventListener('dragstart', handleSceneDragStart);
                sceneItem.addEventListener('dragover', handleSceneDragOver);
                sceneItem.addEventListener('drop', handleSceneDrop);
                sceneItem.addEventListener('dragend', handleSceneDragEnd);
                sceneItem.addEventListener('dragleave', handleSceneDragLeave);
                
                sceneItem.onclick = (e) => {
                    // Don't trigger click if clicking drag handle or delete button
                    if (e.target.classList.contains('scene-drag-handle') || 
                        e.target.classList.contains('scene-delete-btn')) {
                        return;
                    }
                    selectScene(index);
                };
                sceneList.appendChild(sceneItem);
            });
        }

        // Scene drag and drop handlers
        let draggedSceneIndex = null;

        function handleSceneDragStart(e) {
            draggedSceneIndex = parseInt(this.getAttribute('data-scene-index'));
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);
        }

        function handleSceneDragOver(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.dataTransfer.dropEffect = 'move';
            
            const targetIndex = parseInt(this.getAttribute('data-scene-index'));
            if (draggedSceneIndex !== null && draggedSceneIndex !== targetIndex) {
                this.classList.add('drag-over');
            }
            return false;
        }

        function handleSceneDragLeave(e) {
            this.classList.remove('drag-over');
        }

        function handleSceneDrop(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            
            const targetIndex = parseInt(this.getAttribute('data-scene-index'));
            
            if (draggedSceneIndex !== null && draggedSceneIndex !== targetIndex) {
                // Save current scene before reordering
                saveCurrentSceneFromEditor();
                
                // Reorder scenes
                const draggedScene = sceneScripts.splice(draggedSceneIndex, 1)[0];
                sceneScripts.splice(targetIndex, 0, draggedScene);
                
                // Update current scene index if needed
                if (currentSceneIndex === draggedSceneIndex) {
                    currentSceneIndex = targetIndex;
                } else if (draggedSceneIndex < currentSceneIndex && targetIndex >= currentSceneIndex) {
                    currentSceneIndex--;
                } else if (draggedSceneIndex > currentSceneIndex && targetIndex <= currentSceneIndex) {
                    currentSceneIndex++;
                }
                
                // Rebuild the scene list
                rebuildSceneList();
                
                // Reload current scene
                loadSceneIntoEditor(currentSceneIndex);
                
                showNotification('Scene order updated');
                triggerAutoSave();
            }
            
            this.classList.remove('drag-over');
            return false;
        }

        function handleSceneDragEnd(e) {
            this.classList.remove('dragging');
            document.querySelectorAll('.scene-item').forEach(item => {
                item.classList.remove('drag-over');
            });
            draggedSceneIndex = null;
        }

        function addNewScene() {
            const sceneList = document.getElementById('sceneList');
            const sceneNumber = sceneList.children.length + 1;
            const newScene = document.createElement('div');
            newScene.className = 'scene-item';
            newScene.innerHTML = `<div class="scene-title">Scene ${sceneNumber}</div><div class="scene-location">INT./EXT. LOCATION - TIME</div>`;
            newScene.onclick = () => selectScene(sceneNumber - 1);
            sceneList.appendChild(newScene);

            // Create a new blank script for this scene with starter blocks
            sceneScripts.push([
                {type: 'scene-heading', text: 'INT./EXT. LOCATION - TIME'},
                {type: 'action', text: ''}
            ]);
            
            // Switch to the new scene
            selectScene(sceneNumber - 1);
            
            // Rebuild to add delete buttons
            rebuildSceneList();
            
            showNotification('New scene added!');
        }

        // Quick Integration, Scenes, and Export Modal logic (updated for multi-scene support)

        // Export modal and notification UI (unchanged)
        function showNotification(message, isError = false, duration = 3000) {
            const notification = document.getElementById('statusNotification');
            const statusText = document.getElementById('statusText');
            statusText.textContent = message;
            notification.className = `status-notification show ${isError ? 'error' : ''}`;
            setTimeout(() => {
                notification.classList.remove('show');
            }, duration);
        }

        function quickIntegration(type) {
            const integrationMessages = {
                film: 'Script formatted for film production workflow',
                game: 'Script prepared for game development integration',
                animation: 'Script optimized for animation pipeline',
                audio: 'Script formatted for audio production'
            };
            showNotification(integrationMessages[type]);
            setTimeout(() => {
                openExportModal();
                selectExportType('collaborative');
            }, 1000);
        }

        // Export modal logic (slightly updated export to use new blocks)
        let selectedExportType = null;
        function openExportModal() {
            const modal = document.getElementById('exportModal');
            modal.classList.add('show');
        }

        function closeExportModal() {
            const modal = document.getElementById('exportModal');
            modal.classList.remove('show');
            selectedExportType = null;
            document.querySelectorAll('.export-option').forEach(option => {
                option.classList.remove('selected');
            });
        }

        function selectExportType(type) {
            selectedExportType = type;
            document.querySelectorAll('.export-option').forEach(option => {
                option.classList.remove('selected');
            });
            document.querySelector(`[data-type="${type}"]`).classList.add('selected');
        }

        function performExport() {
            if (!selectedExportType) {
                showNotification('Please select an export type', true);
                return;
            }
            const projectTitle = document.getElementById('projectTitle').value;
            const exportFormat = document.getElementById('exportFormat').value;
            const exportContent = document.getElementById('exportContent').value;
            const integrationTarget = document.getElementById('integrationTarget').value;
            
            let exportData = {};
            
            // Build export data based on content selection
            if (exportContent === 'full' || exportContent === 'scenes') {
                const scriptData = collectScriptDataFromBlocks();
                exportData.scenes = sceneScripts;
                exportData.script = scriptData;
            }
            
            if (exportContent === 'full' || exportContent === 'notes') {
                exportData.notes = notes;
            }
            
            const exportPackage = {
                metadata: {
                    title: projectTitle,
                    exportType: selectedExportType,
                    format: exportFormat,
                    content: exportContent,
                    target: integrationTarget,
                    exportedAt: new Date().toISOString(),
                    version: "1.0"
                },
                ...exportData,
                integration: {
                    apiEndpoint: generateAPIEndpoint(),
                    webhookUrl: generateWebhookUrl(),
                    collaborationId: generateCollaborationId()
                }
            };
            showNotification('Preparing export...');
            setTimeout(() => {
                downloadExport(exportPackage, exportFormat);
                showNotification(`Successfully exported ${exportContent} for ${integrationTarget}!`);
                closeExportModal();
            }, 2000);
        }

        function collectScriptDataFromBlocks() {
            // Save current scene first
            saveCurrentSceneFromEditor();
            
            // Collect all scenes
            const allScenes = [];
            sceneScripts.forEach((sceneBlocks, sceneIndex) => {
                const sceneLines = [];
                sceneBlocks.forEach(block => {
                    if (block.text) {
                        sceneLines.push({
                            format: block.type,
                            content: block.text
                        });
                    }
                });
                allScenes.push({
                    sceneNumber: sceneIndex + 1,
                    lines: sceneLines
                });
            });
            
            // Calculate total statistics
            let totalWords = 0;
            allScenes.forEach(scene => {
                scene.lines.forEach(line => {
                    totalWords += line.content.split(/\s+/).length;
                });
            });
            
            return {
                scenes: allScenes,
                lines: allScenes.flatMap(scene => scene.lines),
                statistics: {
                    words: totalWords,
                    pages: Math.max(1, Math.ceil(totalWords / 250))
                }
            };
        }

        function generateAPIEndpoint() {
            return `https://api.scriptscribbler.app/v1/projects/${Math.random().toString(36).substr(2, 9)}`;
        }
        function generateWebhookUrl() {
            return `https://hooks.scriptscribbler.app/collaboration/${Math.random().toString(36).substr(2, 12)}`;
        }
        function generateCollaborationId() {
            return Math.random().toString(36).substr(2, 16);
        }

        function downloadExport(data, format) {
            let content, filename, mimeType;
            switch (format) {
                case 'json':
                    content = JSON.stringify(data, null, 2);
                    filename = `${data.metadata.title.replace(/\s+/g, '_')}.json`;
                    mimeType = 'application/json';
                    break;
                case 'xml':
                    content = convertToXML(data);
                    filename = `${data.metadata.title.replace(/\s+/g, '_')}.xml`;
                    mimeType = 'application/xml';
                    break;
                case 'fountain':
                    content = convertToFountain(data.script);
                    filename = `${data.metadata.title.replace(/\s+/g, '_')}.fountain`;
                    mimeType = 'text/plain';
                    break;
                case 'pdf':
                    content = convertToText(data.script);
                    filename = `${data.metadata.title.replace(/\s+/g, '_')}.txt`;
                    mimeType = 'text/plain';
                    break;
            }
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function convertToXML(data) {
            return '<?xml version="1.0" encoding="UTF-8"?>\n<screenplay>\n    <metadata>\n        <title>' + data.metadata.title + '</title>\n        <exportType>' + data.metadata.exportType + '</exportType>\n        <exportedAt>' + data.metadata.exportedAt + '</exportedAt>\n    </metadata>\n    <script>\n        ' + data.script.lines.map(line => '<line format="' + line.format + '">' + escapeXML(line.content) + '</line>').join('\n        ') + '\n    </script>\n    <integration>\n        <apiEndpoint>' + data.integration.apiEndpoint + '</apiEndpoint>\n        <webhookUrl>' + data.integration.webhookUrl + '</webhookUrl>\n        <collaborationId>' + data.integration.collaborationId + '</collaborationId>\n    </integration>\n</screenplay>';
        }

        function convertToFountain(script) {
            return script.lines.map(line => {
                switch (line.format) {
                    case 'scene-heading':
                        return line.content.toUpperCase();
                    case 'character':
                        return line.content.toUpperCase();
                    case 'dialogue':
                        return line.content;
                    case 'parenthetical':
                        return `(${line.content})`;
                    case 'action':
                        return line.content;
                    default:
                        return line.content;
                }
            }).join('\n\n');
        }

        function convertToText(script) {
            return script.lines.map(line => {
                const prefix = {
                    'scene-heading': '',
                    'character': '                    ',
                    'dialogue': '          ',
                    'parenthetical': '                ',
                    'action': ''
                }[line.format] || '';
                return prefix + line.content;
            }).join('\n\n');
        }

        function escapeXML(text) {
            return text.replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/"/g, '&quot;')
                      .replace(/'/g, '&#39;');
        }

        // Initialize script editor enabled by default
        document.addEventListener('DOMContentLoaded', function() {
            const editor = document.getElementById('scriptEditor');
            const formatSelect = document.getElementById('formatSelect');
            
            // Load preferences
            loadPreferences();
            
            // Try to load auto-saved data
            const restored = loadFromLocalStorage();
            
            // Enable format dropdown
            formatSelect.disabled = false;
            
            // Initialize the script editor with scene content
            initScriptEditor();
            
            // Rebuild scene list to add delete buttons
            rebuildSceneList();
            
            // Initialize notes view
            updateNotesList();
            if (notes.length > 0) {
                loadNoteDetails(0);
            }
            
            // Initialize keyboard shortcuts
            initKeyboardShortcuts();
            
            // Initialize sidebar resizing
            initSidebarResize();
        });

        // Keyboard shortcuts
        function initKeyboardShortcuts() {
            document.addEventListener('keydown', function(e) {
                const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
                const ctrlKey = isMac ? e.metaKey : e.ctrlKey;
                
                // Ctrl/Cmd + Z: Undo
                if (ctrlKey && e.key === 'z' && !e.shiftKey) {
                    e.preventDefault();
                    performUndo();
                }
                
                // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y: Redo
                else if ((ctrlKey && e.shiftKey && e.key === 'z') || (ctrlKey && e.key === 'y')) {
                    e.preventDefault();
                    performRedo();
                }
                
                // Ctrl/Cmd + S: Manual save
                else if (ctrlKey && e.key === 's') {
                    e.preventDefault();
                    saveToLocalStorage();
                    showNotification('Project saved!');
                }
                
                // Ctrl/Cmd + F: Search
                else if (ctrlKey && e.key === 'f') {
                    e.preventDefault();
                    openSearchModal();
                }
                
                // Ctrl/Cmd + E: Export
                else if (ctrlKey && e.key === 'e') {
                    e.preventDefault();
                    openExportModal();
                }
                
                // Ctrl/Cmd + ,: Preferences
                else if (ctrlKey && e.key === ',') {
                    e.preventDefault();
                    openPreferences();
                }
                
                // Ctrl/Cmd + 1-5: Switch tabs
                else if (ctrlKey && e.key >= '1' && e.key <= '5') {
                    e.preventDefault();
                    const tabs = ['script', 'notes', 'board', 'characters', 'stats'];
                    switchMainTab(tabs[parseInt(e.key) - 1]);
                }
            });
        }

        // Main tab switching
        function switchMainTab(tab) {
            // Update top nav tabs
            document.querySelectorAll('.top-nav-tab').forEach(btn => btn.classList.remove('active'));
            document.getElementById(tab + 'Tab').classList.add('active');

            // Hide all view containers
            document.getElementById('scriptView').style.display = 'none';
            document.getElementById('notesView').style.display = 'none';
            document.getElementById('boardView').style.display = 'none';
            document.getElementById('charactersView').style.display = 'none';
            document.getElementById('statsView').style.display = 'none';

            // Show appropriate view
            if (tab === 'script') {
                document.getElementById('scriptView').style.display = 'flex';
            } else if (tab === 'notes') {
                document.getElementById('notesView').style.display = 'flex';
                updateNotesList();
            } else if (tab === 'board') {
                document.getElementById('boardView').style.display = 'flex';
                updateSceneBoard();
            } else if (tab === 'characters') {
                document.getElementById('charactersView').style.display = 'flex';
                updateCharactersView();
            } else if (tab === 'stats') {
                document.getElementById('statsView').style.display = 'flex';
                updateStatsView();
            }
        }

        // Sidebar resizing functionality
        function initSidebarResize() {
            const sidebars = document.querySelectorAll('.sidebar');
            sidebars.forEach(sidebar => {
                // Create resize handle
                const resizeHandle = document.createElement('div');
                resizeHandle.className = 'sidebar-resize-handle';
                resizeHandle.title = 'Drag to resize sidebar';
                sidebar.appendChild(resizeHandle);
                
                let isResizing = false;
                let startX, startWidth;
                
                resizeHandle.addEventListener('mousedown', function(e) {
                    isResizing = true;
                    startX = e.clientX;
                    startWidth = sidebar.offsetWidth;
                    document.body.style.cursor = 'col-resize';
                    document.body.style.userSelect = 'none';
                    e.preventDefault();
                });
                
                document.addEventListener('mousemove', function(e) {
                    if (!isResizing) return;
                    
                    const width = startWidth + (e.clientX - startX);
                    // Constrain width between 200px and 500px
                    if (width >= 200 && width <= 500) {
                        sidebar.style.width = width + 'px';
                    }
                });
                
                document.addEventListener('mouseup', function() {
                    if (isResizing) {
                        isResizing = false;
                        document.body.style.cursor = '';
                        document.body.style.userSelect = '';
                    }
                });
            });
        }

        // Board View Functions
        let boardViewType = 'grid';
        let draggedSceneCard = null;

        function updateSceneBoard() {
            const container = document.getElementById('sceneCardsContainer');
            if (!container) return;
            
            container.innerHTML = '';
            
            // Get all scenes from sceneScripts
            sceneScripts.forEach((sceneData, index) => {
                const card = createSceneCard(index);
                container.appendChild(card);
            });
            
            // Add "Add New Scene" card
            const addCard = document.createElement('div');
            addCard.className = 'add-scene-card';
            addCard.onclick = () => addNewSceneFromBoard();
            addCard.innerHTML = `
                <div class="add-scene-icon">+</div>
                <div class="add-scene-text">Add New Scene</div>
            `;
            container.appendChild(addCard);
        }

        function createSceneCard(index) {
            const card = document.createElement('div');
            card.className = 'scene-card';
            card.draggable = true;
            card.dataset.scene = index;
            
            // Extract scene heading from first block if it exists
            const sceneData = sceneScripts[index] || [];
            const sceneHeading = sceneData.find(block => block.type === 'scene-heading');
            const location = sceneHeading ? sceneHeading.text : `Scene ${index + 1}`;
            
            // Calculate basic stats
            const wordCount = sceneData.reduce((sum, block) => {
                return sum + (block.text ? block.text.split(/\s+/).length : 0);
            }, 0);
            const estimatedMinutes = Math.max(1, Math.round(wordCount / 150)); // rough estimate
            
            // Determine act based on scene position (simple thirds)
            const totalScenes = sceneScripts.length;
            let act = 1;
            if (index >= totalScenes * 2/3) act = 3;
            else if (index >= totalScenes / 3) act = 2;
            
            const actClass = act === 1 ? 'act-1' : act === 2 ? 'act-2' : 'act-3';
            const actLabel = `Act ${act === 1 ? 'I' : act === 2 ? 'II' : 'III'}`;
            
            // Get first action block for description
            const actionBlock = sceneData.find(block => block.type === 'action');
            const description = actionBlock ? actionBlock.text.substring(0, 80) + '...' : 'No description yet...';
            
            card.innerHTML = `
                <div class="scene-card-header">
                    <div class="scene-card-number">${index + 1}</div>
                    <div class="scene-card-act ${actClass}">${actLabel}</div>
                </div>
                <div class="scene-card-title">Scene ${index + 1}</div>
                <div class="scene-card-location">${location}</div>
                <div class="scene-card-description">${description}</div>
                <div class="scene-card-stats">
                    <span>~${estimatedMinutes} min</span>
                    <span>${wordCount} words</span>
                </div>
            `;
            
            // Add drag and drop event listeners
            card.addEventListener('dragstart', handleSceneDragStart);
            card.addEventListener('dragover', handleSceneDragOver);
            card.addEventListener('drop', handleSceneDrop);
            card.addEventListener('dragend', handleSceneDragEnd);
            card.addEventListener('click', () => selectSceneFromBoard(index));
            
            return card;
        }

        function handleSceneDragStart(e) {
            draggedSceneCard = this;
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        }

        function handleSceneDragOver(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            if (this !== draggedSceneCard && !this.classList.contains('add-scene-card')) {
                this.classList.add('drop-target');
            }
            e.dataTransfer.dropEffect = 'move';
            return false;
        }

        function handleSceneDrop(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            
            this.classList.remove('drop-target');
            
            if (draggedSceneCard !== this && !this.classList.contains('add-scene-card')) {
                const fromIndex = parseInt(draggedSceneCard.dataset.scene);
                const toIndex = parseInt(this.dataset.scene);
                
                // Swap scenes in the array
                const temp = sceneScripts[fromIndex];
                sceneScripts[fromIndex] = sceneScripts[toIndex];
                sceneScripts[toIndex] = temp;
                
                // Update the board
                updateSceneBoard();
                rebuildSceneList();
                showNotification('Scene order updated!');
            }
            
            return false;
        }

        function handleSceneDragEnd(e) {
            this.classList.remove('dragging');
            document.querySelectorAll('.scene-card').forEach(card => {
                card.classList.remove('drop-target');
            });
        }

        function selectSceneFromBoard(index) {
            currentSceneIndex = index;
            switchMainTab('script');
            selectScene(index);
        }

        function addNewSceneFromBoard() {
            addNewScene();
            updateSceneBoard();
        }

        function setBoardView(view) {
            boardViewType = view;
            const container = document.getElementById('sceneCardsContainer');
            const gridBtn = document.getElementById('gridViewBtn');
            const timelineBtn = document.getElementById('timelineViewBtn');
            
            if (view === 'grid') {
                container.classList.remove('timeline');
                gridBtn.classList.add('active');
                timelineBtn.classList.remove('active');
            } else {
                container.classList.add('timeline');
                timelineBtn.classList.add('active');
                gridBtn.classList.remove('active');
            }
        }

        // Characters View Functions
        let characters = [];

        function updateCharactersView() {
            extractCharactersFromScript();
            const grid = document.getElementById('charactersGrid');
            if (!grid) return;
            
            grid.innerHTML = '';
            
            if (characters.length === 0) {
                grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 40px;">No characters found. Characters will appear here once you add them to your script.</p>';
                return;
            }
            
            characters.forEach((char, index) => {
                const card = createCharacterCard(char, index);
                grid.appendChild(card);
            });
        }

        function extractCharactersFromScript() {
            const charMap = new Map();
            
            sceneScripts.forEach(sceneData => {
                sceneData.forEach(block => {
                    if (block.type === 'character' && block.text.trim()) {
                        const name = block.text.trim();
                        if (charMap.has(name)) {
                            charMap.get(name).scenes++;
                        } else {
                            charMap.set(name, {
                                name: name,
                                scenes: 1,
                                initials: getInitials(name)
                            });
                        }
                    }
                });
            });
            
            characters = Array.from(charMap.values());
        }

        function getInitials(name) {
            const parts = name.split(/\s+/);
            if (parts.length >= 2) {
                return parts[0][0] + parts[1][0];
            }
            return name.substring(0, 2);
        }

        function createCharacterCard(char, index) {
            const card = document.createElement('div');
            card.className = 'character-card';
            
            card.innerHTML = `
                <div class="character-avatar">${char.initials.toUpperCase()}</div>
                <div class="character-name">${char.name}</div>
                <div class="character-role">Character</div>
                <div class="character-stats">
                    <div class="character-stat">
                        <div class="character-stat-value">${char.scenes}</div>
                        <div class="character-stat-label">Scenes</div>
                    </div>
                </div>
            `;
            
            return card;
        }

        function addNewCharacter() {
            showNotification('To add a character, add them in your script with the Character format!');
        }

        // Stats View Functions
        function updateStatsView() {
            const stats = calculateScriptStats();
            
            // Update main stat cards
            document.getElementById('statTotalPages').textContent = stats.totalPages;
            document.getElementById('statEstimatedRuntime').textContent = stats.estimatedRuntime;
            document.getElementById('statTotalScenes').textContent = stats.totalScenes;
            document.getElementById('statTotalWords').textContent = stats.totalWords;
            
            // Update act structure visualization
            updateActStructure();
            
            // Update scene breakdown
            const sceneBreakdown = document.getElementById('sceneBreakdown');
            if (sceneBreakdown) {
                let breakdownHTML = '';
                sceneScripts.forEach((sceneData, index) => {
                    const wordCount = sceneData.reduce((sum, block) => {
                        return sum + (block.text ? block.text.split(/\s+/).filter(w => w).length : 0);
                    }, 0);
                    breakdownHTML += `
                        <div class="stat-item">
                            <span class="stat-item-label">Scene ${index + 1}</span>
                            <span class="stat-item-value">${wordCount} words</span>
                        </div>
                    `;
                });
                sceneBreakdown.innerHTML = breakdownHTML || '<p style="color: #94a3b8;">No scenes yet</p>';
            }
            
            // Update character analysis with detailed stats
            const characterAnalysis = document.getElementById('characterAnalysis');
            if (characterAnalysis) {
                const detailedCharStats = calculateDetailedCharacterStats();
                let analysisHTML = '';
                detailedCharStats.slice(0, 5).forEach(char => {
                    analysisHTML += `
                        <div class="stat-item character-stat-detailed">
                            <span class="stat-item-label">${char.name}</span>
                            <div class="stat-item-details">
                                <span class="stat-detail">${char.lines} lines</span>
                                <span class="stat-detail">${char.words} words</span>
                                <span class="stat-detail">${char.scenes} scenes</span>
                            </div>
                        </div>
                    `;
                });
                characterAnalysis.innerHTML = analysisHTML || '<p style="color: #94a3b8;">No characters yet</p>';
            }
            
            // Update location analysis
            const locationAnalysis = document.getElementById('locationAnalysis');
            if (locationAnalysis) {
                const locations = calculateLocationStats();
                let locationHTML = '';
                locations.slice(0, 5).forEach(loc => {
                    locationHTML += `
                        <div class="stat-item">
                            <span class="stat-item-label">${loc.name}</span>
                            <span class="stat-item-value">${loc.count} scenes</span>
                        </div>
                    `;
                });
                locationAnalysis.innerHTML = locationHTML || '<p style="color: #94a3b8;">No locations yet</p>';
            }
        }
        
        function updateActStructure() {
            const actBar = document.getElementById('actBar');
            if (!actBar) return;
            
            const totalScenes = sceneScripts.length;
            if (totalScenes === 0) {
                actBar.innerHTML = '<p style="color: #94a3b8;">No scenes yet</p>';
                return;
            }
            
            // Calculate act boundaries (using traditional 3-act structure)
            const act1End = Math.floor(totalScenes / 4);
            const act2End = Math.floor(totalScenes * 3 / 4);
            
            const act1Percentage = (act1End / totalScenes) * 100;
            const act2Percentage = ((act2End - act1End) / totalScenes) * 100;
            const act3Percentage = ((totalScenes - act2End) / totalScenes) * 100;
            
            actBar.innerHTML = `
                <div class="act-segment act-1" style="width: ${act1Percentage}%">
                    <span>Act I</span>
                    <small>${act1End} scenes</small>
                </div>
                <div class="act-segment act-2" style="width: ${act2Percentage}%">
                    <span>Act II</span>
                    <small>${act2End - act1End} scenes</small>
                </div>
                <div class="act-segment act-3" style="width: ${act3Percentage}%">
                    <span>Act III</span>
                    <small>${totalScenes - act2End} scenes</small>
                </div>
            `;
        }
        
        function calculateLocationStats() {
            const locationMap = new Map();
            
            sceneScripts.forEach((sceneData) => {
                sceneData.forEach((block) => {
                    if (block.type === 'scene-heading' && block.text.trim()) {
                        const location = block.text.trim();
                        if (locationMap.has(location)) {
                            locationMap.set(location, locationMap.get(location) + 1);
                        } else {
                            locationMap.set(location, 1);
                        }
                    }
                });
            });
            
            return Array.from(locationMap.entries())
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count);
        }
        
        function calculateDetailedCharacterStats() {
            const charMap = new Map();
            
            sceneScripts.forEach((sceneData, sceneIndex) => {
                let currentCharacter = null;
                let sceneCharacters = new Set();
                
                sceneData.forEach((block, blockIndex) => {
                    if (block.type === 'character' && block.text.trim()) {
                        currentCharacter = block.text.trim();
                        sceneCharacters.add(currentCharacter);
                        
                        if (!charMap.has(currentCharacter)) {
                            charMap.set(currentCharacter, {
                                name: currentCharacter,
                                lines: 0,
                                words: 0,
                                scenes: 0,
                                initials: getInitials(currentCharacter)
                            });
                        }
                    } else if (block.type === 'dialogue' && currentCharacter) {
                        const char = charMap.get(currentCharacter);
                        char.lines++;
                        const words = block.text ? block.text.split(/\s+/).filter(w => w).length : 0;
                        char.words += words;
                    }
                });
                
                // Count unique scenes for each character
                sceneCharacters.forEach(charName => {
                    if (charMap.has(charName)) {
                        charMap.get(charName).scenes++;
                    }
                });
            });
            
            return Array.from(charMap.values()).sort((a, b) => b.words - a.words);
        }
        
        function exportStats() {
            const stats = calculateScriptStats();
            const characterStats = calculateDetailedCharacterStats();
            const locationStats = calculateLocationStats();
            
            // Build CSV content
            let csv = 'Script Scribbler - Statistics Export\n\n';
            
            // Overall Stats
            csv += 'Overall Statistics\n';
            csv += 'Metric,Value\n';
            csv += `Total Pages,${stats.totalPages}\n`;
            csv += `Estimated Runtime (minutes),${stats.estimatedRuntime}\n`;
            csv += `Total Scenes,${stats.totalScenes}\n`;
            csv += `Total Words,${stats.totalWords}\n\n`;
            
            // Character Stats
            csv += 'Character Statistics\n';
            csv += 'Character,Lines,Words,Scenes\n';
            characterStats.forEach(char => {
                csv += `"${char.name}",${char.lines},${char.words},${char.scenes}\n`;
            });
            csv += '\n';
            
            // Location Stats
            csv += 'Location Statistics\n';
            csv += 'Location,Scene Count\n';
            locationStats.forEach(loc => {
                csv += `"${loc.name}",${loc.count}\n`;
            });
            csv += '\n';
            
            // Scene Breakdown
            csv += 'Scene Breakdown\n';
            csv += 'Scene,Words\n';
            sceneScripts.forEach((sceneData, index) => {
                const wordCount = sceneData.reduce((sum, block) => {
                    return sum + (block.text ? block.text.split(/\s+/).filter(w => w).length : 0);
                }, 0);
                csv += `Scene ${index + 1},${wordCount}\n`;
            });
            
            // Download CSV
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'script_statistics.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('Statistics exported successfully!');
        }

        function calculateScriptStats() {
            let totalWords = 0;
            let totalBlocks = 0;
            
            sceneScripts.forEach(sceneData => {
                sceneData.forEach(block => {
                    if (block.text) {
                        const words = block.text.split(/\s+/).filter(w => w).length;
                        totalWords += words;
                        totalBlocks++;
                    }
                });
            });
            
            // Standard screenplay formatting: ~250 words per page
            const totalPages = Math.max(1, Math.ceil(totalWords / 250));
            // Screenplay timing: ~1 minute per page
            const estimatedRuntime = totalPages;
            
            return {
                totalWords: totalWords,
                totalPages: totalPages,
                estimatedRuntime: estimatedRuntime,
                totalScenes: sceneScripts.length
            };
        }

        // Options menu functions
        function toggleOptionsMenu() {
            const menu = document.getElementById('optionsMenu');
            menu.classList.toggle('show');
        }

        // Search Modal Functions
        let searchFilter = 'all';

        function openSearchModal() {
            document.getElementById('searchModal').style.display = 'flex';
            document.getElementById('optionsMenu').classList.remove('show');
            setTimeout(() => document.getElementById('searchInput').focus(), 100);
        }

        function closeSearchModal() {
            document.getElementById('searchModal').style.display = 'none';
            document.getElementById('searchInput').value = '';
            document.getElementById('searchResults').innerHTML = '<p style="text-align: center; color: #94a3b8; padding: 40px;">Enter a search term to find content across your project</p>';
        }

        function setSearchFilter(filter) {
            searchFilter = filter;
            document.querySelectorAll('.search-filters .filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            performSearch();
        }

        function performSearch() {
            const query = document.getElementById('searchInput').value.toLowerCase();
            const resultsContainer = document.getElementById('searchResults');
            
            if (!query) {
                resultsContainer.innerHTML = '<p style="text-align: center; color: #94a3b8; padding: 40px;">Enter a search term to find content across your project</p>';
                return;
            }
            
            let results = [];
            
            // Search scenes
            if (searchFilter === 'all' || searchFilter === 'scenes') {
                sceneScripts.forEach((sceneData, index) => {
                    sceneData.forEach(block => {
                        if (block.text && block.text.toLowerCase().includes(query)) {
                            // Highlight the match
                            const lowerText = block.text.toLowerCase();
                            const matchIndex = lowerText.indexOf(query);
                            const start = Math.max(0, matchIndex - 30);
                            const end = Math.min(block.text.length, matchIndex + query.length + 70);
                            let preview = block.text.substring(start, end);
                            if (start > 0) preview = '...' + preview;
                            if (end < block.text.length) preview = preview + '...';
                            
                            results.push({
                                type: 'Scene',
                                title: `Scene ${index + 1}`,
                                preview: preview,
                                query: query,
                                action: () => {
                                    closeSearchModal();
                                    switchMainTab('script');
                                    selectScene(index);
                                }
                            });
                        }
                    });
                });
            }
            
            // Search notes
            if (searchFilter === 'all' || searchFilter === 'notes') {
                notes.forEach((note, index) => {
                    const searchableText = (note.title + ' ' + JSON.stringify(note)).toLowerCase();
                    if (searchableText.includes(query)) {
                        const preview = getNotePreview(note);
                        results.push({
                            type: 'Note',
                            title: note.title,
                            preview: preview,
                            query: query,
                            action: () => {
                                closeSearchModal();
                                switchMainTab('notes');
                                selectNote(index);
                            }
                        });
                    }
                });
            }
            
            // Search characters
            if (searchFilter === 'all' || searchFilter === 'characters') {
                extractCharactersFromScript();
                characters.forEach(char => {
                    if (char.name.toLowerCase().includes(query)) {
                        results.push({
                            type: 'Character',
                            title: char.name,
                            preview: `Appears in ${char.scenes} scene(s)`,
                            query: query,
                            action: () => {
                                closeSearchModal();
                                switchMainTab('characters');
                            }
                        });
                    }
                });
            }
            
            // Display results with highlighting
            if (results.length === 0) {
                resultsContainer.innerHTML = '<p style="text-align: center; color: #94a3b8; padding: 40px;">No results found</p>';
            } else {
                resultsContainer.innerHTML = results.map((result, index) => {
                    const highlightedPreview = highlightSearchTerm(result.preview, result.query);
                    const highlightedTitle = highlightSearchTerm(result.title, result.query);
                    return `
                    <div class="search-result-item" data-result-index="${index}" tabindex="0">
                        <div class="search-result-type">${result.type}</div>
                        <div class="search-result-title">${highlightedTitle}</div>
                        <div class="search-result-preview">${highlightedPreview}</div>
                    </div>`;
                }).join('');
                
                // Add click handlers to results
                const resultItems = resultsContainer.querySelectorAll('.search-result-item');
                resultItems.forEach((item, index) => {
                    item.addEventListener('click', results[index].action);
                    item.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            results[index].action();
                        }
                    });
                });
                
                // Enable keyboard navigation
                initSearchKeyboardNav();
            }
        }
        
        function highlightSearchTerm(text, query) {
            if (!query) return text;
            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<mark class="search-highlight">$1</mark>');
        }
        
        function initSearchKeyboardNav() {
            const searchInput = document.getElementById('searchInput');
            searchInput.addEventListener('keydown', function(e) {
                const results = document.querySelectorAll('.search-result-item');
                if (!results.length) return;
                
                let currentIndex = -1;
                results.forEach((item, idx) => {
                    if (item.classList.contains('keyboard-focus')) {
                        currentIndex = idx;
                    }
                });
                
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % results.length;
                    results.forEach(item => item.classList.remove('keyboard-focus'));
                    results[nextIndex].classList.add('keyboard-focus');
                    results[nextIndex].scrollIntoView({ block: 'nearest' });
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = currentIndex === -1 ? results.length - 1 : (currentIndex - 1 + results.length) % results.length;
                    results.forEach(item => item.classList.remove('keyboard-focus'));
                    results[prevIndex].classList.add('keyboard-focus');
                    results[prevIndex].scrollIntoView({ block: 'nearest' });
                } else if (e.key === 'Enter' && currentIndex >= 0) {
                    e.preventDefault();
                    results[currentIndex].click();
                }
            });
        }

        // Import Modal Functions
        function openImportModal() {
            document.getElementById('importModal').style.display = 'flex';
            document.getElementById('optionsMenu').classList.remove('show');
            setupImportDropzone();
        }

        function closeImportModal() {
            document.getElementById('importModal').style.display = 'none';
        }

        function setupImportDropzone() {
            const dropzone = document.getElementById('importDropzone');
            
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.classList.add('dragover');
            });
            
            dropzone.addEventListener('dragleave', () => {
                dropzone.classList.remove('dragover');
            });
            
            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    importProjectFromFile(files[0]);
                }
            });
        }

        function handleImportFile(event) {
            const file = event.target.files[0];
            if (file) {
                importProjectFromFile(file);
            }
        }

        function importProjectFromFile(file) {
            if (!file.name.endsWith('.json')) {
                showNotification('Please select a valid JSON file');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const projectData = JSON.parse(e.target.result);
                    
                    // Import scenes
                    if (projectData.scenes) {
                        sceneScripts = projectData.scenes;
                        rebuildSceneList();
                        loadSceneIntoEditor(0);
                    }
                    
                    // Import notes
                    if (projectData.notes) {
                        notes = projectData.notes;
                        updateNotesList();
                    }
                    
                    closeImportModal();
                    showNotification('Project imported successfully!');
                    switchMainTab('script');
                } catch (error) {
                    showNotification('Error importing project: Invalid file format');
                    console.error('Import error:', error);
                }
            };
            reader.readAsText(file);
        }

        // Theme Modal Functions
        let currentTheme = 'default';

        function openThemeSettings() {
            document.getElementById('themeModal').style.display = 'flex';
            document.getElementById('optionsMenu').classList.remove('show');
        }

        function closeThemeModal() {
            document.getElementById('themeModal').style.display = 'none';
        }

        function setTheme(theme) {
            currentTheme = theme;
            document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
            event.target.closest('.theme-option').classList.add('active');
            
            const body = document.body;
            body.className = ''; // Remove all theme classes
            
            if (theme === 'light') {
                body.style.background = '#f8fafc';
            } else if (theme === 'dark') {
                body.style.background = '#0f172a';
                // In a full implementation, we'd also update text colors, etc.
            } else {
                body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }
            
            showNotification(`Theme changed to ${theme}`);
        }

        function openPreferences() {
            document.getElementById('preferencesModal').style.display = 'flex';
            document.getElementById('optionsMenu').classList.remove('show');
            
            // Load current preferences into modal
            document.getElementById('prefFontSize').value = preferences.fontSize;
            document.getElementById('prefExportFormat').value = preferences.preferredExportFormat;
            document.getElementById('prefAutoSave').checked = preferences.autoSave;
            document.getElementById('prefTheme').value = preferences.theme;
        }

        function closePreferences() {
            document.getElementById('preferencesModal').style.display = 'none';
            savePreferences();
            showNotification('Preferences saved!');
        }

        function updatePreference(key, value) {
            preferences[key] = value;
        }

        function resetPreferences() {
            if (confirm('Reset all preferences to defaults?')) {
                preferences = {
                    theme: 'default',
                    fontSize: 'medium',
                    preferredExportFormat: 'json',
                    autoSave: true
                };
                savePreferences();
                openPreferences(); // Reload modal with defaults
                showNotification('Preferences reset to defaults');
            }
        }

        function openAbout() {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const ctrlKey = isMac ? 'Cmd' : 'Ctrl';
            const message = `Script Scribbler v2.0 - A professional screenwriting application

Keyboard Shortcuts:
• ${ctrlKey}+Z: Undo
• ${ctrlKey}+Shift+Z or ${ctrlKey}+Y: Redo
• ${ctrlKey}+S: Save
• ${ctrlKey}+F: Search
• ${ctrlKey}+E: Export
• ${ctrlKey}+,: Preferences
• ${ctrlKey}+1-5: Switch tabs
• Tab: Change block type
• Enter: New line/block
• ↑/↓: Navigate blocks

Features:
✓ Undo/Redo support
✓ Auto-save every 30 seconds
✓ Resizable sidebar
✓ Drag-and-drop scene reordering
✓ Visual block type indicators
✓ Note pinning and scene linking
✓ Enhanced search with highlighting
✓ Keyboard navigation
✓ Customizable preferences`;
            
            alert(message);
            document.getElementById('optionsMenu').classList.remove('show');
        }

        // Close options menu when clicking outside
        document.addEventListener('click', function(e) {
            const optionsMenu = document.getElementById('optionsMenu');
            const optionsCog = document.querySelector('.options-cog');
            if (optionsMenu && !optionsMenu.contains(e.target) && e.target !== optionsCog) {
                optionsMenu.classList.remove('show');
            }
        });

        // Notes system functions
        function filterNotes(type) {
            currentFilter = type;
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            updateNotesList();
        }

        function updateNotesList() {
            const container = document.getElementById('notesListContainer');
            container.innerHTML = '';
            
            const filteredNotes = currentFilter === 'all' 
                ? notes 
                : notes.filter(note => note.type === currentFilter);
            
            // Sort notes: pinned first, then by updated date
            const sortedNotes = [...filteredNotes].sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            });
            
            sortedNotes.forEach((note, index) => {
                // Find the actual index in the full notes array
                const actualIndex = notes.indexOf(note);
                const preview = getNotePreview(note);
                const date = getRelativeTime(note.updatedAt);
                
                const noteItem = document.createElement('div');
                noteItem.className = `note-item ${note.color} ${actualIndex === currentNote ? 'active' : ''} ${note.pinned ? 'pinned' : ''}`;
                noteItem.setAttribute('data-type', note.type);
                noteItem.onclick = () => selectNote(actualIndex);
                noteItem.innerHTML = `
                    <span class="note-type-badge ${note.type}">${note.type}</span>
                    ${note.pinned ? '<span class="note-pin-indicator">📌</span>' : ''}
                    <div class="note-title">${note.title}</div>
                    <div class="note-preview">${preview}</div>
                    <div class="note-date">${date}</div>
                    <button class="note-pin-btn" onclick="toggleNotePin(event, ${actualIndex})" title="${note.pinned ? 'Unpin note' : 'Pin note'}">
                        ${note.pinned ? '📍' : '📌'}
                    </button>
                `;
                container.appendChild(noteItem);
            });
        }

        function toggleNotePin(event, noteIndex) {
            event.stopPropagation();
            notes[noteIndex].pinned = !notes[noteIndex].pinned;
            notes[noteIndex].updatedAt = new Date().toISOString();
            updateNotesList();
            showNotification(notes[noteIndex].pinned ? 'Note pinned' : 'Note unpinned');
            triggerAutoSave();
        }

        function getNotePreview(note) {
            let preview = '';
            if (note.type === 'character') {
                preview = note.charNoteAdditional || note.charNoteGoal || '';
            } else if (note.type === 'world') {
                preview = note.worldNoteDescription || note.worldNoteAdditional || '';
            } else if (note.type === 'object') {
                preview = note.objectNoteDescription || note.objectNoteSignificance || '';
            } else if (note.type === 'plot') {
                preview = note.plotNoteSummary || note.plotNoteDetails || '';
            } else {
                preview = note.content || '';
            }
            return preview.substring(0, 100) + (preview.length > 100 ? '...' : '');
        }

        function getRelativeTime(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);
            
            if (diffMins < 60) return `${diffMins} minutes ago`;
            if (diffHours < 24) return `${diffHours} hours ago`;
            if (diffDays === 1) return '1 day ago';
            return `${diffDays} days ago`;
        }

        function selectNote(index) {
            const items = document.querySelectorAll('.note-item');
            items.forEach(item => item.classList.remove('active'));
            currentNote = index;
            updateNotesList(); // Refresh to update active state
            loadNoteDetails(index);
        }

        function loadNoteDetails(index) {
            const note = notes[index];
            if (!note) return;

            document.getElementById('noteTitle').value = note.title;
            document.getElementById('noteType').value = note.type || 'general';

            // Update color picker
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
            document.querySelector(`.color-option.${note.color}`).classList.add('active');
            
            // Populate linked scene dropdown
            populateSceneDropdown();
            document.getElementById('noteLinkedScene').value = note.linkedScene || '';

            // Show appropriate fields based on type
            updateNoteType();

            // Load type-specific fields
            if (note.type === 'character') {
                document.getElementById('charNoteName').value = note.charNoteName || '';
                document.getElementById('charNoteRole').value = note.charNoteRole || '';
                document.getElementById('charNoteTraits').value = note.charNoteTraits || '';
                document.getElementById('charNoteGoal').value = note.charNoteGoal || '';
                document.getElementById('charNoteArc').value = note.charNoteArc || '';
                document.getElementById('charNoteAdditional').value = note.charNoteAdditional || '';
            } else if (note.type === 'world') {
                document.getElementById('worldNoteName').value = note.worldNoteName || '';
                document.getElementById('worldNoteDescription').value = note.worldNoteDescription || '';
                document.getElementById('worldNoteRules').value = note.worldNoteRules || '';
                document.getElementById('worldNoteReplacements').value = note.worldNoteReplacements || '';
                document.getElementById('worldNoteAdditional').value = note.worldNoteAdditional || '';
            } else if (note.type === 'object') {
                document.getElementById('objectNoteName').value = note.objectNoteName || '';
                document.getElementById('objectNoteDescription').value = note.objectNoteDescription || '';
                document.getElementById('objectNoteSignificance').value = note.objectNoteSignificance || '';
                document.getElementById('objectNoteAdditional').value = note.objectNoteAdditional || '';
            } else if (note.type === 'plot') {
                document.getElementById('plotNoteBeat').value = note.plotNoteBeat || '';
                document.getElementById('plotNoteSummary').value = note.plotNoteSummary || '';
                document.getElementById('plotNoteDetails').value = note.plotNoteDetails || '';
            } else {
                document.getElementById('noteContent').value = note.content || '';
            }
        }

        function updateNoteType() {
            const noteType = document.getElementById('noteType').value;
            
            // Hide all field containers
            document.querySelectorAll('.note-fields-container').forEach(container => {
                container.style.display = 'none';
            });
            
            // Show the appropriate one
            document.getElementById(noteType + 'Fields').style.display = 'block';
            
            // Update current note type
            if (notes[currentNote]) {
                notes[currentNote].type = noteType;
            }
        }

        function updateNote() {
            const note = notes[currentNote];
            if (!note) return;

            note.title = document.getElementById('noteTitle').value;
            note.linkedScene = document.getElementById('noteLinkedScene').value;
            note.updatedAt = new Date().toISOString();

            // Update type-specific fields
            const noteType = note.type;
            if (noteType === 'character') {
                note.charNoteName = document.getElementById('charNoteName').value;
                note.charNoteRole = document.getElementById('charNoteRole').value;
                note.charNoteTraits = document.getElementById('charNoteTraits').value;
                note.charNoteGoal = document.getElementById('charNoteGoal').value;
                note.charNoteArc = document.getElementById('charNoteArc').value;
                note.charNoteAdditional = document.getElementById('charNoteAdditional').value;
            } else if (noteType === 'world') {
                note.worldNoteName = document.getElementById('worldNoteName').value;
                note.worldNoteDescription = document.getElementById('worldNoteDescription').value;
                note.worldNoteRules = document.getElementById('worldNoteRules').value;
                note.worldNoteReplacements = document.getElementById('worldNoteReplacements').value;
                note.worldNoteAdditional = document.getElementById('worldNoteAdditional').value;
            } else if (noteType === 'object') {
                note.objectNoteName = document.getElementById('objectNoteName').value;
                note.objectNoteDescription = document.getElementById('objectNoteDescription').value;
                note.objectNoteSignificance = document.getElementById('objectNoteSignificance').value;
                note.objectNoteAdditional = document.getElementById('objectNoteAdditional').value;
            } else if (noteType === 'plot') {
                note.plotNoteBeat = document.getElementById('plotNoteBeat').value;
                note.plotNoteSummary = document.getElementById('plotNoteSummary').value;
                note.plotNoteDetails = document.getElementById('plotNoteDetails').value;
            } else {
                note.content = document.getElementById('noteContent').value;
            }

            updateNotesList();
        }

        function changeNoteColor(color) {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
            document.querySelector(`.color-option.${color}`).classList.add('active');
            
            if (notes[currentNote]) {
                notes[currentNote].color = color;
                updateNotesList();
            }
        }
        
        function populateSceneDropdown() {
            const dropdown = document.getElementById('noteLinkedScene');
            if (!dropdown) return;
            
            dropdown.innerHTML = '<option value="">None</option>';
            sceneScripts.forEach((scene, index) => {
                const sceneHeading = scene.find(b => b.type === 'scene-heading');
                const sceneName = sceneHeading ? sceneHeading.text : `Scene ${index + 1}`;
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `Scene ${index + 1}: ${sceneName.substring(0, 40)}`;
                dropdown.appendChild(option);
            });
        }
        
        function jumpToLinkedScene() {
            const note = notes[currentNote];
            if (note && note.linkedScene !== undefined && note.linkedScene !== '') {
                const sceneIndex = parseInt(note.linkedScene);
                if (sceneIndex >= 0 && sceneIndex < sceneScripts.length) {
                    switchMainTab('script');
                    selectScene(sceneIndex);
                    showNotification(`Jumped to Scene ${sceneIndex + 1}`);
                }
            }
        }

        function addNewNote() {
            const newNote = {
                title: "New Note",
                type: "general",
                color: "yellow",
                content: "",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            notes.push(newNote);
            currentNote = notes.length - 1;
            updateNotesList();
            loadNoteDetails(currentNote);
            showNotification('New note created!');
        }
