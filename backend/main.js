const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const db = require("./database/db_manager");
const syncService = require("./services/sync_service");

// IPC Handlers
ipcMain.handle("trigger-sync", async () => {
    try {
        await syncService.syncData();
        return { success: true, message: "Sync completed" };
    } catch (error) {
        return { success: false, message: error.message };
    }
});

ipcMain.handle("login", (event, { username, password }) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT u.id, u.company_id, u.username, u.role, u.fullname, u.is_active,
                    c.name as company_name, r.id as role_id, r.name as role_name
             FROM users u
             LEFT JOIN companies c ON u.company_id = c.id
             LEFT JOIN roles r ON r.name = u.role AND (r.company_id = u.company_id OR r.company_id IS NULL)
             WHERE u.username = ? AND u.password = ? AND u.is_active = 1`,
            [username, password],
            (err, user) => {
                if (err) {
                    reject(err);
                } else if (user) {
                    // Get permissions for this user's role
                    db.all(
                        `SELECT module, can_view, can_create, can_edit, can_delete 
                         FROM permissions WHERE role_id = ?`,
                        [user.role_id],
                        (err, permissions) => {
                            if (err) {
                                resolve({ success: true, user, permissions: [] });
                            } else {
                                resolve({ success: true, user, permissions });
                            }
                        }
                    );
                } else {
                    resolve({ success: false, message: "Invalid username or password" });
                }
            }
        );
    });
});

// ============ COMPANY HANDLERS ============
ipcMain.handle("get-companies", (event) => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM companies ORDER BY created_at DESC", (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
});

ipcMain.handle("get-company", (event, companyId) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM companies WHERE id = ?", [companyId], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
});

ipcMain.handle("create-company", (event, data) => {
    return new Promise((resolve, reject) => {
        const { name, address, phone, email, tax_no, currency_symbol } = data;
        db.run(
            `INSERT INTO companies (name, address, phone, email, tax_no, currency_symbol) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, address, phone, email, tax_no, currency_symbol || 'PKR'],
            function (err) {
                if (err) reject(err);
                else resolve({ success: true, id: this.lastID });
            }
        );
    });
});

ipcMain.handle("update-company", (event, data) => {
    return new Promise((resolve, reject) => {
        const { id, name, address, phone, email, tax_no, currency_symbol, is_active } = data;
        db.run(
            `UPDATE companies SET name = ?, address = ?, phone = ?, email = ?, 
             tax_no = ?, currency_symbol = ?, is_active = ? WHERE id = ?`,
            [name, address, phone, email, tax_no, currency_symbol, is_active ?? 1, id],
            function (err) {
                if (err) reject(err);
                else resolve({ success: true, changes: this.changes });
            }
        );
    });
});

ipcMain.handle("delete-company", (event, id) => {
    return new Promise((resolve, reject) => {
        db.run("UPDATE companies SET is_active = 0 WHERE id = ?", [id], function (err) {
            if (err) reject(err);
            else resolve({ success: true, changes: this.changes });
        });
    });
});

// ============ USER HANDLERS ============
ipcMain.handle("get-users", (event, companyId) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT u.*, c.name as company_name 
                     FROM users u 
                     LEFT JOIN companies c ON u.company_id = c.id`;
        let params = [];

        if (companyId) {
            query += " WHERE u.company_id = ?";
            params.push(companyId);
        }
        query += " ORDER BY u.created_at DESC";

        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
});

ipcMain.handle("create-user", (event, data) => {
    return new Promise((resolve, reject) => {
        const { company_id, username, password, role, fullname } = data;
        db.run(
            `INSERT INTO users (company_id, username, password, role, fullname) 
             VALUES (?, ?, ?, ?, ?)`,
            [company_id, username, password, role, fullname],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        resolve({ success: false, message: 'Username already exists' });
                    } else {
                        reject(err);
                    }
                } else {
                    resolve({ success: true, id: this.lastID });
                }
            }
        );
    });
});

ipcMain.handle("update-user", (event, data) => {
    return new Promise((resolve, reject) => {
        const { id, company_id, username, password, role, fullname, is_active } = data;

        // If password is provided, update it; otherwise keep existing
        if (password) {
            db.run(
                `UPDATE users SET company_id = ?, username = ?, password = ?, 
                 role = ?, fullname = ?, is_active = ? WHERE id = ?`,
                [company_id, username, password, role, fullname, is_active ?? 1, id],
                function (err) {
                    if (err) reject(err);
                    else resolve({ success: true, changes: this.changes });
                }
            );
        } else {
            db.run(
                `UPDATE users SET company_id = ?, username = ?, role = ?, 
                 fullname = ?, is_active = ? WHERE id = ?`,
                [company_id, username, role, fullname, is_active ?? 1, id],
                function (err) {
                    if (err) reject(err);
                    else resolve({ success: true, changes: this.changes });
                }
            );
        }
    });
});

ipcMain.handle("delete-user", (event, id) => {
    return new Promise((resolve, reject) => {
        db.run("UPDATE users SET is_active = 0 WHERE id = ?", [id], function (err) {
            if (err) reject(err);
            else resolve({ success: true, changes: this.changes });
        });
    });
});

// ============ ROLE HANDLERS ============
ipcMain.handle("get-roles", (event, companyId) => {
    return new Promise((resolve, reject) => {
        // Get system roles and company-specific roles
        db.all(
            `SELECT * FROM roles 
             WHERE company_id IS NULL OR company_id = ? 
             ORDER BY is_system DESC, name ASC`,
            [companyId],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
});

ipcMain.handle("create-role", (event, data) => {
    return new Promise((resolve, reject) => {
        const { company_id, name, description, permissions } = data;
        db.run(
            `INSERT INTO roles (company_id, name, description, is_system) VALUES (?, ?, ?, 0)`,
            [company_id, name, description],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    const roleId = this.lastID;
                    // Insert permissions for this role
                    if (permissions && permissions.length > 0) {
                        const stmt = db.prepare(
                            `INSERT INTO permissions (role_id, module, can_view, can_create, can_edit, can_delete) 
                             VALUES (?, ?, ?, ?, ?, ?)`
                        );
                        permissions.forEach(p => {
                            stmt.run(roleId, p.module, p.can_view, p.can_create, p.can_edit, p.can_delete);
                        });
                        stmt.finalize();
                    }
                    resolve({ success: true, id: roleId });
                }
            }
        );
    });
});

ipcMain.handle("update-role", (event, data) => {
    return new Promise((resolve, reject) => {
        const { id, name, description, permissions } = data;
        db.run(
            `UPDATE roles SET name = ?, description = ? WHERE id = ? AND is_system = 0`,
            [name, description, id],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    // Update permissions: delete old and insert new
                    db.run("DELETE FROM permissions WHERE role_id = ?", [id], (delErr) => {
                        if (permissions && permissions.length > 0) {
                            const stmt = db.prepare(
                                `INSERT INTO permissions (role_id, module, can_view, can_create, can_edit, can_delete) 
                                 VALUES (?, ?, ?, ?, ?, ?)`
                            );
                            permissions.forEach(p => {
                                stmt.run(id, p.module, p.can_view, p.can_create, p.can_edit, p.can_delete);
                            });
                            stmt.finalize();
                        }
                        resolve({ success: true, changes: this.changes });
                    });
                }
            }
        );
    });
});

ipcMain.handle("delete-role", (event, id) => {
    return new Promise((resolve, reject) => {
        // Only delete non-system roles
        db.run("DELETE FROM roles WHERE id = ? AND is_system = 0", [id], function (err) {
            if (err) reject(err);
            else resolve({ success: true, changes: this.changes });
        });
    });
});

ipcMain.handle("get-permissions", (event, roleId) => {
    return new Promise((resolve, reject) => {
        db.all(
            "SELECT * FROM permissions WHERE role_id = ?",
            [roleId],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
});

// ============ AUDIT LOG HANDLERS ============
ipcMain.handle("get-audit-logs", (event, { companyId, limit = 50 }) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT a.*, u.username, u.fullname 
                     FROM audit_logs a 
                     LEFT JOIN users u ON a.user_id = u.id`;
        let params = [];

        if (companyId) {
            query += " WHERE a.company_id = ?";
            params.push(companyId);
        }
        query += " ORDER BY a.created_at DESC LIMIT ?";
        params.push(limit);

        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
});

ipcMain.handle("create-audit-log", (event, data) => {
    return new Promise((resolve, reject) => {
        const { company_id, user_id, action, module, details } = data;
        db.run(
            `INSERT INTO audit_logs (company_id, user_id, action, module, details) 
             VALUES (?, ?, ?, ?, ?)`,
            [company_id, user_id, action, module, details],
            function (err) {
                if (err) reject(err);
                else resolve({ success: true, id: this.lastID });
            }
        );
    });
});

// Old handlers - TODO: Update these for new schema
ipcMain.handle("get-sales", () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM sales", (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
});

ipcMain.handle("add-sale", (event, data) => {
    // TODO: Update for new schema
    return { status: "ok" };
});

// Create window
function createWindow() {
    console.log("Preload path:", path.join(__dirname, "preload.js"));
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false // Try disabling sandbox temporarily to rule it out
        },
    });

    if (app.isPackaged) {
        win.loadFile(path.join(__dirname, "renderer/build/index.html"));
    } else {
        win.loadURL("http://localhost:3000");
    }
}

app.whenReady().then(createWindow);
