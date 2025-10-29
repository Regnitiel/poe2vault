import React, { useState } from "react";
import { TabType, FilterType, VaultItem } from "./types";
import { useVaultData } from "./hooks/useVaultData";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import Vault from "./components/Vault/Vault";
import Utils from "./components/Utils/Utils";
import { EditModal } from "./components/Modal/Modal";
import "./styles/globals.css";

const App: React.FC = () => {
	const {
		allItems,
		loading,
		addItem,
		updateItem,
		deleteItem,
		toggleOwned,
		toggleObtainedDuringLeague,
		toggleFoil,
	} = useVaultData();

	const [currentTab, setCurrentTab] = useState<TabType>("home");
	const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
	const [hideOwnedItems, setHideOwnedItems] = useState(false);
	const [editingItem, setEditingItem] = useState<VaultItem | null>(null);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	const handleEdit = (index: number) => {
		setEditingItem(allItems[index]);
		setEditingIndex(index);
	};

	const handleCloseEdit = () => {
		setEditingItem(null);
		setEditingIndex(null);
	};

	const handleSaveEdit = (index: number, item: VaultItem) => {
		updateItem(index, item);
	};

	const handleDeleteItem = (index: number) => {
		deleteItem(index);
	};

	const renderCurrentTab = () => {
		switch (currentTab) {
			case "home":
				return <Home allItems={allItems} />;
			case "vault":
				return (
					<Vault
						allItems={allItems}
						currentFilter={currentFilter}
						hideOwnedItems={hideOwnedItems}
						onFilterChange={setCurrentFilter}
						onHideOwnedChange={setHideOwnedItems}
						onToggleOwned={toggleOwned}
						onToggleObtainedDuringLeague={toggleObtainedDuringLeague}
						onToggleFoil={toggleFoil}
						onEdit={handleEdit}
					/>
				);
			case "utils":
				return <Utils allItems={allItems} onAddItem={addItem} />;
			default:
				return <Home allItems={allItems} />;
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="App">
			<Header currentTab={currentTab} onTabChange={setCurrentTab} />
			<main>{renderCurrentTab()}</main>
			<EditModal
				isOpen={editingItem !== null}
				allItems={allItems}
				editingItem={editingItem}
				editingIndex={editingIndex}
				onClose={handleCloseEdit}
				onSave={handleSaveEdit}
				onDelete={handleDeleteItem}
			/>
		</div>
	);
};

export default App;
