import React, { useState } from "react";
import { VaultItem, FilterType } from "../../types";
import { groupItemsByCategory } from "../../utils/helpers";
import ItemCard from "../ItemCard/ItemCard";
import styles from "./styles.module.css";
import categoryStyles from "../../styles/CategorySection.module.css";

interface VaultProps {
	allItems: VaultItem[];
	currentFilter: FilterType;
	categoryFilter: FilterType | null;
	filters: {
		onlyOwned: boolean;
		onlyUnowned: boolean;
		onlyLeague: boolean;
		canBeChanced: boolean;
	};
	searchQuery: string;
	excludeDisabledFromTotal?: boolean;
	onFilterChange: (filter: FilterType) => void;
	onCategoryFilterChange: (filter: FilterType | null) => void;
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
	categoryFilter,
	filters,
	searchQuery,
	excludeDisabledFromTotal = false,
	onFilterChange,
	onCategoryFilterChange,
	onFiltersChange,
	onToggleOwned,
	onToggleObtainedDuringLeague,
	onToggleFoil,
	onEdit,
}) => {
	const filteredItems = excludeDisabledFromTotal
		? allItems.filter((item) => !item.disabled)
		: allItems;

	const groupedItems = groupItemsByCategory(
		filteredItems,
		currentFilter,
		categoryFilter,
		filters,
		searchQuery
	);
	const sortedGroups = Object.keys(groupedItems).sort();

	const leagueFilters: { key: FilterType; label: string }[] = [
		{ key: "all", label: "All" },
		{ key: "0.1", label: "0.1" },
		{ key: "0.2", label: "0.2" },
		{ key: "0.3", label: "0.3" },
		{ key: "0.4", label: "0.4" },
		{ key: "Bosses", label: "Bosses" },
		{ key: "Special", label: "Special Condition" },
	];

	const categoryFilters: { key: FilterType; label: string }[] = [
		{ key: "Amulet", label: "Amulet" },
		{ key: "Belt", label: "Belt" },
		{ key: "Body", label: "Body Armour" },
		{ key: "Boots", label: "Boots" },
		{ key: "Bow", label: "Bow" },
		{ key: "Buckler", label: "Buckler" },
		{ key: "Charm", label: "Charm" },
		{ key: "Crossbow", label: "Crossbow" },
		{ key: "Flask", label: "Flask" },
		{ key: "Focus", label: "Focus" },
		{ key: "Gloves", label: "Gloves" },
		{ key: "Helm", label: "Helm" },
		{ key: "Jewel", label: "Jewel" },
		{ key: "One Hand Mace", label: "One Hand Mace" },
		{ key: "Quartertaff", label: "Quarterstaff" },
		{ key: "Quiver", label: "Quiver" },
		{ key: "Relic", label: "Relic" },
		{ key: "Ring", label: "Ring" },
		{ key: "Sceptre", label: "Sceptre" },
		{ key: "Shield", label: "Shield" },
		{ key: "Spear", label: "Spear" },
		{ key: "Staff", label: "Staff" },
		{ key: "Tablet", label: "Tablet" },
		{ key: "Talisman", label: "Talisman" },
		{ key: "Two Hand Mace", label: "Two Hand Mace" },
		{ key: "Wand", label: "Wand" },
	];

	return (
		<section id="vault" className={styles.vaultSection}>
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
				<div className={styles.sidebarSeparator}></div>
				<select
					className={styles.categoryDropdown}
					value={categoryFilter || ""}
					onChange={(e) => {
						onCategoryFilterChange(
							e.target.value ? (e.target.value as FilterType) : null
						);
					}}
				>
					<option value="">All Categories</option>
					{categoryFilters.map((filter) => (
						<option key={filter.key} value={filter.key}>
							{filter.label}
						</option>
					))}
				</select>
			</aside>

			<div className={styles.itemsWrapper}>
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
								{group} {ownedInGroup}/{totalInGroup} - {completionPercentage}%
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
		</section>
	);
};
export default Vault;
