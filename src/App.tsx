import React, { useState } from "react";
import { TabType, FilterType, VaultItem } from "./types";
import { useVaultData } from "./hooks/useVaultData";
import { useUpdateManager } from "./hooks/useUpdateManager";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import Vault from "./components/Vault/Vault";
import Utils from "./components/Utils/Utils";
import { EditModal } from "./components/Modal/Modal";
import UpdateStatusIndicator from "./components/UpdateStatusIndicator/UpdateStatusIndicator";
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

	const {
		updateStatus,
		updateInfo,
		downloadProgress,
		showUpdateModal,
		currentVersion,
		acceptUpdate,
		declineUpdate,
		openUpdateModal,
		isDownloading,
	} = useUpdateManager();

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
			<Header currentTab={currentTab} onTabChange={setCurrentTab} />
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
			{/* Update Status Indicator */}
			<UpdateStatusIndicator
				status={updateStatus}
				onUpdateClick={openUpdateModal}
			/>
			{/* Update Modal */}
			<UpdateModal
				isOpen={showUpdateModal}
				updateInfo={updateInfo}
				isDownloading={isDownloading}
				downloadProgress={downloadProgress}
				onAccept={acceptUpdate}
				onDecline={declineUpdate}
			/>
		</div>
	);
};

export default App;
