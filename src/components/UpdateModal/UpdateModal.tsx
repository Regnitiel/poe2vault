import React from "react";
import "./styles.css";

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
		<div className="updateModalOverlay">
			<div className="updateModal">
				<div className="updateModalHeader">
					<h2>🎉 Update Available!</h2>
					<p className="updateVersion">
						Version {updateInfo.version} is ready to install
					</p>
				</div>

				<div className="updateModalContent">
					<div className="releaseNotesSection">
						<h3>What's New:</h3>
						<div className="releaseNotes">
							{updateInfo.releaseNotes.split("\n").map((line, index) => (
								<p key={index}>{line}</p>
							))}
						</div>
					</div>

					{isDownloading && (
						<div className="downloadProgress">
							<div className="progressLabel">
								Downloading update... {downloadProgress}%
							</div>
							<div className="progressBar">
								<div
									className="progressFill"
									style={{ width: `${downloadProgress}%` }}
								></div>
							</div>
						</div>
					)}
				</div>

				{!isDownloading && (
					<div className="updateModalActions">
						<button className="updateButton decline" onClick={onDecline}>
							Not Now
						</button>
						<button className="updateButton accept" onClick={onAccept}>
							Update Now
						</button>
					</div>
				)}

				{isDownloading && (
					<div className="updateModalActions">
						<p className="downloadingText">
							Please wait while the update is being downloaded...
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default UpdateModal;
