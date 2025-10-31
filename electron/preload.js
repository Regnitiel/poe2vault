const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	loadVaultData: () => ipcRenderer.invoke("load-vault-data"),
	saveVaultData: (data) => ipcRenderer.invoke("save-vault-data", data),
	openExternal: (url) => {
		ipcRenderer.invoke("open-external", url);
	},
	// Update-related APIs
	checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),
	downloadUpdate: () => ipcRenderer.invoke("download-update"),
	getCurrentVersion: () => ipcRenderer.invoke("get-current-version"),
	// Update event listeners
	onUpdateStatus: (callback) => {
		ipcRenderer.on("update-status", (_event, status) => callback(status));
	},
	onUpdateAvailable: (callback) => {
		ipcRenderer.on("update-available", (_event, updateInfo) =>
			callback(updateInfo)
		);
	},
	onUpdateProgress: (callback) => {
		ipcRenderer.on("update-progress", (_event, progress) => callback(progress));
	},
	onUpdateError: (callback) => {
		ipcRenderer.on("update-error", (_event, error) => callback(error));
	},
});
