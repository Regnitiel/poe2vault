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
	const searchResults = searchItems(allItems, searchQuery);

	const handleAddItem = (item: VaultItem) => {
		onAddItem(item);
		alert("Item added successfully!");
	};

	return (
		<section id="utils" className={styles.utils}>
			<h1>Utils</h1>

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
				</div>
			</div>
		</section>
	);
};

export default Utils;
