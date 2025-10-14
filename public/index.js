   <script>
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

        let editorEnabled = false; // Only enable after test button or login

        function enableTestEditor() {
            editorEnabled = true;
            const editor = document.getElementById('scriptEditor');
            editor.setAttribute('contenteditable', 'true');
            document.getElementById('formatSelect').disabled = false;
            if (editor.innerHTML.trim() === "") {
                initScriptEditor();
            }
            setTimeout(() => {
                editor.querySelector('.script-editor-block')?.focus();
            }, 50);
        }

        function createScriptEditorBlock(type = 'action', text = '') {
            const div = document.createElement('div');
            div.className = `script-editor-block ${type}`;
            div.setAttribute('data-type', type);
            div.setAttribute('tabindex', '0');
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
                autoFormatScriptBlock(this);
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
            editor.innerHTML = '';
            // Example initial lines
            const initialBlocks = [
                {type: 'scene-heading', text: 'INT. COFFEE SHOP - DAY'},
                {type: 'action', text: 'SARAH, a young writer in her twenties, sits at a corner table typing furiously on her laptop. Steam rises from her untouched coffee.'},
                {type: 'character', text: 'SARAH'},
                {type: 'dialogue', text: "This story isn't working. I need something more... authentic."},
                {type: 'action', text: "She stares at the screen, frustrated. The cursor blinks mockingly at the end of an incomplete sentence."},
                {type: 'scene-heading', text: "EXT. PARK - AFTERNOON"},
                {type: 'action', text: "Sarah walks through the park, phone pressed to her ear. She looks determined but nervous."},
                {type: 'character', text: "SARAH"},
                {type: 'dialogue', text: "Marcus, I know this sounds crazy, but I think I found our story."}
            ];
            for (const block of initialBlocks) {
                editor.appendChild(createScriptEditorBlock(block.type, block.text));
            }
            // Always have one empty block at the end
            editor.appendChild(createScriptEditorBlock('action', ''));
            setTimeout(() => {
                const first = editor.querySelector('.script-editor-block');
                if (first) first.focus();
            }, 50);
            updateStats();
        }

        function setFormatDropdownToBlock(block) {
            const type = getBlockType(block);
            document.getElementById('formatSelect').value = type;
        }

        function changeBlockTypeDropdown() {
            if (!editorEnabled) return;
            const select = document.getElementById('formatSelect');
            const editor = document.getElementById('scriptEditor');
            const block = document.activeElement;
            if (!block || !block.classList || !block.classList.contains('script-editor-block')) return;
            // Change class
            SCRIPT_BLOCK_TYPES.forEach(t => block.classList.remove(t));
            block.classList.add(select.value);
            block.setAttribute('data-type', select.value);
            block.setAttribute('data-placeholder', PLACEHOLDERS[select.value] || '');
            // Update placeholder status
            if (block.textContent.trim() === '') block.classList.add('placeholder');
            else block.classList.remove('placeholder');
            block.focus();
            updateStats();
        }

        function handleScriptEditorKeyDown(e) {
            if (!editorEnabled) return;
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
            updateStats();
        }

        function autoFormatScriptBlock(block) {
            const text = block.textContent.trim();
            if (getBlockType(block) === 'scene-heading') return; // Don't disturb manual selection
            if (/^(INT\.|EXT\.|EST\.|INT\/EXT\.)/i.test(text)) {
                // Scene heading
                SCRIPT_BLOCK_TYPES.forEach(t => block.classList.remove(t));
                block.classList.add('scene-heading');
                block.setAttribute('data-type', 'scene-heading');
            } else if (/^\(.+\)$/.test(text)) {
                // Parenthetical
                SCRIPT_BLOCK_TYPES.forEach(t => block.classList.remove(t));
                block.classList.add('parenthetical');
                block.setAttribute('data-type', 'parenthetical');
            } else if (text === text.toUpperCase() && text.length <= 30 && /^[A-Z0-9\s\-.']+$/.test(text) && text.length > 2) {
                // Character name (all caps, short)
                SCRIPT_BLOCK_TYPES.forEach(t => block.classList.remove(t));
                block.classList.add('character');
                block.setAttribute('data-type', 'character');
            } else if (text) {
                // Default to action
                SCRIPT_BLOCK_TYPES.forEach(t => block.classList.remove(t));
                block.classList.add('action');
                block.setAttribute('data-type', 'action');
            }
            setFormatDropdownToBlock(block);
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

        // Quick Integration, Scenes, and Export Modal logic (unchanged except for script editor)
        function selectScene(index) {
            document.querySelectorAll('.scene-item').forEach((item, i) => {
                item.classList.toggle('active', i === index);
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

            const editor = document.getElementById('scriptEditor');
            if (editorEnabled) {
                const sceneHeading = createScriptEditorBlock('scene-heading', 'INT./EXT. LOCATION - TIME');
                editor.appendChild(sceneHeading);
                editor.appendChild(createScriptEditorBlock('action', ''));
            }
            showNotification('New scene added!');
        }

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
            const lines = [];
            document.querySelectorAll('.script-editor-block').forEach(block => {
                const format = getBlockType(block);
                const content = block.textContent.trim();
                if (content) {
                    lines.push({
                        format: format,
                        content: content
                    });
                }
            });
            return {
                lines: lines,
                statistics: {
                    words: lines.map(line => line.content.split(/\s+/).length).reduce((a, b) => a + b, 0),
                    pages: Math.max(1, Math.ceil(lines.map(line => line.content.split(/\s+/).length).reduce((a, b) => a + b, 0) / 250))
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

        // Initialize script editor disabled by default, waits for Test button
        document.addEventListener('DOMContentLoaded', function() {
            const editor = document.getElementById('scriptEditor');
            // Do not enable editor until test button is clicked
            updateStats();
        });
    </script>
