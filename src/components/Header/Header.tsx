import React, { useEffect, useState } from "react";
import { TabType } from "../../types";
import styles from "./styles.module.css";

interface HeaderProps {
	currentTab: TabType;
	onTabChange: (tab: TabType) => void;
	onUpdateAvailable?: (info: {
		version: string;
		releaseNotes: string;
		url?: string;
	}) => void;
}

const Header: React.FC<HeaderProps> = ({
	currentTab,
	onTabChange,
	onUpdateAvailable,
}) => {
	const tabs: { key: TabType; label: string }[] = [
		{ key: "home", label: "Home" },
		{ key: "vault", label: "Vault" },
		{ key: "utils", label: "Utils" },
	];

	const [version, setVersion] = useState<string>("");
	const [checking, setChecking] = useState(false);
	const [upToDate, setUpToDate] = useState(false);

	useEffect(() => {
		const api = window.electronAPI;
		if (api && typeof api.getCurrentVersion === "function") {
			api
				.getCurrentVersion()
				.then((v) => setVersion(v))
				.catch(() => {});
		}
	}, []);

	const handleCheck = async () => {
		const api = window.electronAPI;
		if (!api || typeof api.checkForUpdates !== "function" || checking) return;
		setChecking(true);
		setUpToDate(false);
		try {
			const res = await api.checkForUpdates();
			if (res.status === "available") {
				onUpdateAvailable?.({
					version: res.version || "",
					releaseNotes: res.releaseNotes || "",
					url: res.url,
				});
				setUpToDate(false);
			} else if (res.status === "up-to-date") {
				setUpToDate(true);
			}
		} finally {
			setChecking(false);
		}
	};

	return (
		<header className={styles.header}>
			<div className={styles.centerTabs}>
				{tabs.map((tab) => (
					<button
						key={tab.key}
						className={`${styles.tabButton} ${
							currentTab === tab.key ? styles.active : ""
						}`}
						onClick={() => onTabChange(tab.key)}
					>
						{tab.label}
					</button>
				))}
			</div>
			<div className={styles.updateArea}>
				<span className={styles.versionText}>v{version}</span>
				<button
					className={styles.updateButton}
					onClick={handleCheck}
					disabled={checking}
				>
					{checking ? "Checking..." : "Check for updates"}
				</button>
				{upToDate && <div className={styles.upToDateText}>Up to date</div>}
			</div>
		</header>
	);
};

export default Header;
