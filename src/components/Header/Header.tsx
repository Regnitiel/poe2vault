import React from "react";
import { TabType } from "../../types";
import styles from "./styles.module.css";

interface HeaderProps {
	currentTab: TabType;
	onTabChange: (tab: TabType) => void;
}

const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange }) => {
	const tabs: { key: TabType; label: string }[] = [
		{ key: "home", label: "Home" },
		{ key: "vault", label: "Vault" },
		{ key: "utils", label: "Utils" },
	];

	return (
		<header className={styles.header}>
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
		</header>
	);
};

export default Header;
