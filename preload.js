const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  redirectLeftView: (url) => ipcRenderer.send('redirect-left-view', url),
  deleteUrl: (url) => ipcRenderer.send('delete-url', url),
  highlightUrl: (url) => ipcRenderer.send('highlight-url', url)
});
