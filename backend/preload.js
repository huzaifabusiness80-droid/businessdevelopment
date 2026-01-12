const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    loginUser: (credentials) => ipcRenderer.invoke('login', credentials),
    // Add other API methods here as needed for the other components
    getSales: () => ipcRenderer.invoke('get-sales'),
    addSale: (data) => ipcRenderer.invoke('add-sale', data),
});
