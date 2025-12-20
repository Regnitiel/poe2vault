import React, { useState, useEffect } from "react";
import { TabType, FilterType, VaultItem } from "./types";
import { useVaultData } from "./hooks/useVaultData";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import Vault from "./components/Vault/Vault";
import Utils from "./components/Utils/Utils";
import Settings from "./components/Settings/Settings";
import { EditModal } from "./components/Modal/Modal";
import UpdateModal from "./components/UpdateModal/UpdateModal";
import VaultControls from "./components/Vault/VaultControls";
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
		reloadData,
	} = useVaultData();

	const [currentTab, setCurrentTab] = useState<TabType>("home");
	const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
	const [categoryFilter, setCategoryFilter] = useState<FilterType | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [filters, setFilters] = useState({
		onlyOwned: false,
		onlyUnowned: false,
		onlyLeague: false,
		canBeChanced: false,
	});
	const [editingItem, setEditingItem] = useState<VaultItem | null>(null);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	const [excludeDisabledFromTotal, setExcludeDisabledFromTotal] =
		useState(true);
	const [jsonPath, setJsonPath] = useState<string | undefined>(undefined);

	const [updateModalOpen, setUpdateModalOpen] = useState(false);
	const [updateInfo, setUpdateInfo] = useState<{
		version: string;
		releaseNotes: string;
		url?: string;
	} | null>(null);

	// Load current vault directory on mount
	useEffect(() => {
		const loadVaultDir = async () => {
			try {
				const api = window.electronAPI;
				if (api && typeof api.getVaultDirectory === "function") {
					const result = await api.getVaultDirectory();
					if (result.file) {
						setJsonPath(result.file);
					}
				}
			} catch (err) {
				console.error("Failed to load vault directory:", err);
			}
		};
		loadVaultDir();
	}, []);

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

	const handleSelectJsonPath = async () => {
		try {
			const api = window.electronAPI;
			if (api && typeof api.chooseVaultDirectory === "function") {
				const result = await api.chooseVaultDirectory();
				setJsonPath(result.file);
				// Reload vault data after changing location
				if (reloadData) {
					await reloadData();
				}
			}
		} catch (err) {
			// User cancelled or error occurred
			console.error("Failed to change vault directory:", err);
		}
	};

	const renderCurrentTab = () => {
		switch (currentTab) {
			case "home":
				return (
					<Home
						allItems={allItems}
						onTabChange={setCurrentTab}
						onFilterChange={setCurrentFilter}
						onCategoryFilterChange={setCategoryFilter}
						excludeDisabledFromTotal={excludeDisabledFromTotal}
					/>
				);
			case "vault":
				return (
					<Vault
						allItems={allItems}
						currentFilter={currentFilter}
						categoryFilter={categoryFilter}
						filters={filters}
						searchQuery={searchQuery}
						excludeDisabledFromTotal={excludeDisabledFromTotal}
						onFilterChange={setCurrentFilter}
						onCategoryFilterChange={setCategoryFilter}
						onFiltersChange={setFilters}
						onToggleOwned={toggleOwned}
						onToggleObtainedDuringLeague={toggleObtainedDuringLeague}
						onToggleFoil={toggleFoil}
						onEdit={handleEdit}
					/>
				);
			case "utils":
				return <Utils allItems={allItems} onAddItem={addItem} />;
			case "settings":
				return (
					<Settings
						excludeDisabledFromTotal={excludeDisabledFromTotal}
						onExcludeDisabledChange={setExcludeDisabledFromTotal}
						onSelectJsonPath={handleSelectJsonPath}
						jsonPath={jsonPath}
						onUpdateAvailable={handleUpdateAvailable}
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
		<div
			className="App"
			style={{ display: "flex", flexDirection: "column", height: "100%" }}
		>
			<Header
				currentTab={currentTab}
				onTabChange={setCurrentTab}
				vaultControls={
					currentTab === "vault" ? (
						<VaultControls
							searchQuery={searchQuery}
							onSearchChange={setSearchQuery}
							filters={filters}
							onFiltersChange={setFilters}
						/>
					) : undefined
				}
			/>
			<main
				style={{
					flex: 1,
					overflow: "hidden",
					display: "flex",
					flexDirection: "column",
					backgroundImage:
						currentTab === "home"
							? `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('./Images/eternal-vault.jpg')`
							: undefined,
					backgroundSize: "cover",
					backgroundPosition: "center 40px",
					backgroundRepeat: "no-repeat",
					backgroundAttachment: "fixed",
				}}
			>
				{renderCurrentTab()}
			</main>
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
