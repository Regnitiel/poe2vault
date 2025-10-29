import { VaultItem } from "../types";

// Electron API bridge
declare global {
	interface Window {
		electronAPI: {
			loadVaultData: () => Promise<VaultItem[]>;
			saveVaultData: (data: VaultItem[]) => Promise<void>;
			openExternal: (url: string) => void;
		};
	}
}

export const loadVaultData = async (): Promise<VaultItem[]> => {
	try {
		// Always use Electron API for file access
		if (window.electronAPI) {
			return await window.electronAPI.loadVaultData();
		}

		// If no Electron API, return empty array (this shouldn't happen in normal use)
		console.warn("Electron API not available");
		return [];
	} catch (error) {
		console.error("Failed to load vault data:", error);
		return [];
	}
};

export const saveVaultData = async (data: VaultItem[]): Promise<void> => {
	try {
		// Always use Electron API for file access
		if (window.electronAPI) {
			await window.electronAPI.saveVaultData(data);
		} else {
			console.warn("Electron API not available - cannot save data");
		}
	} catch (error) {
		console.error("Failed to save vault data:", error);
	}
};

export const openExternalLink = (url: string): void => {
	if (window.electronAPI) {
		window.electronAPI.openExternal(url);
	} else {
		window.open(url, "_blank");
	}
};

export const getImagePath = (imageLink: string): string => {
	const path = imageLink.startsWith("http")
		? imageLink
		: `./Images/${imageLink}`;

	return path;
};
