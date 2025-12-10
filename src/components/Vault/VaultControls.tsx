import React from "react";
import styles from "./styles.module.css";

interface VaultControlsProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	filters: {
		onlyOwned: boolean;
		onlyUnowned: boolean;
		onlyLeague: boolean;
		canBeChanced: boolean;
	};
	onFiltersChange: (filters: {
		onlyOwned: boolean;
		onlyUnowned: boolean;
		onlyLeague: boolean;
		canBeChanced: boolean;
	}) => void;
}

const VaultControls: React.FC<VaultControlsProps> = ({
	searchQuery,
	onSearchChange,
	filters,
	onFiltersChange,
}) => {
	return (
		<div className={styles.controls}>
			<input
				className={styles.searchInput}
				type="text"
				value={searchQuery}
				onChange={(e) => onSearchChange(e.target.value)}
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
		</div>
	);
};

export default VaultControls;
