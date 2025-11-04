import React, { useState } from "react";
import { VaultItem } from "../../types";
import { searchItems } from "../../utils/helpers";
import ItemForm from "../ItemForm/ItemForm";
import styles from "./styles.module.css";
import ItemCard from "../ItemCard/ItemCard";

interface UtilsProps {
	allItems: VaultItem[];
	onAddItem: (item: VaultItem) => void;
	onToggleOwned: (index: number) => void;
	onToggleObtainedDuringLeague: (index: number) => void;
	onToggleFoil: (index: number) => void;
	onEdit: (index: number) => void;
}

const Utils: React.FC<UtilsProps> = ({
	allItems,
	onAddItem,
	onToggleOwned,
	onToggleObtainedDuringLeague,
	onToggleFoil,
	onEdit,
}) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [vaultDir, setVaultDir] = useState<string | null>(null);
	const [vaultFile, setVaultFile] = useState<string | null>(null);
	const [changingPath, setChangingPath] = useState(false);
	const searchResults = searchItems(allItems, searchQuery);

	const handleAddItem = (item: VaultItem) => {
		onAddItem(item);
		alert("Item added successfully!");
	};

	const refreshDir = async () => {
		try {
			const api = window.electronAPI;
			if (!api) return;
			const info = await api.getVaultDirectory();
			setVaultDir(info.dir);
			setVaultFile(info.file);
		} catch {}
	};

	const handleChooseDir = async () => {
		try {
			setChangingPath(true);
			const api = window.electronAPI;
			if (!api) return;
			const res = await api.chooseVaultDirectory();
			setVaultDir(res.dir);
			setVaultFile(res.file);
			alert("Vault path updated.");
			// Optional: reload data so UI reflects any merge
			location.reload();
		} catch (e) {
			alert("Directory selection canceled.");
		} finally {
			setChangingPath(false);
		}
	};

	// Initialize current directory when component mounts
	React.useEffect(() => {
		refreshDir();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<section id="utils" className={styles.utils}>
			<div className={styles.tableLayout}>
				<div className={styles.leftColumn}>
					<div className={styles.section}>
						<h2>Add New Item</h2>
						<ItemForm allItems={allItems} onSubmit={handleAddItem} />
					</div>
				</div>

				<div className={styles.rightColumn}>
					<div className={styles.section}>
						<h2>Search Items</h2>
						<input
							className="form-input"
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search by name, league, category..."
						/>
					</div>

					<div id="searchResults" className={styles.searchResults}>
						{searchResults.map(({ item, originalIndex }) => (
							<ItemCard
								key={`search-${item.name}-${originalIndex}`}
								item={item}
								index={originalIndex}
								onToggleOwned={onToggleOwned}
								onToggleObtainedDuringLeague={onToggleObtainedDuringLeague}
								onToggleFoil={onToggleFoil}
								onEdit={onEdit}
							></ItemCard>
						))}
					</div>

					{/* New: Vault data path management */}
					<div className={styles.section}>
						<h2>Vault Data Location</h2>
						<p className={styles.locationText}>
							Current folder: <strong>{vaultDir || "Not set"}</strong>
							<br />
							Current file: <strong>{vaultFile || "Not set"}</strong>
						</p>
						<div className={styles.buttonRow}>
							<button
								className="btn btn-primary"
								onClick={handleChooseDir}
								disabled={changingPath}
							>
								{changingPath ? "Changing..." : "Change Vault Data Folder"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Utils;
