// Global type definitions for Electron API
import { VaultItem } from "../types";

declare global {
	interface Window {
		electronAPI?: {
			// Vault data APIs
			loadVaultData: () => Promise<VaultItem[]>;
			saveVaultData: (data: VaultItem[]) => Promise<void>;
			openExternal: (url: string) => void;

			// Update APIs
			checkForUpdates: () => Promise<boolean>;
			downloadUpdate: () => Promise<void>;
			getCurrentVersion: () => Promise<string>;

			// Update event listeners
			onUpdateStatus: (callback: (status: any) => void) => void;
			onUpdateAvailable: (callback: (updateInfo: any) => void) => void;
			onUpdateProgress: (callback: (progress: any) => void) => void;
			onUpdateError: (callback: (error: string) => void) => void;
		};
	}
}

export {};
