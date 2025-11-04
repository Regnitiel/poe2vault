// Global type definitions for Electron API
import { VaultItem } from "../types";

declare global {
	interface Window {
		electronAPI?: {
			// Vault data APIs
			loadVaultData: () => Promise<VaultItem[]>;
			saveVaultData: (data: VaultItem[]) => Promise<void>;
			openExternal: (url: string) => void;

			// Update (manual only)
			getCurrentVersion: () => Promise<string>;
			checkForUpdates: () => Promise<{
				status: "available" | "up-to-date" | "error";
				version?: string;
				url?: string;
				releaseNotes?: string;
				error?: string;
			}>;

			// New: vault directory management
			getVaultDirectory: () => Promise<{
				dir: string | null;
				file: string | null;
			}>;
			chooseVaultDirectory: () => Promise<{ dir: string; file: string }>;
			setVaultDirectory: (
				dir: string
			) => Promise<{ dir: string; file: string }>;
		};
	}
}

export {};
