import React from "react";
import { VaultItem } from "../../types";
import {
	calculateHomeMetrics,
	calculateCategoryMetrics,
} from "../../utils/helpers";
import styles from "./styles.module.css";

interface HomeProps {
	allItems: VaultItem[];
}

const Home: React.FC<HomeProps> = ({ allItems }) => {
	const homeMetrics = calculateHomeMetrics(allItems);
	const categoryMetrics = calculateCategoryMetrics(allItems);

	return (
		<section id="home" className="active">
			{/* General Metrics Table */}
			<div className={styles.metrics}>
				<h2 style={{ color: "#ff6b6b" }}>
					📊 General Metrics (App is Working!) 📊
				</h2>
				<table id="generalMetrics" className={styles.table}>
					<tbody>
						<tr>
							<th>Metrics</th>
							<th>Value</th>
						</tr>
						<tr>
							<td>Total uniques in game</td>
							<td>{homeMetrics.totalUniques}</td>
						</tr>
						<tr>
							<td>Collected during current league</td>
							<td>{homeMetrics.collectedCurrentLeague}</td>
						</tr>
						<tr>
							<td>Owned uniques</td>
							<td>{homeMetrics.ownedUniques}</td>
						</tr>
						<tr>
							<td>Remaining uniques</td>
							<td>{homeMetrics.remainingUniques}</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* League/Special/Bosses Metrics Table */}
			<div className={styles.metrics}>
				<h2>By League / Special / Bosses</h2>
				<table id="leagueMetrics" className={styles.table}>
					<tbody>
						<tr>
							<th>Metrics</th>
							<th>0.1</th>
							<th>0.2</th>
							<th>0.3</th>
							<th>Bosses</th>
							<th>Special</th>
						</tr>
						<tr>
							<td>Total</td>
							<td>{categoryMetrics["0.1"].total}</td>
							<td>{categoryMetrics["0.2"].total}</td>
							<td>{categoryMetrics["0.3"].total}</td>
							<td>{categoryMetrics.Bosses.total}</td>
							<td>{categoryMetrics.Special.total}</td>
						</tr>
						<tr>
							<td>Owned</td>
							<td>{categoryMetrics["0.1"].owned}</td>
							<td>{categoryMetrics["0.2"].owned}</td>
							<td>{categoryMetrics["0.3"].owned}</td>
							<td>{categoryMetrics.Bosses.owned}</td>
							<td>{categoryMetrics.Special.owned}</td>
						</tr>
						<tr>
							<td>League</td>
							<td>{categoryMetrics["0.1"].league}</td>
							<td>{categoryMetrics["0.2"].league}</td>
							<td>{categoryMetrics["0.3"].league}</td>
							<td>{categoryMetrics.Bosses.league}</td>
							<td>{categoryMetrics.Special.league}</td>
						</tr>
						<tr>
							<td>Remaining</td>
							<td>{categoryMetrics["0.1"].remaining}</td>
							<td>{categoryMetrics["0.2"].remaining}</td>
							<td>{categoryMetrics["0.3"].remaining}</td>
							<td>{categoryMetrics.Bosses.remaining}</td>
							<td>{categoryMetrics.Special.remaining}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>
	);
};

export default Home;
