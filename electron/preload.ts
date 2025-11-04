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
	// Update: manual check only
	getCurrentVersion: (): Promise<string> =>
		ipcRenderer.invoke("get-current-version"),
	checkForUpdates: (): Promise<{
		status: "available" | "up-to-date" | "error";
		version?: string;
		url?: string;
		releaseNotes?: string;
		error?: string;
	}> => ipcRenderer.invoke("check-for-updates"),

	// New: vault directory management
	getVaultDirectory: (): Promise<{ dir: string | null; file: string | null }> =>
		ipcRenderer.invoke("get-vault-directory"),
	chooseVaultDirectory: (): Promise<{ dir: string; file: string }> =>
		ipcRenderer.invoke("choose-vault-directory"),
	setVaultDirectory: (dir: string): Promise<{ dir: string; file: string }> =>
		ipcRenderer.invoke("set-vault-directory", dir),
});
