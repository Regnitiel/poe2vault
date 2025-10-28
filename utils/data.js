"use strict";

// Handles loading and saving vault data
const fs = require("fs");
const path = require("path");

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

function loadVaultData() {
	try {
		return JSON.parse(fs.readFileSync(vaultFilePath, "utf8"));
	} catch (err) {
		console.error("Failed to load vaultData.json", err);
		return [];
	}
}

function saveVaultData(allItems) {
	try {
		fs.writeFileSync(vaultFilePath, JSON.stringify(allItems, null, 2));
	} catch (err) {
		console.error("Failed to save vaultData.json", err);
	}
}

module.exports = { loadVaultData, saveVaultData };
