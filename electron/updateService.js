const { net, shell, dialog } = require("electron");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

class UpdateService {
	constructor(mainWindow) {
		this.mainWindow = mainWindow;
		this.currentVersion = require("../package.json").version;
		this.githubRepo = "Regnitiel/poe2vault"; // Update this to your actual repo
		this.updateInfo = null;
		this.downloadProgress = 0;
	}

	async checkForUpdates() {
		try {
			console.log("Checking for updates...");
			this.mainWindow.webContents.send("update-status", { status: "checking" });

			const latestRelease = await this.getLatestRelease();

			if (!latestRelease || !latestRelease.tag_name) {
				console.log("No release information found");
				this.mainWindow.webContents.send("update-status", {
					status: "up-to-date",
				});
				return false;
			}

			if (this.isNewerVersion(latestRelease.tag_name, this.currentVersion)) {
				this.updateInfo = {
					version: latestRelease.tag_name,
					releaseNotes: latestRelease.body || "No release notes available",
					downloadUrl: this.getDownloadUrl(latestRelease),
				};

				this.mainWindow.webContents.send("update-available", this.updateInfo);
				return true;
			} else {
				this.mainWindow.webContents.send("update-status", {
					status: "up-to-date",
				});
				return false;
			}
		} catch (error) {
			console.error("Error checking for updates:", error);
			this.mainWindow.webContents.send("update-error", error.message);
			return false;
		}
	}

	async getLatestRelease() {
		return new Promise((resolve, reject) => {
			const request = net.request(
				`https://api.github.com/repos/${this.githubRepo}/releases/latest`
			);

			request.on("response", (response) => {
				let data = "";

				if (response.statusCode === 404) {
					reject(new Error("Repository not found or no releases available"));
					return;
				}

				if (response.statusCode !== 200) {
					reject(
						new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`)
					);
					return;
				}

				response.on("data", (chunk) => {
					data += chunk;
				});

				response.on("end", () => {
					try {
						const release = JSON.parse(data);
						resolve(release);
					} catch (error) {
						reject(new Error("Failed to parse release data"));
					}
				});
			});

			request.on("error", (error) => {
				reject(error);
			});

			request.end();
		});
	}

	getDownloadUrl(release) {
		const platform = process.platform;
		let assetName;

		if (platform === "darwin") {
			assetName = "VaultApp-macOS.zip";
		} else if (platform === "win32") {
			assetName = "VaultApp-Windows.zip";
		} else {
			throw new Error("Unsupported platform for auto-update");
		}

		const asset = release.assets.find((asset) => asset.name === assetName);
		if (!asset) {
			throw new Error(`No asset found for platform: ${platform}`);
		}

		return asset.download_url;
	}

	isNewerVersion(latest, current) {
		// Handle null or undefined values
		if (!latest || !current) {
			return false;
		}

		// Remove 'v' prefix if present
		const latestClean = latest.replace(/^v/, "");
		const currentClean = current.replace(/^v/, "");

		const latestParts = latestClean.split(".").map(Number);
		const currentParts = currentClean.split(".").map(Number);

		for (
			let i = 0;
			i < Math.max(latestParts.length, currentParts.length);
			i++
		) {
			const latestPart = latestParts[i] || 0;
			const currentPart = currentParts[i] || 0;

			if (latestPart > currentPart) return true;
			if (latestPart < currentPart) return false;
		}

		return false;
	}

	async downloadAndInstallUpdate() {
		try {
			this.mainWindow.webContents.send("update-status", {
				status: "downloading",
			});

			const downloadPath = path.join(__dirname, "..", "temp", "update.zip");
			const tempDir = path.dirname(downloadPath);

			// Create temp directory if it doesn't exist
			if (!fs.existsSync(tempDir)) {
				fs.mkdirSync(tempDir, { recursive: true });
			}

			await this.downloadFile(this.updateInfo.downloadUrl, downloadPath);

			this.mainWindow.webContents.send("update-status", {
				status: "installing",
			});

			// For now, we'll just open the download location
			// In a production app, you'd want to handle the installation process
			await shell.showItemInFolder(downloadPath);

			// Show dialog to user
			const result = await dialog.showMessageBox(this.mainWindow, {
				type: "info",
				title: "Update Downloaded",
				message:
					"The update has been downloaded. Please manually install it by replacing the current application.",
				buttons: ["OK"],
			});

			this.mainWindow.webContents.send("update-status", {
				status: "downloaded",
			});
		} catch (error) {
			console.error("Error downloading update:", error);
			this.mainWindow.webContents.send("update-error", error.message);
		}
	}

	async downloadFile(url, downloadPath) {
		return new Promise((resolve, reject) => {
			const request = net.request(url);
			const file = fs.createWriteStream(downloadPath);
			let totalBytes = 0;
			let downloadedBytes = 0;

			request.on("response", (response) => {
				totalBytes = parseInt(response.headers["content-length"]) || 0;

				response.on("data", (chunk) => {
					file.write(chunk);
					downloadedBytes += chunk.length;

					if (totalBytes > 0) {
						const progress = Math.round((downloadedBytes / totalBytes) * 100);
						this.mainWindow.webContents.send("update-progress", { progress });
					}
				});

				response.on("end", () => {
					file.end();
					resolve();
				});
			});

			request.on("error", (error) => {
				file.destroy();
				reject(error);
			});

			file.on("error", (error) => {
				reject(error);
			});

			request.end();
		});
	}

	async startUpdateCheck() {
		// Wait a bit after app startup before checking
		setTimeout(() => {
			this.checkForUpdates();
		}, 3000);
	}
}

module.exports = UpdateService;
