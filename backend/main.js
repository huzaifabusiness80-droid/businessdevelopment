const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const db = require("./database/db_manager");

// IPC Handlers
ipcMain.handle("login", (event, { username, password }) => {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT id, company_id, username, role, fullname FROM users WHERE username = ? AND password = ? AND is_active = 1",
            [username, password],
            (err, user) => {
                if (err) {
                    reject(err);
                } else if (user) {
                    resolve({ success: true, user });
                } else {
                    resolve({ success: false, message: "Invalid username or password" });
                }
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
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    if (app.isPackaged) {
        win.loadFile(path.join(__dirname, "renderer/build/index.html"));
    } else {
        win.loadURL("http://localhost:3000");
    }
}

app.whenReady().then(createWindow);
