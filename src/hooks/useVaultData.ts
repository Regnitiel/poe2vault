import { useState, useEffect, useCallback } from "react";
import { VaultItem, FilterType } from "../types";
import { loadVaultData, saveVaultData } from "../utils/data";

export const useVaultData = () => {
	const [allItems, setAllItems] = useState<VaultItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			try {
				const data = await loadVaultData();
				// Sort alphabetically by name (case-insensitive) after loading from JSON
				const sorted = [...data].sort((a, b) =>
					a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
				);
				setAllItems(sorted);
			} catch (error) {
				console.error("Error loading vault data:", error);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	const saveData = useCallback(async (items: VaultItem[]) => {
		try {
			await saveVaultData(items);
			setAllItems(items);
		} catch (error) {
			console.error("Error saving vault data:", error);
		}
	}, []);

	const addItem = useCallback(
		async (item: VaultItem) => {
			const newItems = [...allItems, item];
			await saveData(newItems);
		},
		[allItems, saveData]
	);

	const updateItem = useCallback(
		async (index: number, item: VaultItem) => {
			const newItems = [...allItems];
			newItems[index] = item;
			await saveData(newItems);
		},
		[allItems, saveData]
	);

	const deleteItem = useCallback(
		async (index: number) => {
			const newItems = allItems.filter((_, i) => i !== index);
			await saveData(newItems);
		},
		[allItems, saveData]
	);

	const toggleOwned = useCallback(
		async (index: number) => {
			const newItems = [...allItems];
			const current = newItems[index];
			const nextOwned = !current.owned;
			newItems[index] = {
				...current,
				owned: nextOwned,
				// If disabling owned, also disable during league and foil
				obtainedDuringLeague: nextOwned ? current.obtainedDuringLeague : false,
				foil: nextOwned ? current.foil : false,
			};
			await saveData(newItems);
		},
		[allItems, saveData]
	);

	const toggleObtainedDuringLeague = useCallback(
		async (index: number) => {
			const newItems = [...allItems];
			const current = newItems[index];
			const nextObtained = !current.obtainedDuringLeague;
			newItems[index] = {
				...current,
				obtainedDuringLeague: nextObtained,
				// When marking during league, also mark owned. Turning off keeps owned as-is.
				owned: nextObtained ? true : current.owned,
			};
			await saveData(newItems);
		},
		[allItems, saveData]
	);

	const toggleFoil = useCallback(
		async (index: number) => {
			const current = allItems[index];
			// If item is disabled, do nothing to keep disabled state intact
			if (!current || current.disabled) return;

			const newItems = [...allItems];
			const nextFoil = !current.foil;
			newItems[index] = {
				...current,
				foil: nextFoil,
				// When marking foil, also mark owned. Turning off keeps owned as-is.
				owned: nextFoil ? true : current.owned,
			};
			await saveData(newItems);
		},
		[allItems, saveData]
	);

	return {
		allItems,
		loading,
		addItem,
		updateItem,
		deleteItem,
		toggleOwned,
		toggleObtainedDuringLeague,
		toggleFoil,
	};
};
