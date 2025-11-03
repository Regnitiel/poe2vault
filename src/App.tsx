import React, { useState } from "react";
import { TabType, FilterType, VaultItem } from "./types";
import { useVaultData } from "./hooks/useVaultData";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import Vault from "./components/Vault/Vault";
import Utils from "./components/Utils/Utils";
import { EditModal } from "./components/Modal/Modal";
import UpdateModal from "./components/UpdateModal/UpdateModal";
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

	const [updateModalOpen, setUpdateModalOpen] = useState(false);
	const [updateInfo, setUpdateInfo] = useState<{
		version: string;
		releaseNotes: string;
		url?: string;
	} | null>(null);

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

	const handleUpdateAvailable = (info: {
		version: string;
		releaseNotes: string;
		url?: string;
	}) => {
		setUpdateInfo(info);
		setUpdateModalOpen(true);
	};

	const handleAcceptUpdate = () => {
		if (updateInfo?.url) {
			window.electronAPI?.openExternal(updateInfo.url);
		}
		setUpdateModalOpen(false);
	};

	const handleDeclineUpdate = () => {
		setUpdateModalOpen(false);
	};

	const renderCurrentTab = () => {
		switch (currentTab) {
			case "home":
				return (
					<Home
						allItems={allItems}
						onTabChange={setCurrentTab}
						onFilterChange={setCurrentFilter}
					/>
				);
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
				return (
					<Utils
						allItems={allItems}
						onAddItem={addItem}
						onToggleOwned={toggleOwned}
						onToggleObtainedDuringLeague={toggleObtainedDuringLeague}
						onToggleFoil={toggleFoil}
						onEdit={handleEdit}
					/>
				);
			default:
				return <Home allItems={allItems} />;
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="App">
			<Header
				currentTab={currentTab}
				onTabChange={setCurrentTab}
				onUpdateAvailable={handleUpdateAvailable}
			/>
			<main>{renderCurrentTab()}</main>{" "}
			{editingItem && (
				<EditModal
					isOpen={editingItem !== null}
					allItems={allItems}
					editingItem={editingItem}
					editingIndex={editingIndex}
					onSave={(index, item) => {
						handleSaveEdit(index, item);
						handleCloseEdit();
					}}
					onClose={handleCloseEdit}
					onDelete={(index) => {
						handleDeleteItem(index);
						handleCloseEdit();
					}}
				/>
			)}
			<UpdateModal
				isOpen={updateModalOpen}
				version={updateInfo?.version || ""}
				releaseNotes={updateInfo?.releaseNotes || ""}
				onAccept={handleAcceptUpdate}
				onDecline={handleDeclineUpdate}
			/>
		</div>
	);
};

export default App;
