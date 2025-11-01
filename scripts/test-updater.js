#!/usr/bin/env node

/**
 * Test script to diagnose electron-updater behavior
 * Run this with: node scripts/test-updater.js
 */

const { autoUpdater } = require("electron-updater");
const { app } = require("electron");

console.log("=== Electron Updater Diagnostic ===");
console.log("App version:", require("../package.json").version);
console.log("Platform:", process.platform);
console.log("Arch:", process.arch);
console.log(
	"App is packaged:",
	app ? app.isPackaged : "N/A (running outside Electron)"
);

// Configure for GitHub
const config = {
	provider: "github",
	owner: "Regnitiel",
	repo: "poe2vault",
	private: false,
};

console.log("\nConfiguring autoUpdater with:", config);
autoUpdater.setFeedURL(config);

console.log("\nSetting up event listeners...");

let eventsFired = [];

autoUpdater.on("checking-for-update", () => {
	console.log("✅ Event: checking-for-update");
	eventsFired.push("checking-for-update");
});

autoUpdater.on("update-available", (info) => {
	console.log("✅ Event: update-available");
	console.log("   Version:", info.version);
	console.log("   Release date:", info.releaseDate);
	console.log("   Files:", info.files);
	eventsFired.push("update-available");
});

autoUpdater.on("update-not-available", (info) => {
	console.log("✅ Event: update-not-available");
	console.log("   Current version:", info.version);
	eventsFired.push("update-not-available");
});

autoUpdater.on("error", (error) => {
	console.log("❌ Event: error");
	console.log("   Message:", error.message);
	console.log("   Stack:", error.stack);
	eventsFired.push("error");
});

autoUpdater.on("download-progress", (progress) => {
	console.log("📥 Event: download-progress");
	console.log("   Progress:", progress.percent + "%");
	eventsFired.push("download-progress");
});

autoUpdater.on("update-downloaded", (info) => {
	console.log("✅ Event: update-downloaded");
	console.log("   Version:", info.version);
	eventsFired.push("update-downloaded");
});

// Set timeout
const timeout = setTimeout(() => {
	console.log("\n⏰ TIMEOUT after 60 seconds");
	console.log("Events fired:", eventsFired);
	console.log("\nThis indicates electron-updater is hanging.");
	console.log("Possible causes:");
	console.log("1. Missing latest.yml file on GitHub release");
	console.log("2. Network connectivity issues");
	console.log("3. Invalid GitHub URL or repository");
	process.exit(1);
}, 60000);

console.log("\nStarting update check...");
console.log("(Will timeout after 60 seconds if no response)\n");

autoUpdater
	.checkForUpdates()
	.then((result) => {
		clearTimeout(timeout);
		console.log("\n✅ checkForUpdates() completed");
		console.log("Result:", result);
		console.log("\nEvents fired:", eventsFired);
		console.log("\nDiagnostic completed successfully!");
		process.exit(0);
	})
	.catch((error) => {
		clearTimeout(timeout);
		console.log("\n❌ checkForUpdates() threw error");
		console.log("Error:", error.message);
		console.log("Stack:", error.stack);
		console.log("\nEvents fired:", eventsFired);
		process.exit(1);
	});
