import React, { useState } from "react";
import { VaultItem } from "../../types";
import { searchItems } from "../../utils/helpers";
import { openExternalLink, getImagePath } from "../../utils/data";
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

	const handleNameClick = (wikiLink: string) => {
		openExternalLink(wikiLink);
	};

	return (
		<section id="utils" className={styles.utils}>
			<h1>Utils</h1>

			{/* ADD ITEM FORM */}
			<div className={styles.section}>
				<h2>Add New Item</h2>
				<ItemForm allItems={allItems} onSubmit={handleAddItem} />
			</div>

			{/* SEARCH ITEMS */}
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

			{/* SEARCH RESULTS */}
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
		</section>
	);
};

export default Utils;
