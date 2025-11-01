let autoUpdater;

try {
	const { autoUpdater: electronUpdater } = require("electron-updater");
	autoUpdater = electronUpdater;
} catch (error) {
	console.warn("electron-updater not available, using fallback");
	// Create a fallback object with the same interface
	autoUpdater = {
		setFeedURL: () => {},
		checkForUpdates: () => Promise.resolve(),
		downloadUpdate: () => Promise.resolve(),
		quitAndInstall: () => {},
		on: () => {},
		autoDownload: false,
		autoInstallOnAppQuit: true,
	};
}

const { app, dialog } = require("electron");

class AutoUpdaterService {
	constructor(mainWindow) {
		this.mainWindow = mainWindow;
		this.updateInfo = null;

		// Configure electron-updater for GitHub
		autoUpdater.setFeedURL({
			provider: "github",
			owner: "Regnitiel",
			repo: "poe2vault",
			private: false,
		});

		// Set up event listeners
		this.setupEventListeners();

		// Configure auto updater settings
		autoUpdater.autoDownload = false; // Don't auto-download, ask user first
		autoUpdater.autoInstallOnAppQuit = true;

		console.log("AutoUpdater configured for GitHub releases");
	}

	setupEventListeners() {
		// When checking for updates
		autoUpdater.on("checking-for-update", () => {
			console.log("Checking for updates...");
			this.mainWindow.webContents.send("update-status", { status: "checking" });
		});

		// When update available
		autoUpdater.on("update-available", (info) => {
			console.log("Update available:", info.version);
			this.updateInfo = {
				version: info.version,
				releaseNotes: info.releaseNotes || "No release notes available",
				downloadUrl: null, // electron-updater handles this internally
			};
			this.mainWindow.webContents.send("update-available", this.updateInfo);
		});

		// When no update available
		autoUpdater.on("update-not-available", (info) => {
			console.log("App is up to date");
			this.mainWindow.webContents.send("update-status", {
				status: "up-to-date",
			});
		});

		// Download progress
		autoUpdater.on("download-progress", (progressObj) => {
			const progress = Math.round(progressObj.percent);
			console.log(`Download progress: ${progress}%`);
			this.mainWindow.webContents.send("update-progress", { progress });
		});

		// When update downloaded
		autoUpdater.on("update-downloaded", (info) => {
			console.log("Update downloaded:", info.version);
			this.mainWindow.webContents.send("update-status", {
				status: "downloaded",
			});

			// Show dialog asking user to restart
			this.promptForRestart();
		});

		// Error handling
		autoUpdater.on("error", (error) => {
			console.error("AutoUpdater error:", error);

			// For automatic checks, just log the error silently
			if (!this.isManualCheck) {
				this.mainWindow.webContents.send("update-status", {
					status: "up-to-date",
				});
			} else {
				// For manual checks, show the error to user
				this.mainWindow.webContents.send("update-error", error.message);
			}
		});
	}

	async checkForUpdates() {
		try {
			this.isManualCheck = false; // This is an automatic check
			await autoUpdater.checkForUpdates();
		} catch (error) {
			console.error("Error checking for updates:", error);
			this.mainWindow.webContents.send("update-status", {
				status: "up-to-date",
			});
		}
	}

	async checkForUpdatesManual() {
		try {
			this.isManualCheck = true; // This is a manual check
			console.log("Manual update check requested...");
			await autoUpdater.checkForUpdates();
		} catch (error) {
			console.error("Error checking for updates:", error);
			this.mainWindow.webContents.send("update-error", error.message);
		}
	}

	async downloadAndInstallUpdate() {
		try {
			console.log("Starting update download...");
			this.mainWindow.webContents.send("update-status", {
				status: "downloading",
			});

			// Download the update
			await autoUpdater.downloadUpdate();
		} catch (error) {
			console.error("Error downloading update:", error);
			this.mainWindow.webContents.send("update-error", error.message);
		}
	}

	async promptForRestart() {
		const result = await dialog.showMessageBox(this.mainWindow, {
			type: "info",
			title: "Update Ready",
			message:
				"Update downloaded successfully. Restart now to apply the update?",
			buttons: ["Restart Now", "Later"],
			defaultId: 0,
		});

		if (result.response === 0) {
			// User clicked "Restart Now"
			autoUpdater.quitAndInstall();
		}
	}

	async startUpdateCheck() {
		// Wait a bit after app startup before checking
		setTimeout(() => {
			this.checkForUpdates();
		}, 3000);
	}
}

module.exports = AutoUpdaterService;
