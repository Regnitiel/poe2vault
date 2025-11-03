import React from "react";
import styles from "./styles.module.css";

interface UpdateModalProps {
	isOpen: boolean;
	version: string;
	releaseNotes: string;
	onAccept: () => void;
	onDecline: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
	isOpen,
	version,
	releaseNotes,
	onAccept,
	onDecline,
}) => {
	if (!isOpen) return null;

	const lines = (releaseNotes || "").split("\n").filter(Boolean);

	return (
		<div className={styles.overlay}>
			<div className={styles.modal}>
				<div className={styles.header}>
					<h2>Update Available</h2>
					<p className={styles.version}>Version {version}</p>
				</div>
				<div className={styles.content}>
					<h3>Release notes</h3>
					<div className={styles.notes}>
						{lines.length === 0 ? (
							<p>No release notes provided.</p>
						) : (
							lines.map((l, i) => <p key={i}>{l}</p>)
						)}
					</div>
				</div>
				<div className={styles.actions}>
					<button
						className={`${styles.btn} ${styles.secondary}`}
						onClick={onDecline}
					>
						Not now
					</button>
					<button
						className={`${styles.btn} ${styles.primary}`}
						onClick={onAccept}
					>
						Update
					</button>
				</div>
			</div>
		</div>
	);
};

export default UpdateModal;
