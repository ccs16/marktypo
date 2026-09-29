const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isDesktop: true,
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  readFile: (filePath) => ipcRenderer.invoke('file:read', filePath),
  saveFile: (data) => ipcRenderer.invoke('file:save', data),
  setTitle: (title) => ipcRenderer.invoke('app:setTitle', title),
  on: (channel, callback) => {
    const validChannels = [
      'menu:newTab',
      'menu:fileOpened',
      'menu:directoryOpened',
      'menu:save',
      'menu:saveAs',
      'menu:exportHTML',
      'menu:exportPDF',
      'menu:toggleSourceMode',
      'menu:toggleFocusMode',
      'menu:toggleTypewriterMode',
      'menu:showShortcuts',
      'menu:showSettings',
      'menu:format',
      'menu:insert',
    ];
    if (validChannels.includes(channel)) {
      const subscription = (event, ...args) => callback(...args);
      ipcRenderer.on(channel, subscription);
      return () => ipcRenderer.removeListener(channel, subscription);
    }
  },
});
