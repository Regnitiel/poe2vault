const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const https = require("https");

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

	// Only open dev tools if explicitly requested via environment variable
	if (process.env.OPEN_DEVTOOLS === "true") {
		win.webContents.openDevTools();
	}

	return win;
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
