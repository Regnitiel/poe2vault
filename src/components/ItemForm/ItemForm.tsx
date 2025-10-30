import React, { useState, useEffect } from "react";
import { VaultItem } from "../../types";
import { getUniqueObtainMethods } from "../../utils/helpers";
import styles from "./styles.module.css";

interface FormField {
	name: keyof VaultItem;
	label: string;
	type: "text" | "url" | "select" | "custom-select";
	required?: boolean;
	options?: { value: string; label: string }[];
}

const itemFormFields: FormField[] = [
	{
		name: "name",
		label: "Name",
		type: "text",
		required: true,
	},
	{
		name: "base",
		label: "Base",
		type: "text",
		required: true,
	},
	{
		name: "category",
		label: "Category",
		type: "text",
		required: true,
	},
	{
		name: "league",
		label: "League",
		type: "text",
		required: true,
	},
	{
		name: "obtainMethod",
		label: "Obtain Method",
		type: "custom-select",
		required: true,
	},
	{
		name: "owned",
		label: "Owned",
		type: "select",
		required: true,
		options: [
			{ value: "false", label: "No" },
			{ value: "true", label: "Yes" },
		],
	},
	{
		name: "obtainedDuringLeague",
		label: "Obtained During League",
		type: "select",
		required: true,
		options: [
			{ value: "false", label: "No" },
			{ value: "true", label: "Yes" },
		],
	},
	{
		name: "bosses",
		label: "Bosses",
		type: "select",
		required: true,
		options: [
			{ value: "false", label: "No" },
			{ value: "true", label: "Yes" },
		],
	},
	{
		name: "special",
		label: "Special",
		type: "select",
		required: true,
		options: [
			{ value: "false", label: "No" },
			{ value: "true", label: "Yes" },
		],
	},
	{
		name: "foil",
		label: "Foil",
		type: "select",
		required: true,
		options: [
			{ value: "false", label: "No" },
			{ value: "true", label: "Yes" },
		],
	},
	{
		name: "disabled",
		label: "Disabled",
		type: "select",
		required: true,
		options: [
			{ value: "false", label: "No" },
			{ value: "true", label: "Yes" },
		],
	},
	{
		name: "imageLink",
		label: "Image URL",
		type: "url",
		required: true,
	},
	{
		name: "wikiLink",
		label: "Wiki URL",
		type: "url",
		required: true,
	},
];

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

	const renderFormField = (field: FormField) => {
		const { name, label, type, required, options } = field;

		if (type === "custom-select" && name === "obtainMethod") {
			return (
				<label className={styles.label} key={name}>
					{label}:
					<div className={styles.obtainMethodContainer}>
						<select
							className={styles.select}
							value={showCustomInput ? "custom" : formData.obtainMethod}
							onChange={handleObtainMethodChange}
							required={required}
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
								className={styles.input}
								type="text"
								value={customObtainMethod}
								onChange={(e) => setCustomObtainMethod(e.target.value)}
								placeholder="Enter new obtain method"
							/>
						)}
					</div>
				</label>
			);
		}

		if (type === "select" && options) {
			return (
				<label className={styles.label} key={name}>
					{label}:
					<select
						className={styles.select}
						name={name}
						value={(formData[name] as boolean).toString()}
						onChange={handleChange}
						required={required}
					>
						{options.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</label>
			);
		}

		return (
			<label key={name} className={styles.label}>
				{label}:
				<input
					className={styles.input}
					type={type}
					name={name}
					value={formData[name] as string}
					onChange={handleChange}
					required={required}
				/>
			</label>
		);
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			{itemFormFields.map(renderFormField)}

			<button className={styles.submitButton} type="submit">
				{submitLabel}
			</button>
			{onCancel && (
				<button
					className={styles.cancelButton}
					type="button"
					onClick={onCancel}
				>
					Cancel
				</button>
			)}
		</form>
	);
};

export default ItemForm;
