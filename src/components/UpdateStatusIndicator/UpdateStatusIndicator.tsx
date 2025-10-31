import React from "react";
import "./styles.css";

interface UpdateStatusIndicatorProps {
	status:
		| "idle"
		| "checking"
		| "available"
		| "downloading"
		| "downloaded"
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
			className={`updateStatusIndicator ${
				status === "available" ? "clickable" : ""
			}`}
			onClick={status === "available" ? onUpdateClick : undefined}
		>
			<span className={`updateIcon ${status === "checking" ? "spinning" : ""}`}>
				{getStatusIcon()}
			</span>
			<span className="updateText">{getStatusText()}</span>
		</div>
	);
};

export default UpdateStatusIndicator;
