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
            
            // Add all scenes with delete buttons
            sceneScripts.forEach((_, index) => {
                const sceneItem = document.createElement('div');
                sceneItem.className = 'scene-item';
                if (index === currentSceneIndex) {
                    sceneItem.classList.add('active');
                }
                
                // Get scene heading from first block if available
                const sceneHeading = sceneScripts[index].find(block => block.type === 'scene-heading');
                const locationText = sceneHeading ? sceneHeading.text : 'INT./EXT. LOCATION - TIME';
                
                sceneItem.innerHTML = `
                    <div class="scene-title">Scene ${index + 1}</div>
                    <div class="scene-location">${locationText}</div>
                    ${sceneScripts.length > 1 ? `<button class="scene-delete-btn" onclick="deleteScene(${index}, event)" title="Delete scene">×</button>` : ''}
                `;
                
                sceneItem.onclick = () => selectScene(index);
                sceneList.appendChild(sceneItem);
            });
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
        function showNotification(message, isError = false) {
            const notification = document.getElementById('statusNotification');
            const statusText = document.getElementById('statusText');
            statusText.textContent = message;
            notification.className = `status-notification show ${isError ? 'error' : ''}`;
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
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
            const integrationTarget = document.getElementById('integrationTarget').value;
            const scriptData = collectScriptDataFromBlocks();
            const exportPackage = {
                metadata: {
                    title: projectTitle,
                    exportType: selectedExportType,
                    format: exportFormat,
                    target: integrationTarget,
                    exportedAt: new Date().toISOString(),
                    version: "1.0"
                },
                script: scriptData,
                integration: {
                    apiEndpoint: generateAPIEndpoint(),
                    webhookUrl: generateWebhookUrl(),
                    collaborationId: generateCollaborationId()
                }
            };
            showNotification('Preparing export...');
            setTimeout(() => {
                downloadExport(exportPackage, exportFormat);
                showNotification(`Successfully exported for ${integrationTarget}!`);
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
        });

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
            
            // Update character analysis
            const characterAnalysis = document.getElementById('characterAnalysis');
            if (characterAnalysis) {
                extractCharactersFromScript();
                let analysisHTML = '';
                characters.slice(0, 5).forEach(char => {
                    analysisHTML += `
                        <div class="stat-item">
                            <span class="stat-item-label">${char.name}</span>
                            <span class="stat-item-value">${char.scenes} scenes</span>
                        </div>
                    `;
                });
                characterAnalysis.innerHTML = analysisHTML || '<p style="color: #94a3b8;">No characters yet</p>';
            }
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

        function openThemeSettings() {
            showNotification('Theme settings coming soon!');
            document.getElementById('optionsMenu').classList.remove('show');
        }

        function openPreferences() {
            showNotification('Preferences coming soon!');
            document.getElementById('optionsMenu').classList.remove('show');
        }

        function openAbout() {
            showNotification('Script Scribbler v1.0 - A professional screenwriting application for writers.');
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
            
            filteredNotes.forEach((note, index) => {
                // Find the actual index in the full notes array
                const actualIndex = notes.indexOf(note);
                const preview = getNotePreview(note);
                const date = getRelativeTime(note.updatedAt);
                
                const noteItem = document.createElement('div');
                noteItem.className = `note-item ${note.color} ${actualIndex === currentNote ? 'active' : ''}`;
                noteItem.setAttribute('data-type', note.type);
                noteItem.onclick = () => selectNote(actualIndex);
                noteItem.innerHTML = `
                    <span class="note-type-badge ${note.type}">${note.type}</span>
                    <div class="note-title">${note.title}</div>
                    <div class="note-preview">${preview}</div>
                    <div class="note-date">${date}</div>
                `;
                container.appendChild(noteItem);
            });
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

        // Electron Integration (only active in standalone mode)
        if (typeof window.electronAPI !== 'undefined') {
            // Handle new project
            window.electronAPI.onNewProject(() => {
                if (confirm('Create a new project? Unsaved changes will be lost.')) {
                    location.reload();
                }
            });

            // Handle load project
            window.electronAPI.onLoadProject((data) => {
                try {
                    const project = JSON.parse(data);
                    // Load scenes
                    if (project.scenes) {
                        sceneScripts = project.scenes;
                        currentSceneIndex = 0;
                        rebuildSceneList();
                        initScriptEditor();
                    }
                    // Load notes
                    if (project.notes) {
                        notes = project.notes;
                        updateNotesList();
                        if (notes.length > 0) {
                            loadNoteDetails(0);
                        }
                    }
                    showNotification('Project loaded successfully!');
                } catch (error) {
                    alert('Error loading project: ' + error.message);
                }
            });

            // Handle save project
            window.electronAPI.onSaveProject(async () => {
                const project = {
                    metadata: {
                        title: "My Screenplay",
                        version: "1.0.0",
                        created: new Date().toISOString()
                    },
                    scenes: sceneScripts,
                    notes: notes
                };
                const data = JSON.stringify(project, null, 2);
                const result = await window.electronAPI.saveDialog('screenplay.json');
                if (!result.canceled && result.filePath) {
                    const writeResult = await window.electronAPI.writeFile(result.filePath, data);
                    if (writeResult.success) {
                        showNotification('Project saved successfully!');
                    } else {
                        alert('Error saving project: ' + writeResult.error);
                    }
                }
            });

            // Handle export
            window.electronAPI.onExport(async (format) => {
                const exportData = collectScriptDataFromBlocks();
                const exportPackage = {
                    metadata: {
                        title: "My Screenplay",
                        author: "Script Scribbler",
                        version: "1.0.0",
                        created: new Date().toISOString(),
                        format: format
                    },
                    script: exportData
                };
                
                let content, defaultPath, filter;
                switch (format) {
                    case 'json':
                        content = JSON.stringify(exportPackage, null, 2);
                        defaultPath = 'screenplay.json';
                        break;
                    case 'xml':
                        content = convertToXML(exportPackage);
                        defaultPath = 'screenplay.xml';
                        break;
                    case 'fountain':
                        content = convertToFountain(exportPackage.script);
                        defaultPath = 'screenplay.fountain';
                        break;
                    case 'pdf':
                        content = convertToText(exportPackage.script);
                        defaultPath = 'screenplay.txt';
                        break;
                }
                
                const result = await window.electronAPI.saveDialog(defaultPath);
                if (!result.canceled && result.filePath) {
                    const writeResult = await window.electronAPI.writeFile(result.filePath, content);
                    if (writeResult.success) {
                        showNotification('Exported successfully!');
                    } else {
                        alert('Error exporting: ' + writeResult.error);
                    }
                }
            });
        }
