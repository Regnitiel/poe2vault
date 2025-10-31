import {
	VaultItem,
	FilterType,
	GroupedItems,
	HomeMetrics,
	LeagueMetrics,
	CategoryMetrics,
} from "../types";

export const filterItems = (
	items: VaultItem[],
	filter: FilterType
): VaultItem[] => {
	if (filter === "all") return items;
	if (filter === "Bosses") return items.filter((item) => item.bosses);
	if (filter === "Special") return items.filter((item) => item.special);

	// Check if filter is a league
	if (filter === "0.1" || filter === "0.2" || filter === "0.3") {
		return items.filter((item) => item.league === filter);
	}

	// Otherwise, filter by category
	return items.filter((item) => item.category === filter);
};

export const groupItemsByCategory = (
	items: VaultItem[],
	filter: FilterType,
	hideOwned: boolean
): GroupedItems => {
	const filtered = filterItems(items, filter);
	const grouped: GroupedItems = {};

	filtered.forEach((item) => {
		let groupKey: string;
		if (filter === "Bosses") {
			groupKey = item.obtainMethod.split(" drops")[0];
		} else {
			groupKey = item.category;
		}

		if (!grouped[groupKey]) {
			grouped[groupKey] = { all: [], display: [] };
		}

		grouped[groupKey].all.push(item);
		if (!hideOwned || !item.owned) {
			grouped[groupKey].display.push(item);
		}
	});

	return grouped;
};

export const calculateHomeMetrics = (items: VaultItem[]): HomeMetrics => {
	const totalUniques = items.length;
	const ownedUniques = items.filter((item) => item.owned).length;
	const collectedCurrentLeague = items.filter(
		(item) => item.obtainedDuringLeague
	).length;
	const remainingUniques = totalUniques - ownedUniques;

	return {
		totalUniques,
		collectedCurrentLeague,
		ownedUniques,
		remainingUniques,
	};
};

export const calculateCategoryMetrics = (
	items: VaultItem[]
): CategoryMetrics => {
	const leagues = ["0.1", "0.2", "0.3"] as const;
	const result: CategoryMetrics = {
		"0.1": { total: 0, owned: 0, league: 0, remaining: 0 },
		"0.2": { total: 0, owned: 0, league: 0, remaining: 0 },
		"0.3": { total: 0, owned: 0, league: 0, remaining: 0 },
		Bosses: { total: 0, owned: 0, league: 0, remaining: 0 },
		Special: { total: 0, owned: 0, league: 0, remaining: 0 },
	};

	leagues.forEach((league) => {
		const leagueItems = items.filter(
			(item) => item.league === league && !item.bosses && !item.special
		);
		const total = leagueItems.length;
		const owned = leagueItems.filter((item) => item.owned).length;
		const obtainedDuringLeague = leagueItems.filter(
			(item) => item.obtainedDuringLeague
		).length;
		const remaining = total - owned;

		result[league] = { total, owned, league: obtainedDuringLeague, remaining };
	});

	// Calculate boss metrics
	const bossItems = items.filter((item) => item.bosses);
	const totalBosses = bossItems.length;
	const ownedBosses = bossItems.filter((item) => item.owned).length;
	const obtainedDuringLeagueBosses = bossItems.filter(
		(item) => item.obtainedDuringLeague
	).length;
	result.Bosses = {
		total: totalBosses,
		owned: ownedBosses,
		league: obtainedDuringLeagueBosses,
		remaining: totalBosses - ownedBosses,
	};

	// Calculate special metrics
	const specialItems = items.filter((item) => item.special);
	const totalSpecial = specialItems.length;
	const ownedSpecial = specialItems.filter((item) => item.owned).length;
	const obtainedDuringLeagueSpecial = specialItems.filter(
		(item) => item.obtainedDuringLeague
	).length;
	result.Special = {
		total: totalSpecial,
		owned: ownedSpecial,
		league: obtainedDuringLeagueSpecial,
		remaining: totalSpecial - ownedSpecial,
	};

	return result;
};

export const calculateItemCategoryMetrics = (
	items: VaultItem[]
): Record<string, { total: number; owned: number }> => {
	const categoryMetrics: Record<string, { total: number; owned: number }> = {};

	items.forEach((item) => {
		const category = item.category;
		if (!categoryMetrics[category]) {
			categoryMetrics[category] = { total: 0, owned: 0 };
		}
		categoryMetrics[category].total++;
		if (item.owned) {
			categoryMetrics[category].owned++;
		}
	});

	// Sort categories by name for consistent display
	const sortedCategories: Record<string, { total: number; owned: number }> = {};
	Object.keys(categoryMetrics)
		.sort()
		.forEach((category) => {
			sortedCategories[category] = categoryMetrics[category];
		});

	return sortedCategories;
};

export const searchItems = (
	items: VaultItem[],
	query: string
): Array<{ item: VaultItem; originalIndex: number }> => {
	if (!query.trim()) return [];

	const lowerQuery = query.toLowerCase().trim();

	return items
		.map((item, originalIndex) => ({ item, originalIndex }))
		.filter(({ item }) => {
			const searchableProperties = [
				item.name,
				item.league,
				item.base,
				item.category,
				item.obtainMethod,
			].map((prop) => (prop || "").toLowerCase());

			// Check if query matches any of the basic properties
			const basicMatch = searchableProperties.some((prop) =>
				prop.includes(lowerQuery)
			);

			// Special handling for "disabled" search
			const isDisabledSearch = lowerQuery === "disabled";
			const matchesDisabled = isDisabledSearch && item.disabled;

			return basicMatch || matchesDisabled;
		});
};

export const getUniqueObtainMethods = (items: VaultItem[]): string[] => {
	const methods = new Set(
		items.map((item) => item.obtainMethod).filter((method) => method)
	);
	return Array.from(methods).sort();
};
