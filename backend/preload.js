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

    // Inventory APIs
    getBrands: (companyId) => ipcRenderer.invoke('get-brands', companyId),
    createBrand: (data) => ipcRenderer.invoke('create-brand', data),
    updateBrand: (data) => ipcRenderer.invoke('update-brand', data),
    deleteBrand: (id) => ipcRenderer.invoke('delete-brand', id),

    getCategories: (companyId) => ipcRenderer.invoke('get-categories', companyId),
    createCategory: (data) => ipcRenderer.invoke('create-category', data),
    updateCategory: (data) => ipcRenderer.invoke('update-category', data),
    deleteCategory: (id) => ipcRenderer.invoke('delete-category', id),

    getProducts: (companyId) => ipcRenderer.invoke('get-products', companyId),
    createProduct: (data) => ipcRenderer.invoke('create-product', data),
    updateProduct: (data) => ipcRenderer.invoke('update-product', data),
    deleteProduct: (id) => ipcRenderer.invoke('delete-product', id),

    // Audit Log APIs
    getAuditLogs: (params) => ipcRenderer.invoke('get-audit-logs', params),
    createAuditLog: (data) => ipcRenderer.invoke('create-audit-log', data),

    // Legacy APIs (for existing components)
    getSales: () => ipcRenderer.invoke('get-sales'),
    addSale: (data) => ipcRenderer.invoke('add-sale', data),
});
