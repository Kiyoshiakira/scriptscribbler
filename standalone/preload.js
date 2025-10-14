const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'electronAPI', {
        saveDialog: (defaultPath) => ipcRenderer.invoke('save-dialog', defaultPath),
        writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),
        onNewProject: (callback) => ipcRenderer.on('new-project', callback),
        onLoadProject: (callback) => ipcRenderer.on('load-project', (event, data) => callback(data)),
        onSaveProject: (callback) => ipcRenderer.on('save-project', callback),
        onExport: (callback) => ipcRenderer.on('export', (event, format) => callback(format))
    }
);
