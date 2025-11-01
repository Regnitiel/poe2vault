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
		this.checkTimeout = null;
		this.isChecking = false;

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

		// Enable logging for debugging
		autoUpdater.logger = require("electron-log");
		autoUpdater.logger.transports.file.level = "info";

		console.log("AutoUpdater configured for GitHub releases");
		console.log("App version:", app.getVersion());
		console.log("App is packaged:", app.isPackaged);
	}

	setupEventListeners() {
		// When checking for updates
		autoUpdater.on("checking-for-update", () => {
			console.log("📡 Event: checking-for-update");
			this.mainWindow.webContents.send("update-status", { status: "checking" });
		});

		// When update available
		autoUpdater.on("update-available", (info) => {
			console.log("✅ Event: update-available - Version:", info.version);
			this.isChecking = false;
			if (this.checkTimeout) {
				clearTimeout(this.checkTimeout);
				this.checkTimeout = null;
			}
			this.updateInfo = {
				version: info.version,
				releaseNotes: info.releaseNotes || "No release notes available",
				downloadUrl: null, // electron-updater handles this internally
			};
			this.mainWindow.webContents.send("update-available", this.updateInfo);
		});

		// When no update available
		autoUpdater.on("update-not-available", (info) => {
			console.log("✅ Event: update-not-available - App is up to date");
			this.isChecking = false;
			if (this.checkTimeout) {
				clearTimeout(this.checkTimeout);
				this.checkTimeout = null;
			}
			this.mainWindow.webContents.send("update-status", {
				status: "up-to-date",
			});
		});

		// Download progress
		autoUpdater.on("download-progress", (progressObj) => {
			const progress = Math.round(progressObj.percent);
			console.log(`⬇️  Download progress: ${progress}%`);
			this.mainWindow.webContents.send("update-progress", { progress });
		});

		// When update downloaded
		autoUpdater.on("update-downloaded", (info) => {
			console.log("✅ Event: update-downloaded - Version:", info.version);
			this.isChecking = false;
			if (this.checkTimeout) {
				clearTimeout(this.checkTimeout);
				this.checkTimeout = null;
			}
			this.mainWindow.webContents.send("update-status", {
				status: "downloaded",
			});

			// Show dialog asking user to restart
			this.promptForRestart();
		});

		// Error handling
		autoUpdater.on("error", (error) => {
			console.error("❌ Event: error");
			console.error("AutoUpdater error:", error);
			console.error("Error details:", error.message);
			if (error.stack) {
				console.error("Error stack:", error.stack);
			}
			this.isChecking = false;
			if (this.checkTimeout) {
				clearTimeout(this.checkTimeout);
				this.checkTimeout = null;
			}

			// For automatic checks, just log the error silently
			if (!this.isManualCheck) {
				console.log("Auto check failed, setting status to up-to-date");
				this.mainWindow.webContents.send("update-status", {
					status: "up-to-date",
				});
			} else {
				// For manual checks, show the error to user
				const errorMessage = error.message || "Unknown error occurred";
				console.log(
					"Manual check failed, sending error to renderer:",
					errorMessage
				);
				this.mainWindow.webContents.send(
					"update-error",
					`Failed to check for updates: ${errorMessage}`
				);
			}
		});
	}

	async checkForUpdates() {
		try {
			// Skip if not packaged (development mode)
			if (!app.isPackaged) {
				console.log(
					"Skipping update check - app is not packaged (development mode)"
				);
				this.mainWindow.webContents.send("update-status", {
					status: "up-to-date",
				});
				return;
			}

			// Prevent concurrent checks
			if (this.isChecking) {
				console.log("Update check already in progress, skipping...");
				return;
			}

			this.isChecking = true;
			this.isManualCheck = false; // This is an automatic check
			console.log("🔄 Auto update check started");
			console.log("Current app version:", app.getVersion());

			// Set a timeout to prevent hanging (30 seconds)
			this.checkTimeout = setTimeout(() => {
				console.log("⚠️ TIMEOUT: Auto update check timed out after 30 seconds");
				this.isChecking = false;
				if (this.checkTimeout) {
					clearTimeout(this.checkTimeout);
					this.checkTimeout = null;
				}
				this.mainWindow.webContents.send("update-status", {
					status: "up-to-date",
				});
			}, 30000);

			console.log("Calling autoUpdater.checkForUpdates()...");
			const result = await autoUpdater.checkForUpdates();
			console.log("Auto checkForUpdates() result:", result);
		} catch (error) {
			console.error("❌ Error in checkForUpdates:", error);
			console.error("Error stack:", error.stack);
			this.isChecking = false;
			if (this.checkTimeout) {
				clearTimeout(this.checkTimeout);
				this.checkTimeout = null;
			}
			this.mainWindow.webContents.send("update-status", {
				status: "up-to-date",
			});
		}
	}

	async checkForUpdatesManual() {
		try {
			// Allow manual checks even in dev mode for testing
			if (!app.isPackaged) {
				console.log("Manual update check in development mode");
				this.mainWindow.webContents.send(
					"update-error",
					"Updates are only available for packaged applications. You're running in development mode."
				);
				return;
			}

			// Prevent concurrent checks
			if (this.isChecking) {
				console.log("Update check already in progress, please wait...");
				return;
			}

			this.isChecking = true;
			this.isManualCheck = true; // This is a manual check
			console.log("Manual update check requested...");
			console.log("Current app version:", app.getVersion());
			console.log("Feed URL:", {
				provider: "github",
				owner: "Regnitiel",
				repo: "poe2vault",
			});

			// Set a timeout to prevent hanging (45 seconds for manual checks)
			this.checkTimeout = setTimeout(() => {
				console.log(
					"⚠️ TIMEOUT: Manual update check timed out after 45 seconds"
				);
				this.isChecking = false;
				if (this.checkTimeout) {
					clearTimeout(this.checkTimeout);
					this.checkTimeout = null;
				}
				this.mainWindow.webContents.send(
					"update-error",
					"Update check timed out. Please check your internet connection and try again."
				);
			}, 45000);

			console.log("Calling autoUpdater.checkForUpdates()...");
			const result = await autoUpdater.checkForUpdates();
			console.log("checkForUpdates() result:", result);
		} catch (error) {
			console.error("❌ Error in checkForUpdatesManual:", error);
			console.error("Error stack:", error.stack);
			this.isChecking = false;
			if (this.checkTimeout) {
				clearTimeout(this.checkTimeout);
				this.checkTimeout = null;
			}
			this.mainWindow.webContents.send(
				"update-error",
				error.message || "Unknown error occurred while checking for updates"
			);
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
