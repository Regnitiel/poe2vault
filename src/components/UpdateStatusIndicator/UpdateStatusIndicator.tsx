import React from "react";
import styles from "./styles.module.css";

interface UpdateStatusIndicatorProps {
	status:
		| "idle"
		| "checking"
		| "available"
		| "downloading"
		| "downloaded"
		| "up-to-date"
		| "error";
	onUpdateClick?: () => void;
}

const UpdateStatusIndicator: React.FC<UpdateStatusIndicatorProps> = ({
	status,
	onUpdateClick,
}) => {
	const getStatusText = () => {
		switch (status) {
			case "checking":
				return "Checking for updates...";
			case "available":
				return "Update available!";
			case "downloading":
				return "Downloading update...";
			case "downloaded":
				return "Update ready";
			case "up-to-date":
				return "Up to date";
			case "error":
				return "Update check failed";
			default:
				return "";
		}
	};

	const getStatusIcon = () => {
		switch (status) {
			case "checking":
				return "🔄";
			case "available":
				return "🎉";
			case "downloading":
				return "⬇️";
			case "downloaded":
				return "✅";
			case "up-to-date":
				return "☑️";
			case "error":
				return "❌";
			default:
				return "";
		}
	};

	if (status === "idle") {
		return null;
	}

	return (
		<div
			className={`${styles.updateStatusIndicator} ${
				status === "available" ? styles.clickable : ""
			}`}
			onClick={status === "available" ? onUpdateClick : undefined}
		>
			<span
				className={`${styles.updateIcon} ${
					status === "checking" ? styles.spinning : ""
				}`}
			>
				{getStatusIcon()}
			</span>
			<span className={styles.updateText}>{getStatusText()}</span>
		</div>
	);
};

export default UpdateStatusIndicator;
