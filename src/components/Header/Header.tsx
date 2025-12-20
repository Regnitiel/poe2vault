import React from "react";
import { TabType } from "../../types";
import styles from "./styles.module.css";

interface HeaderProps {
	currentTab: TabType;
	onTabChange: (tab: TabType) => void;
	vaultControls?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
	currentTab,
	onTabChange,
	vaultControls,
}) => {
	const isDev = process.env.NODE_ENV === "development";

	const tabs: { key: TabType; label: string }[] = [
		{ key: "home", label: "Home" },
		{ key: "vault", label: "Vault" },
		{ key: "settings", label: "Settings" },
		...(isDev ? [{ key: "utils" as TabType, label: "Utils" }] : []),
	];

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
			{vaultControls && (
				<div className={styles.vaultControls}>{vaultControls}</div>
			)}
		</header>
	);
};

export default Header;
