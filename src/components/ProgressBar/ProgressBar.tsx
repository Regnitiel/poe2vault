import React from "react";
import styles from "./styles.module.css";

interface ProgressBarProps {
	owned: number;
	total: number;
	label: string;
	onClick: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
	owned,
	total,
	label,
	onClick,
}) => {
	const percentage = total > 0 ? Math.round((owned / total) * 100) : 0;

	const getProgressBarContainerClass = (percent: number): string => {
		if (percent >= 76) return styles.greenContainer;
		if (percent >= 51) return styles.yellowContainer;
		if (percent >= 26) return styles.orangeContainer;
		return styles.redContainer;
	};
	const getProgressBarClass = (percent: number): string => {
		if (percent >= 76) return styles.green;
		if (percent >= 51) return styles.yellow;
		if (percent >= 26) return styles.orange;
		return styles.red;
	};

	return (
		<div
			className={`${styles.progressContainer} ${getProgressBarContainerClass(
				percentage
			)}`}
			onClick={onClick}
		>
			<div className={styles.progressLabel}>
				<span className={styles.labelText}>{label}</span>
				<span className={styles.stats}>
					{owned}/{total}
				</span>
			</div>
			<div className={styles.progressBarBackground}>
				<div
					className={`${styles.progressBar} ${getProgressBarClass(percentage)}`}
					style={{ width: `${percentage}%` }}
				>
					<span className={styles.percentage}>{percentage}%</span>
				</div>
			</div>
		</div>
	);
};

export default ProgressBar;
