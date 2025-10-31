import { useState, useEffect } from "react";
import { UpdateInfo, UpdateStatusType } from "../types";

export const useUpdateManager = () => {
	const [updateStatus, setUpdateStatus] = useState<UpdateStatusType>("idle");
	const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
	const [downloadProgress, setDownloadProgress] = useState(0);
	const [showUpdateModal, setShowUpdateModal] = useState(false);
	const [currentVersion, setCurrentVersion] = useState<string>("");

	useEffect(() => {
		if (!window.electronAPI) return;

		// Get current version
		window.electronAPI.getCurrentVersion().then(setCurrentVersion);

		// Set up event listeners
		window.electronAPI.onUpdateStatus((status: any) => {
			setUpdateStatus(status.status);
		});

		window.electronAPI.onUpdateAvailable((info: UpdateInfo) => {
			setUpdateInfo(info);
			setUpdateStatus("available");
			setShowUpdateModal(true);
		});

		window.electronAPI.onUpdateProgress((progress: any) => {
			setDownloadProgress(progress.progress);
		});

		window.electronAPI.onUpdateError((error: string) => {
			console.error("Update error:", error);
			setUpdateStatus("error");
		});
	}, []);

	const checkForUpdates = async () => {
		if (!window.electronAPI) return;

		try {
			setUpdateStatus("checking");
			await window.electronAPI.checkForUpdates();
		} catch (error) {
			console.error("Error checking for updates:", error);
			setUpdateStatus("error");
		}
	};

	const acceptUpdate = async () => {
		if (!window.electronAPI || !updateInfo) return;

		try {
			setUpdateStatus("downloading");
			setDownloadProgress(0);
			await window.electronAPI.downloadUpdate();
		} catch (error) {
			console.error("Error downloading update:", error);
			setUpdateStatus("error");
		}
	};

	const declineUpdate = () => {
		setShowUpdateModal(false);
		setUpdateStatus("idle");
		setUpdateInfo(null);
	};

	const openUpdateModal = () => {
		if (updateStatus === "available") {
			setShowUpdateModal(true);
		}
	};

	return {
		updateStatus,
		updateInfo,
		downloadProgress,
		showUpdateModal,
		currentVersion,
		checkForUpdates,
		acceptUpdate,
		declineUpdate,
		openUpdateModal,
		isDownloading: updateStatus === "downloading",
	};
};
