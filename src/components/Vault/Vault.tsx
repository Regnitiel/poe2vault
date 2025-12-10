import React, { useState } from "react";
import { VaultItem, FilterType } from "../../types";
import { groupItemsByCategory } from "../../utils/helpers";
import ItemCard from "../ItemCard/ItemCard";
import styles from "./styles.module.css";
import categoryStyles from "../../styles/CategorySection.module.css";

interface VaultProps {
	allItems: VaultItem[];
	currentFilter: FilterType;
	filters: {
		onlyOwned: boolean;
		onlyUnowned: boolean;
		onlyLeague: boolean;
		canBeChanced: boolean;
	};
	onFilterChange: (filter: FilterType) => void;
	onFiltersChange: (filters: {
		onlyOwned: boolean;
		onlyUnowned: boolean;
		onlyLeague: boolean;
		canBeChanced: boolean;
	}) => void;
	onToggleOwned: (index: number) => void;
	onToggleObtainedDuringLeague: (index: number) => void;
	onToggleFoil: (index: number) => void;
	onEdit: (index: number) => void;
}

const Vault: React.FC<VaultProps> = ({
	allItems,
	currentFilter,
	filters,
	onFilterChange,
	onFiltersChange,
	onToggleOwned,
	onToggleObtainedDuringLeague,
	onToggleFoil,
	onEdit,
}) => {
	const [searchQuery, setSearchQuery] = useState("");

	const groupedItems = groupItemsByCategory(
		allItems,
		currentFilter,
		filters,
		searchQuery
	);
	const sortedGroups = Object.keys(groupedItems).sort();

	const leagueFilters: { key: FilterType; label: string }[] = [
		{ key: "all", label: "All" },
		{ key: "0.1", label: "0.1" },
		{ key: "0.2", label: "0.2" },
		{ key: "0.3", label: "0.3" },
		{ key: "Bosses", label: "Bosses" },
		{ key: "Special", label: "Special Condition" },
	];

	return (
		<section id="vault">
			<div className={styles.controls}>
				<input
					className={styles.searchInput}
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Search by name, boss, category..."
				/>
				<div className={styles.separator}></div>
				<div className={styles.filterGroup}>
					<label className={styles.checkboxLabel}>
						<input
							type="checkbox"
							checked={filters.onlyOwned}
							onChange={(e) =>
								onFiltersChange({ ...filters, onlyOwned: e.target.checked })
							}
						/>
						Only Owned
					</label>
					<label className={styles.checkboxLabel}>
						<input
							type="checkbox"
							checked={filters.onlyUnowned}
							onChange={(e) =>
								onFiltersChange({ ...filters, onlyUnowned: e.target.checked })
							}
						/>
						Only Unowned
					</label>
					<label className={styles.checkboxLabel}>
						<input
							type="checkbox"
							checked={filters.onlyLeague}
							onChange={(e) =>
								onFiltersChange({ ...filters, onlyLeague: e.target.checked })
							}
						/>
						Only Obtained in League
					</label>
					<label className={styles.checkboxLabel}>
						<input
							type="checkbox"
							checked={filters.canBeChanced}
							onChange={(e) =>
								onFiltersChange({ ...filters, canBeChanced: e.target.checked })
							}
						/>
						Can be Chanced
					</label>
				</div>
			</div>{" "}
			<div className={styles.container}>
				<aside className={styles.sidebar}>
					{leagueFilters.map((filter) => (
						<button
							key={filter.key}
							className={`${styles.sidebarButton} ${
								currentFilter === filter.key ? styles.active : ""
							}`}
							onClick={() => onFilterChange(filter.key)}
						>
							{filter.label}
						</button>
					))}
				</aside>

				<div className={styles.items}>
					{sortedGroups.map((group) => {
						const groupData = groupedItems[group];
						const totalInGroup = groupData.all.length;
						const ownedInGroup = groupData.all.filter(
							(item) => item.owned
						).length;
						const completionPercentage = Math.round(
							(ownedInGroup / totalInGroup) * 100
						);

						return (
							<div key={group} className={categoryStyles.section}>
								<h3 className={categoryStyles.title}>
									{group} {ownedInGroup}/{totalInGroup} - {completionPercentage}
									%
								</h3>
								<div className={categoryStyles.grid}>
									{groupData.display.map((item) => {
										const itemIndex = allItems.indexOf(item);
										return (
											<ItemCard
												key={`${item.name}-${itemIndex}`}
												item={item}
												index={itemIndex}
												onToggleOwned={onToggleOwned}
												onToggleObtainedDuringLeague={
													onToggleObtainedDuringLeague
												}
												onToggleFoil={onToggleFoil}
												onEdit={onEdit}
											/>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export default Vault;
