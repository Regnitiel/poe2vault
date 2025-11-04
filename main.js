const { app, BrowserWindow, ipcMain, shell, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const https = require("https");

// Persistent config for chosen vault directory
const getConfigPath = () => path.join(app.getPath("userData"), "config.json");
const loadConfig = () => {
	try {
		const p = getConfigPath();
		if (fs.existsSync(p)) {
			return JSON.parse(fs.readFileSync(p, "utf8"));
		}
	} catch {}
	return {};
};
const saveConfig = (cfg) => {
	try {
		const p = getConfigPath();
		fs.mkdirSync(path.dirname(p), { recursive: true });
		fs.writeFileSync(p, JSON.stringify(cfg, null, 2));
	} catch (e) {
		console.error("Failed to save config:", e);
	}
};

const getDefaultDataPath = () =>
	path.join(app.getAppPath(), "defaultVaultData.json");

const readDefaultVaultData = () => {
	try {
		const p = getDefaultDataPath();
		const raw = fs.readFileSync(p, "utf8");
		return JSON.parse(raw);
	} catch (e) {
		console.error("Failed to read defaultVaultData.json:", e);
		return [];
	}
};

const ensureVaultDirSelection = async (browserWindow) => {
	let cfg = loadConfig();
	let vaultDir = cfg.vaultDir;

	// If no saved dir or it no longer exists, prompt user to choose a folder
	if (!vaultDir || !fs.existsSync(vaultDir)) {
		const result = await dialog.showOpenDialog(browserWindow || null, {
			title: "Choose a folder for your vaultData.json",
			message: "Select the folder where Vault App should store vaultData.json",
			properties: ["openDirectory", "createDirectory"],
		});

		if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
			// Fallback to a safe default in userData if user cancels
			vaultDir = path.join(app.getPath("userData"), "VaultData");
			fs.mkdirSync(vaultDir, { recursive: true });
		} else {
			vaultDir = result.filePaths[0];
		}

		cfg.vaultDir = vaultDir;
		saveConfig(cfg);
	}

	return vaultDir;
};

const getVaultFilePath = (vaultDir) => path.join(vaultDir, "vaultData.json");

// Merge rules: by name; if new item -> add; if exists -> update selected fields
const mergeWithDefaults = (currentItems, defaultItems) => {
	const byName = new Map();
	for (const item of currentItems || []) {
		byName.set((item.name || "").toLowerCase(), item);
	}

	for (const def of defaultItems || []) {
		const key = (def.name || "").toLowerCase();
		const existing = byName.get(key);
		if (!existing) {
			// New item -> add entire object from defaults
			byName.set(key, { ...def });
		} else {
			// Update only selected properties
			const updated = {
				...existing,
				base: def.base,
				league: def.league,
				obtainMethod: def.obtainMethod,
				bosses: def.bosses,
				special: def.special,
				disabled: def.disabled,
				imageLink: def.imageLink,
				wikiLink: def.wikiLink,
			};
			byName.set(key, updated);
		}
	}

	return Array.from(byName.values());
};

const ensureVaultFile = (vaultFilePath) => {
	const defaults = readDefaultVaultData();
	if (!fs.existsSync(path.dirname(vaultFilePath))) {
		fs.mkdirSync(path.dirname(vaultFilePath), { recursive: true });
	}

	if (!fs.existsSync(vaultFilePath)) {
		// Create from defaults
		fs.writeFileSync(vaultFilePath, JSON.stringify(defaults, null, 2));
		return defaults;
	}

	// Merge existing with defaults
	try {
		const currentRaw = fs.readFileSync(vaultFilePath, "utf8");
		const current = JSON.parse(currentRaw);
		const merged = mergeWithDefaults(current, defaults);
		fs.writeFileSync(vaultFilePath, JSON.stringify(merged, null, 2));
		return merged;
	} catch (e) {
		console.error("Failed merging vaultData.json with defaults:", e);
		// As a fallback, write defaults
		fs.writeFileSync(vaultFilePath, JSON.stringify(defaults, null, 2));
		return defaults;
	}
};

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

	// Only open dev tools if explicitly requested via environment variable
	if (process.env.OPEN_DEVTOOLS === "true") {
		win.webContents.openDevTools();
	}

	return win;
}

// IPC handlers for vault data operations
ipcMain.handle("load-vault-data", async (event) => {
	try {
		const win = BrowserWindow.fromWebContents(event.sender);
		const dir = await ensureVaultDirSelection(win);
		const filePath = getVaultFilePath(dir);
		const data = ensureVaultFile(filePath);
		return data;
	} catch (err) {
		console.error("Failed to load vaultData.json", err);
		return [];
	}
});

ipcMain.handle("save-vault-data", async (event, data) => {
	try {
		const win = BrowserWindow.fromWebContents(event.sender);
		const dir = await ensureVaultDirSelection(win);
		const filePath = getVaultFilePath(dir);
		fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
		return true;
	} catch (err) {
		console.error("Failed to save vaultData.json", err);
		throw err;
	}
});

// New: read current vault directory without prompting the user
ipcMain.handle("get-vault-directory", async () => {
	try {
		const cfg = loadConfig();
		const dir =
			cfg.vaultDir && fs.existsSync(cfg.vaultDir) ? cfg.vaultDir : null;
		return { dir, file: dir ? getVaultFilePath(dir) : null };
	} catch (e) {
		return { dir: null, file: null };
	}
});

// Helper to set and persist a chosen directory
const setVaultDirectory = (dir) => {
	if (!dir) throw new Error("Invalid directory");
	fs.mkdirSync(dir, { recursive: true });
	const cfg = { ...loadConfig(), vaultDir: dir };
	saveConfig(cfg);
	const filePath = getVaultFilePath(dir);
	const data = ensureVaultFile(filePath);
	return { dir, file: filePath, data };
};

// New: prompt user to choose a new directory and persist it
ipcMain.handle("choose-vault-directory", async (event) => {
	const win = BrowserWindow.fromWebContents(event.sender);
	const result = await dialog.showOpenDialog(win || null, {
		title: "Choose a folder for your vaultData.json",
		message: "Select the folder where Vault App should store vaultData.json",
		properties: ["openDirectory", "createDirectory"],
	});
	if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
		throw new Error("Directory selection canceled");
	}
	const chosen = result.filePaths[0];
	const { dir, file } = setVaultDirectory(chosen);
	return { dir, file };
});

// Optional: allow directly setting a directory from a provided path
ipcMain.handle("set-vault-directory", async (event, dir) => {
	const { dir: savedDir, file } = setVaultDirectory(dir);
	return { dir: savedDir, file };
});

ipcMain.handle("open-external", async (event, url) => {
	shell.openExternal(url);
});

// Minimal manual update check via GitHub Releases API
ipcMain.handle("check-for-updates", async () => {
	const repo = "Regnitiel/poe2vault";
	const options = {
		hostname: "api.github.com",
		path: `/repos/${repo}/releases/latest`,
		method: "GET",
		headers: {
			"User-Agent": `VaultApp/${app.getVersion()} (Electron)`,
			Accept: "application/vnd.github.v3+json",
			"Cache-Control": "no-cache",
		},
		timeout: 15000,
	};

	const fetchLatest = () =>
		new Promise((resolve, reject) => {
			const req = https.request(options, (res) => {
				let data = "";
				if (res.statusCode !== 200) {
					return reject(new Error(`HTTP ${res.statusCode}`));
				}
				res.on("data", (c) => (data += c));
				res.on("end", () => {
					try {
						resolve(JSON.parse(data));
					} catch (e) {
						reject(e);
					}
				});
			});
			req.on("error", reject);
			req.on("timeout", () => {
				req.destroy();
				reject(new Error("timeout"));
			});
			req.end();
		});

	try {
		const release = await fetchLatest();
		const latestTag = (release.tag_name || "").replace(/^v/, "");
		const current = (require("./package.json").version || "").replace(/^v/, "");
		const cmp = (a, b) => {
			const pa = a.split(".").map((n) => parseInt(n, 10));
			const pb = b.split(".").map((n) => parseInt(n, 10));
			for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
				const x = pa[i] || 0;
				const y = pb[i] || 0;
				if (x > y) return 1;
				if (x < y) return -1;
			}
			return 0;
		};
		const newer = cmp(latestTag, current) > 0;
		if (newer) {
			// Find platform asset
			const platform =
				process.platform === "darwin"
					? "VaultApp-macOS.zip"
					: "VaultApp-Windows.zip";
			const asset = (release.assets || []).find((a) => a.name === platform);
			return {
				status: "available",
				version: release.tag_name,
				url: asset ? asset.browser_download_url : release.html_url,
				releaseNotes: release.body || "",
			};
		}
		return { status: "up-to-date", version: release.tag_name };
	} catch (err) {
		return { status: "error", error: err.message };
	}
});

ipcMain.handle("get-current-version", async () => {
	return require("./package.json").version;
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
