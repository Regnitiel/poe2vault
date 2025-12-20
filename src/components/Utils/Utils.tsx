import React, { useState } from "react";
import { VaultItem } from "../../types";
import ItemForm from "../ItemForm/ItemForm";
import styles from "./styles.module.css";

interface UtilsProps {
	allItems: VaultItem[];
	onAddItem: (item: VaultItem) => void;
}

const Utils: React.FC<UtilsProps> = ({ allItems, onAddItem }) => {
	const handleAddItem = (item: VaultItem) => {
		onAddItem(item);
		alert("Item added successfully!");
	};

	return (
		<section id="utils" className={styles.utils}>
			<div className={styles.container}>
				<h1 className={styles.title}>Developer Utils</h1>
				<div className={styles.section}>
					<h2>Add New Item</h2>
					<ItemForm allItems={allItems} onSubmit={handleAddItem} />
				</div>
			</div>
		</section>
	);
};

export default Utils;
