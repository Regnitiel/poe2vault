import React, { useState } from "react";
import { VaultItem } from "../../types";
import { searchItems } from "../../utils/helpers";
import { openExternalLink, getImagePath } from "../../utils/data";
import ItemForm from "../ItemForm/ItemForm";
import styles from "./styles.module.css";

interface UtilsProps {
	allItems: VaultItem[];
	onAddItem: (item: VaultItem) => void;
}

const Utils: React.FC<UtilsProps> = ({ allItems, onAddItem }) => {
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
				{searchResults.map((item, index) => (
					<div
						key={`search-${item.name}-${index}`}
						className={`item-card${item.disabled ? " disabled" : ""}`}
						style={{
							backgroundColor: item.owned
								? "rgba(21,128,61,0.4)"
								: "rgba(153,27,27,0.4)",
							display: "flex",
							alignItems: "flex-start",
						}}
					>
						<div className="item-info" style={{ flex: 1 }}>
							<h4
								className="item-name"
								onClick={() => handleNameClick(item.wikiLink)}
								style={{
									cursor: "pointer",
									textDecoration: "underline",
									color: "#fbbf24",
								}}
							>
								{item.name}
							</h4>
							<p>
								<strong>Base:</strong> {item.base}
							</p>
							<p>
								<strong>Category:</strong> {item.category}
							</p>
							<p>
								<strong>League:</strong> {item.league}
							</p>
							<p>
								<strong>Obtain:</strong> {item.obtainMethod}
							</p>
							<p>
								<strong>Boss:</strong> {item.bosses ? "Yes" : "No"}
							</p>
							<p>
								<strong>Special:</strong> {item.special ? "Yes" : "No"}
							</p>
							<p>
								<strong>Disabled:</strong> {item.disabled ? "Yes" : "No"}
							</p>
						</div>
						<div
							className="item-image"
							style={{ flexShrink: 0, marginLeft: "1rem" }}
						>
							<img
								src={getImagePath(item.imageLink)}
								alt={item.name}
								style={{ borderRadius: "6px" }}
							/>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default Utils;
