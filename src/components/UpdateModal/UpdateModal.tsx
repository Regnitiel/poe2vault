import React from "react";
import styles from "./styles.module.css";

interface UpdateModalProps {
	isOpen: boolean;
	updateInfo: {
		version: string;
		releaseNotes: string;
	} | null;
	isDownloading: boolean;
	downloadProgress: number;
	onAccept: () => void;
	onDecline: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
	isOpen,
	updateInfo,
	isDownloading,
	downloadProgress,
	onAccept,
	onDecline,
}) => {
	if (!isOpen || !updateInfo) {
		return null;
	}

	return (
		<div className={styles.updateModalOverlay}>
			<div className={styles.updateModal}>
				<div className={styles.updateModalHeader}>
					<h2>🎉 Update Available!</h2>
					<p className={styles.updateVersion}>
						Version {updateInfo.version} is ready to install
					</p>
				</div>

				<div className={styles.updateModalContent}>
					<div className={styles.releaseNotesSection}>
						<h3>What's New:</h3>
						<div className={styles.releaseNotes}>
							{updateInfo.releaseNotes.split("\n").map((line, index) => (
								<p key={index}>{line}</p>
							))}
						</div>
					</div>

					{isDownloading && (
						<div className={styles.downloadProgress}>
							<div className={styles.progressLabel}>
								Downloading update... {downloadProgress}%
							</div>
							<div className={styles.progressBar}>
								<div
									className={styles.progressFill}
									style={{ width: `${downloadProgress}%` }}
								></div>
							</div>
						</div>
					)}
				</div>

				{!isDownloading && (
					<div className={styles.updateModalActions}>
						<button
							className={`${styles.updateButton} ${styles.decline}`}
							onClick={onDecline}
						>
							Not Now
						</button>
						<button
							className={`${styles.updateButton} ${styles.accept}`}
							onClick={onAccept}
						>
							Update Now
						</button>
					</div>
				)}

				{isDownloading && (
					<div className={styles.updateModalActions}>
						<p className={styles.downloadingText}>
							Please wait while the update is being downloaded...
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default UpdateModal;
