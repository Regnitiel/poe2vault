import React, { useState, useEffect } from "react";
import { VaultItem } from "../../types";
import { getUniqueObtainMethods } from "../../utils/helpers";
import styles from "./styles.module.css";

interface ItemFormProps {
	allItems: VaultItem[];
	editingItem?: VaultItem | null;
	onSubmit: (item: VaultItem) => void;
	onCancel?: () => void;
	submitLabel?: string;
}

const ItemForm: React.FC<ItemFormProps> = ({
	allItems,
	editingItem,
	onSubmit,
	onCancel,
	submitLabel = "Add Item",
}) => {
	const [formData, setFormData] = useState<VaultItem>({
		name: "",
		base: "",
		category: "",
		league: "",
		obtainMethod: "",
		owned: false,
		obtainedDuringLeague: false,
		bosses: false,
		special: false,
		foil: false,
		disabled: false,
		imageLink: "",
		wikiLink: "",
	});

	const [customObtainMethod, setCustomObtainMethod] = useState("");
	const [showCustomInput, setShowCustomInput] = useState(false);

	const obtainMethods = getUniqueObtainMethods(allItems);

	useEffect(() => {
		if (editingItem) {
			setFormData(editingItem);
			setCustomObtainMethod("");
			setShowCustomInput(false);
		}
	}, [editingItem]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value, type } = e.target;

		if (type === "checkbox") {
			const checked = (e.target as HTMLInputElement).checked;
			setFormData((prev) => ({ ...prev, [name]: checked }));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleObtainMethodChange = (
		e: React.ChangeEvent<HTMLSelectElement>
	) => {
		const value = e.target.value;
		if (value === "custom") {
			setShowCustomInput(true);
			setFormData((prev) => ({ ...prev, obtainMethod: "" }));
		} else {
			setShowCustomInput(false);
			setCustomObtainMethod("");
			setFormData((prev) => ({ ...prev, obtainMethod: value }));
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		let finalObtainMethod = formData.obtainMethod;
		if (showCustomInput) {
			if (!customObtainMethod.trim()) {
				alert("Please enter a custom obtain method.");
				return;
			}
			finalObtainMethod = customObtainMethod.trim();
		}

		onSubmit({
			...formData,
			obtainMethod: finalObtainMethod,
		});

		// Reset form if not editing
		if (!editingItem) {
			setFormData({
				name: "",
				base: "",
				category: "",
				league: "",
				obtainMethod: "",
				owned: false,
				obtainedDuringLeague: false,
				bosses: false,
				special: false,
				foil: false,
				disabled: false,
				imageLink: "",
				wikiLink: "",
			});
			setCustomObtainMethod("");
			setShowCustomInput(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<label>
				Name:
				<input
					type="text"
					name="name"
					value={formData.name}
					onChange={handleChange}
					required
				/>
			</label>

			<label>
				Base:
				<input
					type="text"
					name="base"
					value={formData.base}
					onChange={handleChange}
					required
				/>
			</label>

			<label>
				Category:
				<input
					type="text"
					name="category"
					value={formData.category}
					onChange={handleChange}
					required
				/>
			</label>

			<label>
				League:
				<input
					type="text"
					name="league"
					value={formData.league}
					onChange={handleChange}
					required
				/>
			</label>

			<label>
				Obtain Method:
				<div className={styles.obtainMethodContainer}>
					<select
						value={showCustomInput ? "custom" : formData.obtainMethod}
						onChange={handleObtainMethodChange}
						required
					>
						<option value="">Select obtain method...</option>
						{obtainMethods.map((method) => (
							<option key={method} value={method}>
								{method}
							</option>
						))}
						<option value="custom">+ Add new obtain method</option>
					</select>
					{showCustomInput && (
						<input
							type="text"
							value={customObtainMethod}
							onChange={(e) => setCustomObtainMethod(e.target.value)}
							placeholder="Enter new obtain method"
						/>
					)}
				</div>
			</label>

			<label>
				Owned:
				<select
					name="owned"
					value={formData.owned.toString()}
					onChange={handleChange}
					required
				>
					<option value="false">No</option>
					<option value="true">Yes</option>
				</select>
			</label>

			<label>
				Obtained During League:
				<select
					name="obtainedDuringLeague"
					value={formData.obtainedDuringLeague.toString()}
					onChange={handleChange}
					required
				>
					<option value="false">No</option>
					<option value="true">Yes</option>
				</select>
			</label>

			<label>
				Bosses:
				<select
					name="bosses"
					value={formData.bosses.toString()}
					onChange={handleChange}
					required
				>
					<option value="false">No</option>
					<option value="true">Yes</option>
				</select>
			</label>

			<label>
				Special:
				<select
					name="special"
					value={formData.special.toString()}
					onChange={handleChange}
					required
				>
					<option value="false">No</option>
					<option value="true">Yes</option>
				</select>
			</label>

			<label>
				Foil:
				<select
					name="foil"
					value={formData.foil.toString()}
					onChange={handleChange}
					required
				>
					<option value="false">No</option>
					<option value="true">Yes</option>
				</select>
			</label>

			<label>
				Disabled:
				<select
					name="disabled"
					value={(formData.disabled || false).toString()}
					onChange={handleChange}
					required
				>
					<option value="false">No</option>
					<option value="true">Yes</option>
				</select>
			</label>

			<label>
				Image URL:
				<input
					type="url"
					name="imageLink"
					value={formData.imageLink}
					onChange={handleChange}
					required
				/>
			</label>

			<label>
				Wiki URL:
				<input
					type="url"
					name="wikiLink"
					value={formData.wikiLink}
					onChange={handleChange}
					required
				/>
			</label>

			<button type="submit">{submitLabel}</button>
			{onCancel && (
				<button type="button" onClick={onCancel}>
					Cancel
				</button>
			)}
		</form>
	);
};

export default ItemForm;
