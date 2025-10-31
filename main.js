const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const fs = require("fs");

const vaultFilePath =
	process.platform === "darwin"
		? path.join(
				process.env.HOME,
				"Library/CloudStorage/GoogleDrive-b.morosan94@gmail.com",
				"My Drive",
				"POE",
				"vaultData.json"
		  )
		: path.join("G:", "My Drive", "POE", "vaultData.json");

function createWindow() {
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			webSecurity: false, // Allow loading from localhost in development
			preload: path.join(__dirname, "electron", "preload.js"),
		},
	});

	// Load from dist files in production, webpack dev server in development
	const isDev = process.env.NODE_ENV === "development";

	if (isDev) {
		console.log("Loading URL: http://localhost:3000");
		win.loadURL("http://localhost:3000").catch((err) => {
			console.error("Failed to load URL:", err);
		});
	} else {
		const distPath = path.join(__dirname, "dist", "index.html");
		console.log("Loading file:", distPath);
		win.loadFile(distPath).catch((err) => {
			console.error("Failed to load file:", err);
		});
	}

	// Add event listeners for debugging
	win.webContents.on(
		"did-fail-load",
		(event, errorCode, errorDescription, validatedURL) => {
			console.error(
				"Failed to load:",
				errorCode,
				errorDescription,
				validatedURL
			);
		}
	);

	win.webContents.on("did-finish-load", () => {
		console.log("Page loaded successfully");
	});

	win.webContents.openDevTools();
}

// IPC handlers for vault data operations
ipcMain.handle("load-vault-data", async () => {
	try {
		const data = fs.readFileSync(vaultFilePath, "utf8");
		return JSON.parse(data);
	} catch (err) {
		console.error("Failed to load vaultData.json", err);
		return [];
	}
});

ipcMain.handle("save-vault-data", async (event, data) => {
	try {
		fs.writeFileSync(vaultFilePath, JSON.stringify(data, null, 2));
		return true;
	} catch (err) {
		console.error("Failed to save vaultData.json", err);
		throw err;
	}
});

ipcMain.handle("open-external", async (event, url) => {
	shell.openExternal(url);
});

app.whenReady().then(() => {
	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
