import React from "react";
import { VaultItem } from "../../types";
import { openExternalLink, getImagePath } from "../../utils/data";
import styles from "./styles.module.css";

interface ItemCardProps {
	item: VaultItem;
	index: number;
	onToggleOwned: (index: number) => void;
	onToggleObtainedDuringLeague: (index: number) => void;
	onToggleFoil: (index: number) => void;
	onEdit: (index: number) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
	item,
	index,
	onToggleOwned,
	onToggleObtainedDuringLeague,
	onToggleFoil,
	onEdit,
}) => {
	const handleNameClick = () => {
		openExternalLink(item.wikiLink);
	};

	const getCardClasses = () => {
		let classes = styles.card;
		if (item.disabled) classes += ` ${styles.disabled}`;
		if (item.obtainedDuringLeague) classes += ` ${styles.obtainedDuringLeague}`;
		else if (item.owned) classes += ` ${styles.owned}`;
		if (item.foil) classes += ` ${styles.foil}`;
		return classes;
	};

	return (
		<div className={getCardClasses()}>
			<div className={styles.info}>
				<h4 className={styles.name} onClick={handleNameClick}>
					{item.name}
				</h4>
				<p className={styles.details}>
					<strong>Base:</strong> {item.base}
				</p>
				<p className={styles.details}>
					<strong>Category:</strong> {item.category}
				</p>
				<p className={styles.details}>
					<strong>League:</strong> {item.league}
				</p>
				<p className={styles.details}>
					<strong>Obtain:</strong> {item.obtainMethod}
				</p>
				<div className={styles.buttons}>
					<button
						className="btn btn-primary"
						onClick={() => onToggleOwned(index)}
					>
						{item.owned ? "Owned ✓" : "Owned"}
					</button>
					<button
						className="btn btn-primary"
						onClick={() => onToggleObtainedDuringLeague(index)}
					>
						{item.obtainedDuringLeague
							? "Obtained during league ✓"
							: "Obtained during league"}
					</button>
					<button
						className="btn btn-primary"
						onClick={() => onToggleFoil(index)}
					>
						{item.foil ? "Foil ✓" : "Foil"}
					</button>
					{/* Disabled for now in v1.0.0 */}
					{/* <button className="btn btn-secondary" onClick={() => onEdit(index)}>
						Edit
					</button> */}
				</div>
			</div>
			<div className={styles.image}>
				<img src={getImagePath(item.imageLink)} alt={item.name} />
			</div>
		</div>
	);
};

export default ItemCard;
