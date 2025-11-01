import React from "react";
import { VaultItem, TabType, FilterType } from "../../types";
import {
	calculateHomeMetrics,
	calculateCategoryMetrics,
	calculateItemCategoryMetrics,
} from "../../utils/helpers";
import ProgressBar from "../ProgressBar/ProgressBar";
import styles from "./styles.module.css";

interface HomeProps {
	allItems: VaultItem[];
	onTabChange?: (tab: TabType) => void;
	onFilterChange?: (filter: FilterType) => void;
}

const Home: React.FC<HomeProps> = ({
	allItems,
	onTabChange,
	onFilterChange,
}) => {
	const homeMetrics = calculateHomeMetrics(allItems);
	const categoryMetrics = calculateCategoryMetrics(allItems);
	const itemCategoryMetrics = calculateItemCategoryMetrics(allItems);

	const handleProgressBarClick = (tab: TabType, filter: FilterType) => {
		if (onTabChange && onFilterChange) {
			onTabChange(tab);
			onFilterChange(filter);
		}
	};

	const handleCategoryClick = (category: string) => {
		if (onTabChange && onFilterChange) {
			onTabChange("vault");
			onFilterChange(category as FilterType);
		}
	};

	return (
		<section id="home" className="active">
			{/* Progress Bar */}
			<div className={styles.metrics}>
				<h2>Collection Progress</h2>
				<ProgressBar
					owned={homeMetrics.ownedUniques}
					total={homeMetrics.totalUniques}
					label="Total Uniques"
					onClick={() => handleProgressBarClick("vault", "all")}
				/>
				<ProgressBar
					owned={categoryMetrics["0.1"].owned}
					total={categoryMetrics["0.1"].total}
					label="0.1 Uniques"
					onClick={() => handleProgressBarClick("vault", "0.1")}
				/>
				<ProgressBar
					owned={categoryMetrics["0.2"].owned}
					total={categoryMetrics["0.2"].total}
					label="0.2 Uniques"
					onClick={() => handleProgressBarClick("vault", "0.2")}
				/>
				<ProgressBar
					owned={categoryMetrics["0.3"].owned}
					total={categoryMetrics["0.3"].total}
					label="0.3 Uniques"
					onClick={() => handleProgressBarClick("vault", "0.3")}
				/>
				<ProgressBar
					owned={categoryMetrics["Bosses"].owned}
					total={categoryMetrics["Bosses"].total}
					label="Bosses Uniques"
					onClick={() => handleProgressBarClick("vault", "Bosses")}
				/>
				<ProgressBar
					owned={categoryMetrics["Special"].owned}
					total={categoryMetrics["Special"].total}
					label="Special Uniques"
					onClick={() => handleProgressBarClick("vault", "Special")}
				/>
			</div>

			{/* Category Progress Bars */}
			<div className={styles.metrics}>
				<h2>Progress by Category</h2>
				<div className={styles.categoryGrid}>
					{Object.entries(itemCategoryMetrics).map(([category, metrics]) => (
						<ProgressBar
							key={category}
							owned={metrics.owned}
							total={metrics.total}
							label={category}
							onClick={() => handleCategoryClick(category)}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default Home;
