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
				setAllItems(data);
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
			newItems[index] = {
				...newItems[index],
				owned: !newItems[index].owned,
				obtainedDuringLeague: false,
			};
			await saveData(newItems);
		},
		[allItems, saveData]
	);

	const toggleObtainedDuringLeague = useCallback(
		async (index: number) => {
			const newItems = [...allItems];
			newItems[index] = {
				...newItems[index],
				owned: true,
				obtainedDuringLeague: true,
			};
			await saveData(newItems);
		},
		[allItems, saveData]
	);

	const toggleFoil = useCallback(
		async (index: number) => {
			const newItems = [...allItems];
			newItems[index] = {
				...newItems[index],
				foil: !newItems[index].foil,
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
