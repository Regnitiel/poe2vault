import { contextBridge, ipcRenderer } from "electron";

interface VaultItem {
	name: string;
	base: string;
	category: string;
	league: string;
	obtainMethod: string;
	owned: boolean;
	obtainedDuringLeague: boolean;
	bosses: boolean;
	special: boolean;
	foil: boolean;
	disabled: boolean;
	imageLink: string;
	wikiLink: string;
}

contextBridge.exposeInMainWorld("electronAPI", {
	loadVaultData: (): Promise<VaultItem[]> =>
		ipcRenderer.invoke("load-vault-data"),
	saveVaultData: (data: VaultItem[]): Promise<void> =>
		ipcRenderer.invoke("save-vault-data", data),
	openExternal: (url: string): void => {
		ipcRenderer.invoke("open-external", url);
	},
	// Update-related APIs
	checkForUpdates: (): Promise<boolean> =>
		ipcRenderer.invoke("check-for-updates"),
	downloadUpdate: (): Promise<void> => ipcRenderer.invoke("download-update"),
	getCurrentVersion: (): Promise<string> =>
		ipcRenderer.invoke("get-current-version"),
	// Update event listeners
	onUpdateStatus: (callback: (status: any) => void) => {
		ipcRenderer.on("update-status", (_event, status) => callback(status));
	},
	onUpdateAvailable: (callback: (updateInfo: any) => void) => {
		ipcRenderer.on("update-available", (_event, updateInfo) =>
			callback(updateInfo)
		);
	},
	onUpdateProgress: (callback: (progress: any) => void) => {
		ipcRenderer.on("update-progress", (_event, progress) => callback(progress));
	},
	onUpdateError: (callback: (error: string) => void) => {
		ipcRenderer.on("update-error", (_event, error) => callback(error));
	},
});
