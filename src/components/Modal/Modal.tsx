import React from "react";
import { VaultItem } from "../../types";
import ItemForm from "../ItemForm/ItemForm";
import styles from "./styles.module.css";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
	if (!isOpen) return null;

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<div
			className={styles.modal}
			style={{ display: "block" }}
			onClick={handleBackdropClick}
		>
			<div className={styles.modalContent}>
				<span className={styles.modalClose} onClick={onClose}>
					&times;
				</span>
				<h2>{title}</h2>
				{children}
			</div>
		</div>
	);
};

interface EditModalProps {
	isOpen: boolean;
	allItems: VaultItem[];
	editingItem: VaultItem | null;
	editingIndex: number | null;
	onClose: () => void;
	onSave: (index: number, item: VaultItem) => void;
	onDelete: (index: number) => void;
}

export const EditModal: React.FC<EditModalProps> = ({
	isOpen,
	allItems,
	editingItem,
	editingIndex,
	onClose,
	onSave,
	onDelete,
}) => {
	const handleSave = (item: VaultItem) => {
		if (editingIndex !== null) {
			onSave(editingIndex, item);
			onClose();
		}
	};

	const handleDelete = () => {
		if (
			editingIndex !== null &&
			confirm("Are you sure you want to delete this item?")
		) {
			onDelete(editingIndex);
			onClose();
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Edit Item">
			{editingItem && (
				<>
					<ItemForm
						allItems={allItems}
						editingItem={editingItem}
						onSubmit={handleSave}
						onCancel={onClose}
						submitLabel="Save Changes"
					/>
					<div className={styles.modalButtons}>
						<button
							type="button"
							className={styles.deleteBtn}
							onClick={handleDelete}
						>
							Delete Item
						</button>
					</div>
				</>
			)}
		</Modal>
	);
};

export default Modal;
