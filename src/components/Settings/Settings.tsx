import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

interface SettingsProps {
	excludeDisabledFromTotal: boolean;
	onExcludeDisabledChange: (value: boolean) => void;
	onSelectJsonPath: () => void;
	jsonPath?: string;
	onUpdateAvailable?: (info: {
		version: string;
		releaseNotes: string;
		url?: string;
	}) => void;
}

const Settings: React.FC<SettingsProps> = ({
	excludeDisabledFromTotal,
	onExcludeDisabledChange,
	onSelectJsonPath,
	jsonPath,
	onUpdateAvailable,
}) => {
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

	const handleCheckUpdate = async () => {
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

	const handleFeedbackClick = () => {
		window.electronAPI?.openExternal("https://discord.gg/Rgq8CPYJ");
	};

	const handlePoEClick = () => {
		window.electronAPI?.openExternal("https://www.pathofexile.com");
	};

	const handlePoE2Click = () => {
		window.electronAPI?.openExternal("https://www.pathofexile2.com");
	};

	return (
		<section className={styles.settingsSection}>
			<div className={styles.container}>
				<h1 className={styles.title}>Settings</h1>

				{/* General Settings */}
				<div className={styles.section}>
					<h2 className={styles.sectionTitle}>General Settings</h2>

					<div className={styles.setting}>
						<label className={styles.label}>
							<input
								type="checkbox"
								checked={excludeDisabledFromTotal}
								onChange={(e) => onExcludeDisabledChange(e.target.checked)}
								className={styles.checkbox}
							/>
							<span>Don't count disabled items in totals</span>
						</label>
						<p className={styles.description}>
							When enabled, disabled items will be completely excluded from all
							counts and won't appear in the vault
						</p>
					</div>

					<div className={styles.setting}>
						<div className={styles.settingRow}>
							<div className={styles.settingInfo}>
								<label className={styles.label}>Vault Data Location</label>
								<p className={styles.description}>
									{jsonPath || "Default location"}
								</p>
							</div>
							<button onClick={onSelectJsonPath} className={styles.button}>
								Change Location
							</button>
						</div>
					</div>
				</div>

				{/* Feedback & Updates */}
				<div className={styles.section}>
					<h2 className={styles.sectionTitle}>Feedback & Updates</h2>

					<div className={styles.updateInfo}>
						<span className={styles.versionLabel}>
							Current Version: v{version}
						</span>
						{upToDate && (
							<span className={styles.upToDateLabel}>Up to date</span>
						)}
					</div>

					<div className={styles.buttonGroup}>
						<button
							onClick={handleCheckUpdate}
							className={styles.button}
							disabled={checking}
						>
							{checking ? "Checking..." : "Check for Updates"}
						</button>
						<button onClick={handleFeedbackClick} className={styles.button}>
							Join Discord for Feedback
						</button>
					</div>
				</div>

				{/* About Section */}
				<div className={styles.section}>
					<h2 className={styles.sectionTitle}>About</h2>

					<div className={styles.about}>
						<p className={styles.aboutText}>
							This application is an unofficial, fan-made tool created for the
							Path of Exile community.
						</p>
						<p className={styles.aboutText}>
							Path of Exile and Path of Exile 2 are developed and published by{" "}
							<strong>Grinding Gear Games</strong>.
						</p>
						<p className={styles.aboutText}>
							All intellectual property related to Path of Exile and Path of
							Exile 2, including all item images, icons, artwork, names, and any
							other recognisable game content, is the sole property of Grinding
							Gear Games.
						</p>
						<p className={styles.aboutText}>
							These item images are used here only in a non-commercial context,
							in accordance with GGG's guidance that recognisable Path of Exile
							assets may not be sold, used to advertise a paid service, or used
							in any way that generates revenue.
						</p>
						<p className={styles.aboutText}>
							This project is completely free and non-commercial, and does not
							accept donations, payments, or any form of monetization. No part
							of this tool is sold or placed behind any paid access.
						</p>

						<div className={styles.links}>
							<h3 className={styles.linksTitle}>Official game websites:</h3>
							<button onClick={handlePoEClick} className={styles.linkButton}>
								Path of Exile
							</button>
							<button onClick={handlePoE2Click} className={styles.linkButton}>
								Path of Exile 2
							</button>
						</div>

						<p className={styles.thanks}>
							Special thanks to Grinding Gear Games for creating and supporting
							these incredible games and their community.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Settings;
