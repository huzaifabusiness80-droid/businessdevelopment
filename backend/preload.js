console.log('Preload script starting...');
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Auth
    loginUser: (credentials) => ipcRenderer.invoke('login', credentials),

    // Company APIs
    getCompanies: () => ipcRenderer.invoke('get-companies'),
    getCompany: (companyId) => ipcRenderer.invoke('get-company', companyId),
    createCompany: (data) => ipcRenderer.invoke('create-company', data),
    updateCompany: (data) => ipcRenderer.invoke('update-company', data),
    deleteCompany: (id) => ipcRenderer.invoke('delete-company', id),

    // User APIs
    getUsers: (companyId) => ipcRenderer.invoke('get-users', companyId),
    createUser: (data) => ipcRenderer.invoke('create-user', data),
    updateUser: (data) => ipcRenderer.invoke('update-user', data),
    deleteUser: (id) => ipcRenderer.invoke('delete-user', id),

    // Role & Permission APIs
    getRoles: (companyId) => ipcRenderer.invoke('get-roles', companyId),
    createRole: (data) => ipcRenderer.invoke('create-role', data),
    updateRole: (data) => ipcRenderer.invoke('update-role', data),
    deleteRole: (id) => ipcRenderer.invoke('delete-role', id),
    getPermissions: (roleId) => ipcRenderer.invoke('get-permissions', roleId),

    // Audit Log APIs
    getAuditLogs: (params) => ipcRenderer.invoke('get-audit-logs', params),
    createAuditLog: (data) => ipcRenderer.invoke('create-audit-log', data),

    // Legacy APIs (for existing components)
    getSales: () => ipcRenderer.invoke('get-sales'),
    addSale: (data) => ipcRenderer.invoke('add-sale', data),
});
