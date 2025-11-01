const { net, shell, dialog } = require("electron");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");
const https = require("https");

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

			// Try Electron net module first, fallback to Node.js https
			let latestRelease;
			try {
				latestRelease = await this.getLatestRelease();
			} catch (electronError) {
				console.log("Electron net module failed, trying Node.js fallback:", electronError.message);
				latestRelease = await this.getLatestReleaseNodejs();
			}

			if (!latestRelease || !latestRelease.tag_name) {
				console.log("No release information found");
				this.mainWindow.webContents.send("update-status", {
					status: "up-to-date",
				});
				return false;
			}

			console.log(
				`Current version: ${this.currentVersion}, Latest version: ${latestRelease.tag_name}`
			);

			if (this.isNewerVersion(latestRelease.tag_name, this.currentVersion)) {
				this.updateInfo = {
					version: latestRelease.tag_name,
					releaseNotes: latestRelease.body || "No release notes available",
					downloadUrl: this.getDownloadUrl(latestRelease),
				};

				console.log("Update available:", this.updateInfo.version);
				this.mainWindow.webContents.send("update-available", this.updateInfo);
				return true;
			} else {
				console.log("App is up to date");
				this.mainWindow.webContents.send("update-status", {
					status: "up-to-date",
				});
				return false;
			}
		} catch (error) {
			console.error("Error checking for updates:", error);
			// Don't send error to UI for automatic checks to avoid annoying users
			// Only log the error and mark as up-to-date
			this.mainWindow.webContents.send("update-status", {
				status: "up-to-date",
			});
			return false;
		}
	}

	// Manual update check that shows errors to user
	async checkForUpdatesManual() {
		try {
			console.log("Manual update check requested...");
			this.mainWindow.webContents.send("update-status", { status: "checking" });

			// Try Electron net module first, fallback to Node.js https
			let latestRelease;
			try {
				latestRelease = await this.getLatestRelease();
			} catch (electronError) {
				console.log("Electron net module failed, trying Node.js fallback:", electronError.message);
				latestRelease = await this.getLatestReleaseNodejs();
			}

			if (!latestRelease || !latestRelease.tag_name) {
				console.log("No release information found");
				this.mainWindow.webContents.send("update-status", {
					status: "up-to-date",
				});
				return false;
			}

			console.log(
				`Current version: ${this.currentVersion}, Latest version: ${latestRelease.tag_name}`
			);

			if (this.isNewerVersion(latestRelease.tag_name, this.currentVersion)) {
				this.updateInfo = {
					version: latestRelease.tag_name,
					releaseNotes: latestRelease.body || "No release notes available",
					downloadUrl: this.getDownloadUrl(latestRelease),
				};

				console.log("Update available:", this.updateInfo.version);
				this.mainWindow.webContents.send("update-available", this.updateInfo);
				return true;
			} else {
				console.log("App is up to date");
				this.mainWindow.webContents.send("update-status", {
					status: "up-to-date",
				});
				return false;
			}
		} catch (error) {
			console.error("Error checking for updates:", error);
			// For manual checks, show the error to the user
			this.mainWindow.webContents.send("update-error", error.message);
			return false;
		}
	}

	async getLatestRelease() {
		return new Promise((resolve, reject) => {
			const url = `https://api.github.com/repos/${this.githubRepo}/releases/latest`;
			console.log("Fetching latest release from:", url);

			const request = net.request({
				url: url,
				method: 'GET',
				// Add headers that might help with Windows networking
				headers: {
					'User-Agent': 'VaultApp/1.0.2 (Electron)',
					'Accept': 'application/vnd.github.v3+json',
					'Cache-Control': 'no-cache'
				}
			});

			// Set a timeout for the request
			const timeout = setTimeout(() => {
				console.log("Request timeout - destroying request");
				request.destroy();
				reject(new Error("Request timeout - check your internet connection"));
			}, 15000); // Increased to 15 second timeout for Windows

			request.on("response", (response) => {
				clearTimeout(timeout);
				let data = "";

				console.log(`GitHub API response status: ${response.statusCode}`);
				console.log(`Response headers:`, response.headers);

				if (response.statusCode === 404) {
					reject(new Error("Repository not found or no releases available"));
					return;
				}

				if (response.statusCode === 403) {
					reject(
						new Error("GitHub API rate limit exceeded. Please try again later.")
					);
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
						console.log("Successfully fetched release data");
						resolve(release);
					} catch (error) {
						console.error("Failed to parse JSON:", error);
						reject(new Error("Failed to parse release data"));
					}
				});

				response.on("error", (error) => {
					console.error("Response error:", error);
					reject(new Error(`Response error: ${error.message}`));
				});
			});

			request.on("error", (error) => {
				clearTimeout(timeout);
				console.error("Network error:", error);
				console.error("Error details:", {
					code: error.code,
					errno: error.errno,
					syscall: error.syscall,
					hostname: error.hostname,
					port: error.port
				});
				
				// Provide more helpful error messages for common Windows issues
				let errorMessage = `Network error: ${error.message}`;
				if (error.code === 'ENOTFOUND') {
					errorMessage = "DNS resolution failed. Check your internet connection and DNS settings.";
				} else if (error.code === 'ECONNREFUSED') {
					errorMessage = "Connection refused. This might be due to firewall or proxy settings.";
				} else if (error.code === 'ETIMEDOUT') {
					errorMessage = "Connection timed out. Check your internet connection.";
				} else if (error.code === 'ECONNRESET') {
					errorMessage = "Connection was reset. This might be due to network or proxy issues.";
				}
				
				reject(new Error(errorMessage));
			});

			request.on("abort", () => {
				clearTimeout(timeout);
				console.log("Request was aborted");
				reject(new Error("Request was aborted"));
			});

			try {
				request.end();
			} catch (error) {
				clearTimeout(timeout);
				console.error("Failed to send request:", error);
				reject(new Error(`Failed to send request: ${error.message}`));
			}
		});
	}

	// Fallback method using Node.js https module for Windows compatibility
	async getLatestReleaseNodejs() {
		return new Promise((resolve, reject) => {
			const url = `https://api.github.com/repos/${this.githubRepo}/releases/latest`;
			console.log("Using Node.js fallback to fetch:", url);

			const options = {
				hostname: 'api.github.com',
				path: `/repos/${this.githubRepo}/releases/latest`,
				method: 'GET',
				headers: {
					'User-Agent': 'VaultApp/1.0.2 (Electron)',
					'Accept': 'application/vnd.github.v3+json',
					'Cache-Control': 'no-cache'
				},
				timeout: 15000
			};

			const req = https.request(options, (res) => {
				let data = '';

				console.log(`Node.js GitHub API response status: ${res.statusCode}`);

				if (res.statusCode === 404) {
					reject(new Error("Repository not found or no releases available"));
					return;
				}

				if (res.statusCode === 403) {
					reject(new Error("GitHub API rate limit exceeded. Please try again later."));
					return;
				}

				if (res.statusCode !== 200) {
					reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
					return;
				}

				res.on('data', (chunk) => {
					data += chunk;
				});

				res.on('end', () => {
					try {
						const release = JSON.parse(data);
						console.log("Successfully fetched release data using Node.js fallback");
						resolve(release);
					} catch (error) {
						console.error("Failed to parse JSON:", error);
						reject(new Error("Failed to parse release data"));
					}
				});

				res.on('error', (error) => {
					console.error("Response error:", error);
					reject(new Error(`Response error: ${error.message}`));
				});
			});

			req.on('error', (error) => {
				console.error("Node.js HTTPS request error:", error);
				let errorMessage = `Network error: ${error.message}`;
				if (error.code === 'ENOTFOUND') {
					errorMessage = "DNS resolution failed. Check your internet connection and DNS settings.";
				} else if (error.code === 'ECONNREFUSED') {
					errorMessage = "Connection refused. This might be due to firewall or proxy settings.";
				} else if (error.code === 'ETIMEDOUT') {
					errorMessage = "Connection timed out. Check your internet connection.";
				}
				reject(new Error(errorMessage));
			});

			req.on('timeout', () => {
				req.destroy();
				reject(new Error("Request timeout - check your internet connection"));
			});

			req.end();
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
