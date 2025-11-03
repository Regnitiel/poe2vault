const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	// Vault data APIs
	loadVaultData: () => ipcRenderer.invoke("load-vault-data"),
	saveVaultData: (data) => ipcRenderer.invoke("save-vault-data", data),
	openExternal: (url) => ipcRenderer.invoke("open-external", url),

	// Update (manual only)
	getCurrentVersion: () => ipcRenderer.invoke("get-current-version"),
	checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),
});
