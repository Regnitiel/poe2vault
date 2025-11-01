export interface VaultItem {
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
	disabled?: boolean; // Made optional since it might not exist in all data
	imageLink: string;
	wikiLink: string;
}

export interface GroupedItems {
	[key: string]: {
		all: VaultItem[];
		display: VaultItem[];
	};
}

export interface HomeMetrics {
	totalUniques: number;
	collectedCurrentLeague: number;
	ownedUniques: number;
	remainingUniques: number;
}

export interface LeagueMetrics {
	total: number;
	owned: number;
	league: number;
	remaining: number;
}

export interface CategoryMetrics {
	"0.1": LeagueMetrics;
	"0.2": LeagueMetrics;
	"0.3": LeagueMetrics;
	Bosses: LeagueMetrics;
	Special: LeagueMetrics;
}

export type FilterType =
	| "all"
	| "0.1"
	| "0.2"
	| "0.3"
	| "Bosses"
	| "Special"
	| "Amulet"
	| "Belt"
	| "Body"
	| "Boots"
	| "Bow"
	| "Buckler"
	| "Charm"
	| "Crossbow"
	| "Flask"
	| "Focus"
	| "Gloves"
	| "Helm"
	| "Jewel"
	| "One Hand Mace"
	| "Quartertaff"
	| "Quiver"
	| "Relic"
	| "Ring"
	| "Sceptre"
	| "Shield"
	| "Spear"
	| "Staff"
	| "Tablet"
	| "Two Hand Mace"
	| "Wand";

export type TabType = "home" | "vault" | "utils";

export interface AppState {
	allItems: VaultItem[];
	currentFilter: FilterType;
	currentTab: TabType;
	hideOwnedItems: boolean;
	searchQuery: string;
	editingItem: VaultItem | null;
	editingIndex: number | null;
}

export interface UpdateInfo {
	version: string;
	releaseNotes: string;
	downloadUrl: string;
}

export interface UpdateStatus {
	status:
		| "checking"
		| "up-to-date"
		| "downloading"
		| "installing"
		| "downloaded"
		| "error";
}

export interface UpdateProgress {
	progress: number;
}

export type UpdateStatusType =
	| "idle"
	| "checking"
	| "available"
	| "downloading"
	| "downloaded"
	| "up-to-date"
	| "error";
